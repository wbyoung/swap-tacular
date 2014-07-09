'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', function(table) {
    table.increments('id').primary();
    table.integer('userID').references('users.id');
    table.string('content').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};