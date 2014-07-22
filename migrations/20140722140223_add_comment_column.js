'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.string('comments').references('comments.message');
  }).table('posts', function(table) {
    table.string('comments').references('comments.message');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumns('comments');
  }).table('posts', function(table) {
    table.dropColumns('comments');
  });
};