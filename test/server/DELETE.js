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
    createPost = fixtureHelpers.createPost,
    requestFixture = fixtureHelpers.requestFixture;

var tokenValue = 'ff13689653e86dc1ad0f9b4a34978192a918c6d4';

describe('DELETE', function() {
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

  it('deletes a post', function(done) {
    var fixture = __fixture('post/postDELETE');
    Promise.resolve() // start promise sequence
    .then(function () { return createUser(fixture.data.users[0]); })
    .tap(function(user) { return createToken(user, { value: tokenValue }); })
    .tap(function(user) { return createPost(user, fixture.data.posts[0]); })
    .tap(function(user) { return createPost(user, fixture.data.posts[1]); })
    .then(function() { return Post.fetchAll(); })
    .then(function() {})
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(json).to.eql(fixture.response.json);
    })
    .then(function() { return Post.fetchAll(); })
    .then(function(collection) {
      expect(collection.length).to.eql(1);
    })
    .done(function() { done(); }, done);
  });

});
