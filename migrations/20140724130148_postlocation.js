'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('posts', function(table) {
    table.string('location');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', function(table) {
    table.dropColumn('location');
  });
};
