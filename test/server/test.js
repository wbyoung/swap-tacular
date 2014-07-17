'use strict';

var _ = require('lodash');
var expect = require('chai').expect;
var util = require('util');
var bluebird = require('bluebird'), Promise = bluebird;
var request = require('request'),
    requestAsync = bluebird.promisify(request, request);
var app = require('../../server/application');
var models = require('../../server/models');
var port = 383273;
var baseURL = util.format('http://localhost:%d', port);

var Post = models.Post,
    User = models.User,
    Token = models.Token;

var dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

var requestFixture = function(fixture) {
  var requestOptions = {
    url: baseURL + fixture.request.url,
    method: fixture.request.method,
    headers: _.extend({
    	'Content-Type': 'application/json'
    }, fixture.request.headers)
  };
  if (fixture.request.json) {
  	requestOptions.body = JSON.stringify(fixture.request.json);
  }
  return requestAsync(requestOptions);
};

describe('server', function() {
  before(function(done) { this.server = app.listen(port, function() { done(); }); });
  after(function(done) { this.server.close(done); });
  beforeEach(function(done) {
    Promise.resolve() // start promise sequence
    .then(function() {
      return models._bookshelf.knex('posts').del();
    })
    .then(function() {
      return models._bookshelf.knex('tokens').del();
    })
    .then(function() {
      return models._bookshelf.knex('users').del();
    }).done(function() { done(); }, done);
  });
  it('will get posts', function(done){
    var fixture = __fixture('postGET');

    var userSavePromises = function() {
      return fixture.response.json.users.map(function(user) {
        var create = {
          id: user.id,
          username: user.username,
          passwordDigest: 'digest'
        };
        return User.forge(create).save({}, { method: 'insert' }).then(function(user) {
          return user;
        });
      });
    };

    var postSavePromises = function(users) {
      return fixture.response.json.posts.map(function(post, idx) {
        var create = {
          id: post.id,
          content: post.content,
          userID: users[idx].id
        };
        return Post.forge(create).save({}, { method: 'insert' });
      });
    };

    Promise.all(userSavePromises()).then(function(users) {
      return Promise.all(postSavePromises(users));
    })
    .then(function() {
      return requestFixture(fixture);
    })
    .spread(function(response, body){
      var json = JSON.parse(body);
      expect(fixture.response.json.posts[0].createdAt).to.match(dateRegex);
      expect(fixture.response.json.posts[0].updatedAt).to.match(dateRegex);
      //TODO refactoring
      fixture.response.json.posts[0].createdAt = json.posts[0].createdAt;
      fixture.response.json.posts[0].updatedAt = json.posts[0].updatedAt;
      expect(json).to.eql(fixture.response.json);
    }).done(function(){ done(); },done);
  });

  it('posts posts', function(done) {
    var fixture = __fixture('postPOST');

    var createUser = function() {
      var create = {
        id: fixture.response.json.users[0].id,
        username: fixture.response.json.users[0].username,
        passwordDigest: 'fakePassDigest'
      };
      return User.forge(create).save({}, { method: 'insert' });
    };

    var createToken = function(user) {
      var userID = 'user_id';
      var create = {};
      create[userID] = user.id; // avoid JSHint error for user_id (TODO: request to admit-one to make life better)
      create.value = 'ff13689653e86dc1ad0f9b4a34978192a918c6d4';
      return Token.forge(create).save();
    };

    Promise.resolve() // start promise sequence
    .then(function() { return createUser(); })
    .then(function(user) { return createToken(user); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body){
    	var json = JSON.parse(body);
      expect(json.post.id).to.be.a('number');
      expect(json.post.createdAt).to.match(dateRegex);
      expect(json.post.updatedAt).to.match(dateRegex);

      // can't match generated data, so just copy from fixture
      json.post.id = fixture.response.json.post.id;
      json.post.createdAt = fixture.response.json.post.createdAt;
      json.post.updatedAt = fixture.response.json.post.updatedAt;

      expect(json).to.eql(fixture.response.json);
    })
    .then(function() { return Post.fetchAll(); })
    .then(function(collection) {
      expect(collection.length).to.eql(1);
      expect(collection.at(0).get('content')).to.eql(fixture.request.json.post.content);
    })
    .done(function() { done(); }, done);
  });
  
  it.only('gets posts by userID', function(done) {
    var fixture = __fixture('postGETUser');
    var createUser = function() {
      var create = {
        id: fixture.response.json.users[0].id,
        username: fixture.response.json.users[0].username,
        passwordDigest: 'fakePassDigest'
      };
      return User.forge(create).save({}, { method: 'insert' });
    };
    var createToken = function(user) {
      var userID = 'user_id';
      var create = {};
      create[userID] = user.id; // avoid JSHint error for user_id (TODO: request to admit-one to make life better)
      create.value = 'ff13689653e86dc1ad0f9b4a34978192a918c6d4';
      return [Token.forge(create).save(), user];
    };
    var postSavePromises = function(user) {
      return fixture.response.json.posts.map(function(post) {
        var create = {
          id: post.id,
          content: post.content,
          userID: user[1].id
        };
        return Post.forge(create).save({}, { method: 'insert' });
      });
    };

    Promise.resolve() // start promise sequence
    .then(function() { return createUser(); })
    .then(function(user) { return createToken(user); })
    .then(function(user) { return postSavePromises(user); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body){
      var json = JSON.parse(body);
      console.log(json);
      expect(json.posts[0].id).to.be.a('number');
      expect(json.posts[0].createdAt).to.match(dateRegex);
      expect(json.posts[0].updatedAt).to.match(dateRegex);

      // can't match generated data, so just copy from fixture
      json.posts[0].id = fixture.response.json.posts[0].id;
      json.posts[0].createdAt = fixture.response.json.posts[0].createdAt;
      json.posts[0].updatedAt = fixture.response.json.posts[0].updatedAt;

      expect(json).to.eql(fixture.response.json);
    })
    .then(function() { return Post.fetchAll(); })
    .then(function(collection) {
      expect(collection.length).to.eql(1);
      expect(collection.at(0).get('content')).to.eql(fixture.request.json.post.content);
    })
    .done(function() { done(); }, done);

  });

  it('edits a post', function () {
    
  });

  it('deletes a post', function () {
    
  });

});

