'use strict';

module.exports = function(App) {

  App.PostController = Ember.ObjectController.extend({
    isEditing: false,
    messageHTML: function() {
      var text = this.get('message');
      text = Ember.Handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
      return new Ember.Handlebars.SafeString(text);
    }.property('message'),

    actions: {
      showComment: function() {
        this.set('isEditing', true);
      }
    }
  });

  App.PostRoute = Ember.Route.extend({
    model: function(params) {
      return this.store.find('post', params.postId);
    }
  });

};
