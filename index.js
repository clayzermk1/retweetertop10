/**
 * retweetertop10
 *
 * Streams the top 10 retweets for a given filter.
 *
 * Copyright 2013 Clay Walker <clayzermk1@gmail.com>
 */

var _ = require('lodash'),
    Twit = require('twit'),
    auth = require('./auth.json'),
    T = new Twit(auth),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID,
    http = require('http'),
    express = require('express'),
    sockjs = require('sockjs'),
    fs = require('fs'),
    util = require('util');

// WebSocket connections
var connections = [];

// Our Twitter stream filter
var filter = 'Twitter';

// Connect to MongoDB
var db = new Db('retweetertop10', new Server('localhost', 27017), { 'w': 1 });
var retweets;
db.open(function (err, db) {
  if (err) console.error(err);

  retweets = db.collection('retweets');
});

// Connect to the Twitter streaming API
var stream = T.stream('statuses/filter', { 'track': filter });

// Attaches event handlers to the Twitter stream
function registerStreamHandlers (s) {
  s.on('tweet', function (tweet) {
    if (tweet['retweeted_status'] !== void 0) {
      var retweet = tweet['retweeted_status'];

      // Add the current filter to the retweet
      retweet.filter = filter;

      // Upsert each retweeted tweet into the database
      retweets.update({ 'id': retweet.id, 'filter': filter }, retweet, { 'w': 1, 'upsert': true }, function (err, result) {
        if (err) console.error(err);

        // Remove old tweets
        retweets.findOne({ 'filter': filter }, { 'sort': { 'retweet_count': -1 }, 'skip': 9, 'limit': 1 }, function (err, doc) {
          if (err) console.error(err);

          if (doc !== null) {
            retweets.remove({ 'filter': filter, 'retweet_count': { '$lt': doc['retweet_count'] } }, { 'w': 0 });
          }
        });

        // Find the top 10 for the filter
        retweets.find({ 'filter': filter }, { 'sort': { 'retweet_count': -1 }, 'limit': 10 }).toArray(function (err, docs) {
          if (err) console.error(err);

          // Send the filter and the new top 10 list to all clients
          _.each(connections, function (connection) {
            connection.write(JSON.stringify({
              'filter': filter,
              'retweets': docs
            }));
          });
        });
      });
    }
  });
}
registerStreamHandlers(stream);

// Web Server
var app = express();
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({
  'dest': __dirname + '/public/css',
  'src': __dirname + '/public/less',
  'prefix': '/css'
}));
app.use(express.static(__dirname + '/public'));

// Static content
app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});

// API endpoint for getting the current filter (we can only have one stream open at a time)
app.get('/api/filter', function(req, res) {
  res.send({ 'filter': filter });
});

// API endpoint for submitting a filter
app.post('/api/filter', function(req, res) {
  // Update the filter
  if (req.body.filter === void 0 || req.body.filter === '') {
    filter = 'Twitter';
  } else {
    filter = req.body.filter;
  }
  console.log('filter changed to', filter);

  // Update the stream
  stream.stop();
  stream = T.stream('statuses/filter', { 'track': filter });
  registerStreamHandlers(stream);
});

// API endpoint initializing the top 10 retweets
app.get('/api/retweets', function(req, res) {
  retweets.find({ 'filter': filter }, { 'sort': { 'retweet_count': -1 }, 'limit': 10 }).toArray(function (err, docs) {
    if (err) console.error(err);

    res.send(docs);
  });
});

var server = http.createServer(app);

// WebSockets
var socket = sockjs.createServer({ 'sockjs_url': 'http://cdn.sockjs.org/sockjs-0.3.min.js' });

socket.on('connection', function(connection) {
  var id = connection.id = new ObjectID().toHexString();

  connections.push(connection);

  connection.on('close', function() {
    _.remove(connections, function (connection) {
      return connection.id === id;
    });
  });
});

socket.installHandlers(server, { 'prefix': '/ws' });

server.listen(3000, '0.0.0.0');
