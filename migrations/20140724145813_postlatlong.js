'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('posts', function(table) {
    table.string('lat_long');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', function(table) {
    table.dropColumn('lat_long');
  });
};
