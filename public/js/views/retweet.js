define(['marionette', 'tpl!templates/retweet.tmpl'],
  function (Marionette, RetweetTemplate) {
    return Marionette.ItemView.extend({
      'tagName': 'li',
      'template': RetweetTemplate
    });
  }
);
