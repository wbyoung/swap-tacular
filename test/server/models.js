'use strict';

// var _ = require('lodash');
var expect = require('chai').expect;
var bluebird = require('bluebird'), Promise = bluebird;
var models = require('../../server/models');

var Post = models.Post,
    User = models.User,
    Comment = models.Comment;

// create user & save
var createUser = function() {
  var create = {
    username: 'testdude',
    passwordDigest: 'digest'
  };
  return User.forge(create).save();
};

// create post associated with that user & save
var createPost = function(user) {
  var create = {
    message: 'what is up',
    userID: user.id
  };
  return Post.forge(create).save();
};

//create comment associated with that post and user
var createComment = function(user, post) {
  var create = {
    message: 'What do you mean what\'s up:',
    userID: user.id,
    postID: post.id
  };
  return Comment.forge(create).save();
};

describe('server', function() {
  afterEach(function(done) {
    Promise.resolve() // start promise sequence
    .then(function() {
      return models._bookshelf.knex('comments').del();
    })
    .then(function() {
      return models._bookshelf.knex('posts').del();
    })
    .then(function() {
      return models._bookshelf.knex('users').del();
    }).done(function() { done(); }, done);
  });
  it('will get post models', function(done){
    

    Promise.resolve()
    .then(function() { return createUser(); })
    .then(function(user) { return createPost(user); })
    .then(function() { return Post.fetchAll(); })
    .then(function(collection) {
      expect(collection.length).to.eql(1);
      expect(collection.at(0).get('message')).to.eql('what is up');    
      expect(collection.at(0).get('created_at')).to.exist;    
      expect(collection.at(0).get('updated_at')).to.exist;
    })
    .done(function() { done(); }, done);
  });

  it('will get comment models', function(done) {
    Promise.bind({})
    .then(function() { return createUser(); })
    .then(function(user) { 
      this.user = user;
      return createPost(user); 
    })
    .then(function(post) {
      return createComment(this.user, post); })
    .then(function() { return Comment.fetchAll(); })
    .then(function(collection) {
      expect(collection.length).to.eql(1);
      expect(collection.at(0).get('message')).to.eql('What do you mean what\'s up:');    
      expect(collection.at(0).get('created_at')).to.exist;    
      expect(collection.at(0).get('updated_at')).to.exist;
    })
    .done(function() { done(); }, done);
  });
});
