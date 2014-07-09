'use strict';

var config = require('./config');
var knexConfig = require('./config/knexfile.js')[config.env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var User, Token, Post;
User = bookshelf.Model.extend({
  tokens: function() {
    return this.hasMany(Token);
  },
  posts: function() {
    return this.hasMany(Post);
  },
  tableName: 'users'
});
Token = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User);
  },
  tableName: 'tokens'
});
Post = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User, 'userID');
  },
  tableName: 'posts'
});

module.exports = {
	User: User,
	Token: Token,
	Post: Post,
	_bookshelf: bookshelf // only for testing
};