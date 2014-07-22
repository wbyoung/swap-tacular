'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function(table) {
    table.increments('id').primary();
    table.integer('userID').references('users.id');
    table.integer('postID').references('posts.id');
    table.string('message').notNullable();
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};