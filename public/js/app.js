define(
  ['backbone', 'marionette', 'sockjs', 'views/filter', 'views/retweets'],
  function (Backbone, Marionette, SockJS, FilterView, RetweetsView) {
    var app = new Marionette.Application();

    app.addRegions({
      'filter': '#filter',
      'retweets': '#retweets'
    });

    app.addInitializer(function(options){
      app.filter.show(new FilterView());
      app.retweets.show(new RetweetsView());

      // Connect to the WebSocket
      var sock = new SockJS('http://0.0.0.0:3000/ws');
      sock.onmessage = function(e) {
        // console.log('ws message');
        var message = JSON.parse(e.data);
        app.filter.currentView.model.set({ 'filter': message.filter });
        app.retweets.currentView.collection.reset(message.retweets);
      };
    });

    app.on('initialize:after', function(options){
      if (Backbone.history){
        Backbone.history.start();
      }
    });

    return app;
  }
);
