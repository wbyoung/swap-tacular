'use strict';

module.exports = function(App) {
  App.PostController = Ember.ObjectController.extend({
    isEditing: false,
    messageHTML: function() {
      var text = this.get('message');
      text = Ember.Handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
      return new Ember.Handlebars.SafeString(text);
    }.property('message').readOnly(),

    actions: {
      showComment: function() {
        this.set('isCommenting', true);
        this.transitionToRoute('comments');
      },
      showEdit: function() {
        this.set('isEditing', true);
      },
      editPost: function() {
        var newPost = this.get('model');
        newPost.save()
        .then(function() {
          this.set('isEditing', false);
          // this.transitionToRoute('/profile');
        }.bind(this));
      },
      deletePost: function() {
        var post = this.get('model');
        post.deleteRecord();
        post.save()
        .then(function() {
          this.transitionToRoute('/profile');
        }.bind(this));
      }
    }
  });

  App.PostRoute = Ember.Route.extend({
    model: function(params) {
      return this.store.find('post', params.postId);
    }, 
    afterModel: function() {

    },
    actions: {
      commentPost: function() {
        this.controllerFor('post').set('isCommenting', false);
        var message = this.controllerFor('post').get('inputComment');
        // var pID = this.currentModel.get('id');
        var create = {
          message: message,
        };
        var comment = this.store.createRecord('comment', create);
        comment.set('post', this.currentModel);
        this.controllerFor('post').set('inputComment', '');
        comment.save()
        .then(function() {
          this.transitionTo('/');
          // this.transitionTo('/post/' + pID);
        }.bind(this));
      }
    }
  });

};
