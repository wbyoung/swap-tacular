'use strict';

var expect = require('chai').expect;
var bluebird = require('bluebird'), Promise = bluebird;
var app = require('../../server/application');
var models = require('../../server/models');
var port = 383273;

var Post = models.Post,
    Comment = models.Comment;

var fixtureHelpers = require('./helpers/fixtures'),
    createUser = fixtureHelpers.createUser,
    createUsers = fixtureHelpers.createUsers,
    createToken = fixtureHelpers.createToken,
    createPosts = fixtureHelpers.createPosts,
    createComments = fixtureHelpers.createComments,
    requestFixture = fixtureHelpers.requestFixture;

var dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
var tokenValue = 'ff13689653e86dc1ad0f9b4a34978192a918c6d4';

describe('server', function() {
  before(function(done) { this.server = app.listen(port, function() { done(); }); });
  after(function(done) { this.server.close(done); });
  afterEach(function(done) {
    Promise.resolve() // start promise sequence
    .then(function() {
      return models._bookshelf.knex('comments').del();
    })
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

  it.only('will get comment', function(done) {
    var fixture = __fixture('comment/commentGET');

    Promise.bind({}) // start promise sequence
    .then(function() { return createUsers(fixture.response.json.users); })
    .then(function(user) { 
      this.user = user;
      return createPosts(user, fixture.response.json.posts); 
    })
    .then(function(post) { return createComments(this.user, post, fixture.response.json.comments); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body){
      var json = JSON.parse(body);
      console.log(json);
      expect(fixture.response.json.posts[0].createdAt).to.match(dateRegex);
      expect(fixture.response.json.posts[0].updatedAt).to.match(dateRegex);
      //TODO refactoring
      fixture.response.json.posts[0].createdAt = json.posts[0].createdAt;
      fixture.response.json.posts[0].updatedAt = json.posts[0].updatedAt;
      expect(json).to.eql(fixture.response.json);
    }).done(function(){ done(); },done);

  });

});