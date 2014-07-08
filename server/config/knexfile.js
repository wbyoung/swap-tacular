'use strict';

var connection = process.env.DATABASE_URL || {
  host     : process.env.DATABASE_HOST     || '127.0.0.1',
  user     : process.env.DATABASE_USER     || '',
  password : process.env.DATABASE_PASSWORD || '',
  database : process.env.DATABASE_NAME     || 'users'
};

module.exports = {

  development: {
    client: 'postgresql',
    connection: connection
  },

//$ NODE_ENV='test' ./node_modules/.bin/knex migrate:latest

  test: {
    client: 'postgresql',
    connection: {
      database : 'test-tacular'
    }
  },

  staging: {
    client: 'postgresql',
    connection: connection,
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: 'postgresql',
    connection: connection,
    pool: {
      min: 2,
      max: 10
    }
  }
};