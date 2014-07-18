'use strict';

var config = require('./config');
var knexConfig = require('./config/knexfile.js')[config.env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var User, Token, Post;

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
  hasTimestamps: true,
  tableName: 'posts'
});

module.exports = {
  User: User,
  Token: Token,
  Post: Post,
  _kenx: knex,
  _bookshelf: bookshelf // only for testing
};
