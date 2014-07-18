'use strict';

var models = require('../../../server/models');

var Post = models.Post,
    User = models.User,
    Token = models.Token;

exports.createUser = function(attrs) {
  var create = {
    username: attrs.username,
    passwordDigest: 'fakePassDigest'
  };
  return User.forge(create).save({ id: attrs.id }, { method: 'insert' });
};
