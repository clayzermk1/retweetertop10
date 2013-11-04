# retweetertop10

Streams the top 10 retweets for a given filter.

Note about clients: Since Twitter only allows a single API connection at a time, only one filter may be used across _all_ clients at any given time. The clients will update on the fly if any one client changes the filter. Unless you change the IP address to something "real", the clients can only run on the same machine as the server.

Compatible OS/Browsers:
* Linux/Chrome
* Linux/Firefox
* iOS/Safari
* iOS/Chrome
* Android/Chrome

## Authentication

retweetertop10 requires that there be an `auth.json` in the root directory of the project.
This file should contain your Twitter OAuth credentials similar to:

```javascript
{
  "consumer_key": "...",
  "consumer_secret": "...",
  "access_token": "...",
  "access_token_secret": "..."
}
```

## Dependencies

Be sure to run `npm install && bower install` to fetch the latest dependencies.
Afterwards, be sure to build sockjs-client per [the instructions](https://github.com/sockjs/sockjs-client#development-and-testing).

```shell
cd public/vendor/sockjs-client
echo "echo \\" | cat - version > VERSION-GEN
npm install
npm install --dev
make sockjs.js
```

The application requires MongoDB 2.4.8 to be installed and running with a database called `retweetertop10` and a collection called `retweets`.

This application was built using node 0.10.21.

## Use

Start the server with `node index.js`.
Direct a browser on the same machine to [http://0.0.0.0:3000/](http://0.0.0.0:3000/).
