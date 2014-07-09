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
		models._bookshelf.knex('posts').del().then(function() { 
			models._bookshelf.knex('users').del().then(function() { done(); }, done); 
		}, done);
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

	it('posts posts', function() {
		var userPromises = function() {
			var create = {
				username: 'fakedude',
				passwordDigest: 'anything?'
			};
			User.forge(create, {method: 'insert'}).save();
		};

		var tokenSavePromises = function() {
			var create = {
				id: 23,
				userID : 1,
				value: 'ff13689653e86dc1ad0f9b4a34978192a918c6d4'
			};
			return Token.forge(create).save();
		};
		userPromises();
		// insert this stuff into db before sending fixture request

		// # user
		// id: 1/anything
		// username: fakie/anything
		// passwordDigest: anything

		// # token
		// id: 1/anything
		// user_id: 1/must-match user.id
		// value: ff13689653e86dc1ad0f9b4a34978192a918c6d4
	});
});
