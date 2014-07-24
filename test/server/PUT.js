'use strict';

var expect = require('chai').expect;
var bluebird = require('bluebird'), Promise = bluebird;
var app = require('../../server/application');
var models = require('../../server/models');
var port = 383273;

var Post = models.Post;

var fixtureHelpers = require('./helpers/fixtures'),
    createUser = fixtureHelpers.createUser,
    createToken = fixtureHelpers.createToken,
    createPosts = fixtureHelpers.createPosts,
    requestFixture = fixtureHelpers.requestFixture;

var dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
var tokenValue = 'ff13689653e86dc1ad0f9b4a34978192a918c6d4';

describe('PUT', function() {
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

  it('edits a post', function(done) {
    var fixture = __fixture('post/postPUT');

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
      json.posts[0].id = fixture.response.json.posts[0].id;
      json.posts[0].createdAt = fixture.response.json.posts[0].createdAt;
      json.posts[0].updatedAt = fixture.response.json.posts[0].updatedAt;
      expect(json).to.eql(fixture.response.json);
    })
    .then(function() { return Post.fetchAll(); })
    .then(function(collection) {
      expect(collection.length).to.eql(1);
      expect(collection.at(0).get('message')).to.eql(fixture.request.json.post.message);
    })
    .done(function() { done(); }, done);
  });

});
