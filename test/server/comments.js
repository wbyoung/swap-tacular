'use strict';

var expect = require('chai').expect;
var bluebird = require('bluebird'), Promise = bluebird;
var app = require('../../server/application');
var models = require('../../server/models');
var port = 383273;

var fixtureHelpers = require('./helpers/fixtures'),
    createUser = fixtureHelpers.createUser,
    createUsers = fixtureHelpers.createUsers,
    createPosts = fixtureHelpers.createPosts,
    createToken = fixtureHelpers.createToken,
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

  it('will get all of comments on post', function(done) {
    var fixture = __fixture('comment/commentsGET');

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
      expect(fixture.response.json.comments[0].createdAt).to.match(dateRegex);
      expect(fixture.response.json.comments[1].updatedAt).to.match(dateRegex);
      //TODO refactoring
      fixture.response.json.comments[0].createdAt = json.comments[0].createdAt;
      fixture.response.json.comments[0].updatedAt = json.comments[0].updatedAt;
      fixture.response.json.comments[1].createdAt = json.comments[1].createdAt;
      fixture.response.json.comments[1].updatedAt = json.comments[1].updatedAt;

      expect(json).to.eql(fixture.response.json);
    })
    .done(function(){ done(); },done);

  });

  it('will get comment by id', function(done) {
    var fixture = __fixture('comment/commentGET');

    Promise.bind({}) // start promise sequence
    .then(function() { return createUsers(fixture.response.json.users); })
    .then(function(user) { 
      this.user = user;
      return createPosts(user, fixture.response.json.posts); 
    })
    .then(function(post) { return createComments(this.user, post, fixture.response.json.comments); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(fixture.response.json.comments[0].createdAt).to.match(dateRegex);
      expect(fixture.response.json.comments[0].updatedAt).to.match(dateRegex);
      //TODO refactoring
      fixture.response.json.comments[0].createdAt = json.comments[0].createdAt;
      fixture.response.json.comments[0].updatedAt = json.comments[0].updatedAt;
      expect(json).to.eql(fixture.response.json);
    })
    .done(function(){ done(); },done);
  });
  
  it('will post a comment on post', function(done) {
    var fixture = __fixture('comment/commentPOST');

    Promise.bind({})
    .then(function() { return createUser(fixture.response.json.users[0]); })
    .then(function(user) { 
      this.user = user;
      return createToken(user, { value: tokenValue }); 
    })
    .then(function() { return createPosts(this.user, fixture.response.json.posts); })
    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      var json = JSON.parse(body);
      expect(fixture.response.json.comments[0].createdAt).to.match(dateRegex);
      expect(fixture.response.json.comments[0].updatedAt).to.match(dateRegex);
      //TODO refactoring
      fixture.response.json.comments[0].createdAt = json.comments[0].createdAt;
      fixture.response.json.comments[0].updatedAt = json.comments[0].updatedAt;
      expect(json).to.eql(fixture.response.json);
    })
    .done(function(){ done(); },done);

  });
});
