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
        this.set('isCommenting', true);
      },
      showEdit: function() {
        this.set('isEditing', true);
      },
      editPost: function() {
        var newPost = this.get('model');
        var newMessage = this.get('messageHTML').toString();
        newPost.get('message');
        newPost.set('message', newMessage);
        newPost.save()
        .then(function() {
          this.set('isEditing', false);
          // this.transitionTo('/post/');
        }.bind(this));
      }
    }
  });

  App.PostRoute = Ember.Route.extend({
    model: function(params) {
      return this.store.find('post', params.postId);
    }
  });

};
