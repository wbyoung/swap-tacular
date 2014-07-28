'use strict';

var config = require('./config');
var knexConfig = require('./config/knexfile.js')[config.env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var User, Token, Post, Comment;

/**
 * TODO: document me
 */
User = bookshelf.Model.extend({
  tokens: function() {
    return this.hasMany(Token);
  },
  posts: function() {
    return this.hasMany(Post);
  },
  comments: function() {
    return this.hasMany(Comment, 'id').through(Post, 'postID');
  },
  tableName: 'users'
});


/**
 * TODO: document me
 */
Token = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User);
  },
  tableName: 'tokens'
});


/**
 * TODO: document me
 */
Post = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User, 'userID');
  },
  comments: function() {
    return this.hasMany(Comment, 'postID');
  },
  hasTimestamps: true,
  tableName: 'posts'
});

/**
 * TODO: document me
 */
Comment = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User, 'userID').through(Post, 'postID');
  },
  post: function() {
    return this.belongsTo(Post, 'postID');
  },
  hasTimestamps: true,
  tableName: 'comments'
});

module.exports = {
  User: User,
  Token: Token,
  Post: Post,
  Comment: Comment,
  _kenx: knex,
  _bookshelf: bookshelf // only for testing
};
