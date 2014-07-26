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
        this.transitionToRoute('comments');
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
    needs: ['post'],
    model: function(params) {
      return this.store.find('post', params.postId);
    }, 
    actions: {
      commentPost: function() {
        var self = this;
        var message = this.controllerFor('post').get('inputComment');
        var create = {
          message: message,
          userID: this.get('session').get('id'),
          postID: this.currentModel.get('id'),
        };
        console.log(create);
        var comment = this.store.createRecord('comment', create);
        // comment.set('post', this.currentModel);
        // this.currentModel.get('comments').add(comment);
        this.controllerFor('post').set('inputComment', '');
        comment.save();
      }
    }
  });

};
