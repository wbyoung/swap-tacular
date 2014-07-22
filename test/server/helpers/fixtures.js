'use strict';

var _ = require('lodash');
var bluebird = require('bluebird'), Promise = bluebird;
var models = require('../../../server/models');

var Post = models.Post,
    User = models.User,
    Token = models.Token,
    Comment = models.Comment;

var createUser = exports.createUser = function(attrs) {
  var create = {
    username: attrs.username,
    passwordDigest: 'fakePassDigest'
  };
  return User.forge(create).save({ id: attrs.id }, { method: 'insert' });
};

exports.createUsers = function(users) {
  return Promise.all(users.map(createUser));
};

exports.createToken = function(user, attrs) {
  var userID = 'user_id';
  var create = {};
  create[userID] = user.id; // avoid JSHint error for user_id (TODO: request to admit-one to make life better)
  create.value = attrs.value;
  return Token.forge(create).save();
};

var createPost = exports.createPost = function(user, attrs) {
  var create = {
    message: attrs.message,
    userID: user.id
  };
  return Post.forge(create).save({ id: attrs.id }, { method: 'insert' });
};

var createComment = exports.createComment = function(user, post, attrs) {
  var create = {
    message: attrs.message,
    userID: user.id,
    postID: post.id
  };
  return Comment.forge(create).save({ id: attrs.id }, { method: 'insert' });
};

/**
 * Create posts
 *
 * @function
 * @param [Array|bookshelf.Model] users - An array of users with which posts
 * should be associated. The array length must match the `posts` array length.
 * You can optionally pass an individual model to this instead of an array and
 * that model will be associated with each post.
 * @param [Array] posts - an array of objects with attributes to use for
 * creating posts.
 */
exports.createPosts = function(users, posts) {
	return Promise.all(posts.map(function(post, idx) {
		var user = _.isArray(users) ? users[idx] : users;
		return createPost(user, post);
	}));
};

exports.createComments = function(users, posts, comments) {
  return Promise.all(comments.map(function(comment, idx) {
    var user = _.isArray(users) ? users[idx] : users;
    var post = _.isArray(posts) ? posts[idx] : posts;
    return createComment(user, post, comment);
  }));
};
