'use strict';

// var _ = require('lodash');
var expect = require('chai').expect;
var bluebird = require('bluebird'), Promise = bluebird;
var models = require('../../server/models');

var Post = models.Post,
    User = models.User;

describe('server', function() {
  afterEach(function(done) {
    Promise.resolve() // start promise sequence
    .then(function() {
      return models._bookshelf.knex('posts').del();
    })
    .then(function() {
      return models._bookshelf.knex('users').del();
    }).done(function() { done(); }, done);
  });
  it('will get post models', function(done){
    // create user & save
    var createUser = function() {
      var create = {
        username: 'testdude',
        passwordDigest: 'digest'
      };
      return User.forge(create).save();
    };
    
    // create post assoiated with that user & save
    var createPost = function(user) {
      var create = {
        content: 'what is up',
        userID: user.id
      };
      return Post.forge(create).save();
    };

    Promise.resolve()
    .then(function() { return createUser(); })
    .then(function(user) { return createPost(user); })
    .then(function() { return Post.fetchAll(); })
    .then(function(collection) {
      expect(collection.length).to.eql(1);
      expect(collection.at(0).get('content')).to.eql('what is up');    
      expect(collection.at(0).get('created_at')).to.exist;    
      expect(collection.at(0).get('updated_at')).to.exist;
    })
    .done(function() { done(); }, done);
  });
});
