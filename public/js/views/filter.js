define(['marionette', 'models/filter', 'tpl!templates/filter.tmpl'],
  function (Marionette, Filter, FilterTemplate) {
    return Marionette.ItemView.extend({
      'model': new Filter({}),
      'template': FilterTemplate,
      'ui': {
        'search': '#search'
      },
      'events': {
        'keyup #search': 'onSearchKeyup'
      },
      'modelEvents': {
        'change': 'onModelChange'
      },
      'initialize': function () {
        this.model.fetch();
      },
      'onSearchKeyup': function (e) {
        if (e.keyCode === 13) {
          var $ect = $(e.currentTarget);
          this.model.save({ 'filter': $ect.val() });
        }
      },
      'onModelChange': function (e) {
        this.ui.search.val(this.model.get('filter'));
      }
    });
  }
);
