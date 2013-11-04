require.config({
  'paths' : {
    'backbone': '../vendor/backbone/backbone',
    'backbone.babysitter': '../vendor/backbone.babysitter/lib/amd/backbone.babysitter',
    'backbone.eventbinder': '../vendor/backbone.eventbinder/lib/amd/backbone.eventbinder',
    'backbone.wreqr': '../vendor/backbone.wreqr/lib/amd/backbone.wreqr',
    'bootstrap': '../vendor/bootstrap/dist/js/bootstrap',
    'marionette': '../vendor/backbone.marionette/lib/core/amd/backbone.marionette',
    'jquery': '../vendor/jquery/jquery',
    'json2': '../vendor/json2/json2',
    'sockjs': '../vendor/sockjs-client/sockjs', // requires building, see README.md
    'text': '../vendor/text/text',
    'tpl': '../vendor/tpl/tpl',
    'underscore': '../vendor/lodash/dist/lodash'
  },
  'shim': {
    'backbone': {
      'deps': ['jquery', 'underscore'],
      'exports': 'Backbone'
    },
    'bootstrap': {
      'deps': ['jquery']
    },
    'jquery': {
      'exports': 'jQuery'
    },
    'sockjs': {
      'exports': 'SockJS'
    },
    'underscore': {
      'exports': '_'
    }
  }
});

define(["app", "bootstrap", "sockjs"], function (App) {
    App.start();
});
