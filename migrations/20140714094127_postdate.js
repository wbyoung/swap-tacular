'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('posts', function(table) {
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', function(table) {
  	table.dropColumns('created_at', 'updated_at');
  });
};