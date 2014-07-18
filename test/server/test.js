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

var Post = models.Post;

var fixtureHelpers = require('./helpers/fixtures'),
    createUser = fixtureHelpers.createUser,
    createUsers = fixtureHelpers.createUsers,
    createToken = fixtureHelpers.createToken,
    createPosts = fixtureHelpers.createPosts;

var dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
var tokenValue = 'ff13689653e86dc1ad0f9b4a34978192a918c6d4';

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

    Promise.resolve() // start promise sequence
    .then(function() { return createUsers(fixture.response.json.users); })
    .then(function(users) { return createPosts(users, fixture.response.json.posts); })
    .then(function() { return requestFixture(fixture); })
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

    Promise.resolve() // start promise sequence
    .then(function() { return createUser(fixture.response.json.users[0]); })
    .then(function(user) { return createToken(user, { value: tokenValue }); })
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
      expect(collection.at(0).get('message')).to.eql(fixture.request.json.post.message);
    })
    .done(function() { done(); }, done);
  });
  
  it('gets posts by userID', function(done) {
    var fixture = __fixture('postGETUser');
    
    Promise.resolve() // start promise sequence
    .then(function() { return createUser(fixture.response.json.users[0]); })
    .tap(function(user) { return createToken(user, { value: tokenValue }); })
    .tap(function(user) { return createPosts(user, fixture.response.json.posts); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body){
      var json = JSON.parse(body);
      expect(json.posts[0].id).to.be.a('number');
      expect(json.posts[0].createdAt).to.match(dateRegex);
      expect(json.posts[0].updatedAt).to.match(dateRegex);

      // can't match generated data, so just copy from fixture
      json.posts.forEach(function(post, index) {
        post.createdAt = fixture.response.json.posts[index].createdAt;
        post.updatedAt = fixture.response.json.posts[index].updatedAt;
      });

      expect(json).to.eql(fixture.response.json);
    })
    .then(function() { return Post.fetchAll(); })
    .then(function(collection) {
      expect(collection.length).to.eql(3);
      expect(collection.at(0).get('message')).to.eql(fixture.response.json.posts[0].message);
    })
    .done(function() { done(); }, done);

  });

  it('edits a post', function () {
    
  });

  it('deletes a post', function () {
    
  });

});

