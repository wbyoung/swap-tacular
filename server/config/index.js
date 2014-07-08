'use strict';

var _ = require('lodash');
var base = require('./env/base');
var overrides = require('./env/' + base.env);
var pg = require('pg');

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM users', function(err, result) {
    done();
    if(err) return console.error(err);
    console.log(result.rows);
  });
});

module.exports = _.extend({}, base, overrides);
