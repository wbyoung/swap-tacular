'use strict';

var expect = require('chai').expect;
var bluebird = require('bluebird'), Promise = bluebird;
var app = require('../../server/application');
var models = require('../../server/models');
var port = 383273;

var Post = models.Post;

var fixtureHelpers = require('./helpers/fixtures'),
    createUser = fixtureHelpers.createUser,
    createUsers = fixtureHelpers.createUsers,
    createToken = fixtureHelpers.createToken,
    createPost = fixtureHelpers.createPost,
    createPosts = fixtureHelpers.createPosts,
    requestFixture = fixtureHelpers.requestFixture;

var dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
var tokenValue = 'ff13689653e86dc1ad0f9b4a34978192a918c6d4';


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

  it('will get posts', function(done) {
    var fixture = __fixture('post/postsGET');

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
    }).done(function() { done(); }, done);
  });

  it('gets single post', function(done) {
    var fixture = __fixture('post/postGET');

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
    }).done(function() { done(); }, done);
  });

  it('posts post', function(done) {
    var fixture = __fixture('post/postPOST');

    Promise.resolve() // start promise sequence
    .then(function() { return createUser(fixture.response.json.users[0]); })
    .then(function(user) { return createToken(user, { value: tokenValue }); })
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
  
  it('gets posts by userID', function(done) {
    var fixture = __fixture('post/postGETUser');
    
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

  it.skip('deletes a post', function(done) {
    var fixture = __fixture('post/postDELETE');
    // console.log(fixture);
    Promise.resolve() // start promise sequence
    .then(function () { return createUser(fixture.data.users[0]); })
    .tap(function(user) { return createToken(user, { value: tokenValue }); })
    .tap(function(user) { return createPost(user, fixture.data.posts[0]); })
    .then(function() { return Post.fetchAll(); })
    .then(function(posts) {
      console.log(posts.toJSON());

    })

    .then(function() { return requestFixture(fixture); })
    .spread(function(response, body) {
      console.log(body);
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

