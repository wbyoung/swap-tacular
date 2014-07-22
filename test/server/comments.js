'use strict';

var _ = require('lodash');
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
    Comment = models.Comment;

var fixtureHelpers = require('./helpers/fixtures'),
    createUser = fixtureHelpers.createUser,
    createUsers = fixtureHelpers.createUsers,
    createToken = fixtureHelpers.createToken,
    createPosts = fixtureHelpers.createPosts;