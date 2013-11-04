define(['marionette', 'collections/retweets', 'views/retweet'],
  function (Marionette, Retweets, RetweetView) {
    return Marionette.CollectionView.extend({
      'tagName': 'ul',
      'collection': new Retweets([]),
      'itemView': RetweetView,
      'initialize': function () {
        this.collection.fetch();
      }
    });
  }
);
