'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('posts', function(table) {
    table.renameColumn('content', 'message');
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', function(table) {
    table.renameColumn('message', 'content');
  });  
};
