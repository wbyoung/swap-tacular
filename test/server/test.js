'use strict';

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

var requestFixture = function(fixture) {
  var requestOptions = {
    url: baseURL + fixture.request.url,
    method: fixture.request.method,
    headers: fixture.request.headers,
  };
  return requestAsync(requestOptions);
};

describe('server', function() {
  before(function(done) { this.server = app.listen(port, function() { done(); }); });
  after(function(done) { this.server.close(done); });
  afterEach(function(done) {
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
          username: user.username,
          passwordDigest: 'digest'
        };
        return User.forge(create).save().then(function(user) {
          return user;
        });
      });
    };

    var postSavePromises = function(users) {
      return fixture.response.json.posts.map(function(post, idx) {
        var create = {
          content: post.content,
          userID: users[idx].id
        };
        return Post.forge(create).save();
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
      json.posts[0].id = fixture.response.json.posts[0].id;
      json.posts[0].user = fixture.response.json.posts[0].user;
      json.users[0].id = fixture.response.json.users[0].id;
      expect(json).to.eql(fixture.response.json);
    }).done(function(){ done(); },done);
  });

  it('posts posts', function(done) {
    var fixture = __fixture('postPOST');

    var createUser = function() {
      var create = {
        username: 'fakedude',
        passwordDigest: 'anything?'
      };
      return User.forge(create, {method: 'insert'}).save();
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
    .then(function() {
      return requestFixture(fixture);
    })
    .spread(function(response, body){
      // TODO: this code was copied directly out of another project and is
      // just here as an example of the types of assertions you could make
      // in this function
      // var json = JSON.parse(body);
      // json.posts[0].id = fixture.response.json.posts[0].id;
      // json.posts[0].author = fixture.response.json.posts[0].author;
      // json.users[0].id = fixture.response.json.users[0].id;
      // expect(json).to.eql(fixture.response.json);
    })
    .done(function() { done(); }, done);
  });
});
