'use strict';

var _ = require('lodash');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var favicon = require('serve-favicon');
var config = require('./config');

var app = express();

if (config.env === 'development') {
  var connectLivereload = require('connect-livereload');
  app.use(connectLivereload({ port: process.env.LIVERELOAD_PORT || 35729 }));
  app.use(morgan('dev'));
  app.use(express.static(config.public));
  app.use(express.static(path.join(__dirname, '../app')));
}
if (config.env === 'production') {
  app.use(morgan('default'));
  app.use(favicon(path.join(config.public, 'favicon.ico')));
  app.use(express.static(config.public));
  app.use(compression());
}
app.use(bodyParser.json());
app.use(methodOverride());


var renameProperties = function(object){
  var renameProperty = function(object, currentName, newName) {
    object[newName] = object[currentName];
    delete object[currentName];
  };
  var properties = [
    ['created_at', 'createdAt'], 
    ['updated_at', 'updatedAt'], 
    ['userID', 'user']];
  properties.forEach(function(pair){
      renameProperty(object, pair[0], pair[1]);
  });
};

var models = require('./models'),
    User = models.User,
    Post = models.Post;

var admit = require('admit-one')('bookshelf', {
  bookshelf: { modelClass: User }
});

var api = express.Router();

api.post('/users', admit.create, function(req, res) {
  // user accessible via req.auth.user
  res.json({ user: req.auth.user });
});

api.post('/sessions', admit.authenticate, function(req, res) {
  // user accessible via req.auth.user
  res.json({ session: req.auth.user });
});

api.get('/posts', function(req, res){
  if (req.query.user) { Post = Post.where({ userID: req.query.user}); }
  Post.fetchAll({ withRelated: 'user' })
  .then(function(collection) {
    var users = [];
    var posts = collection.toJSON().map(function(model) {
      delete model.user.passwordDigest;
      users.push(model.user);
      renameProperties(model);
      return model;
    });
    res.json({ posts: posts, users: _.uniq(users, function(user) { return user.id; }) });
  }).done();
});

api.get('/posts/:id', function(req, res){
  Post.where({ id: req.params.id})
  .fetch({ withRelated: 'user' })
  .then(function(model) {
    var user = [];
    var newPost = [];
    var post = model.toJSON();
    delete post.user.passwordDigest;
    user.push(post.user);
    renameProperties(post);
    newPost.push(post);
    res.json({ posts: newPost, users: user });
  }).done();
});


// all routes defined below this line will require authorization
api.use(admit.authorize);
api.delete('/sessions/current', admit.invalidate, function(req, res) {
  if (req.auth.user) { throw new Error('Session not invalidated.'); }
  res.json({ status: 'ok' });
});

api.post('/posts', function(req, res){
  var user = req.auth.db.user;
  var post = req.body.post.message;
  var create = {
    message: post,
    userID: user.get('id')
  };
  Post.forge(create).save().then(function(post) {
    var newPost = post.toJSON();
    renameProperties(newPost);
    var sendUser = user.toJSON();
    delete sendUser.passwordDigest;
    res.json({ posts: [newPost], users: [sendUser] });
  });
});

api.put('/posts/:id', function(req, res){
  var user = req.auth.db.user;
  var post = req.body.post.message;
  var id = req.params.id;
  Post.where({ id: id })
  .fetch({ withRelated: 'user' })
  .then(function(model) {
    model.save({ message: post }, { method: 'update' }, { patch: true })
    .then(function(model) {
      var sendUser = user.toJSON();
      var newPost = model.toJSON();
      renameProperties(newPost);
      delete sendUser.passwordDigest;
      res.json({ posts: [newPost], users: [sendUser] });
    });  
  });
});


api.delete('/posts/:id', function(req, res){
  var user = req.auth.db.user;
  var post = req.body.post.message;
  var id = req.params.id;
  Post.where({ id: id })
  .fetch({ withRelated: 'user' })
  .then(function(model) {
    model.destroy({ message: post }, { method: 'update' }, { patch: true })
    .then(function(model) {
      // var sendUser = user.toJSON();
      // var newPost = model.toJSON();
      // renameProperties(newPost);
      // delete sendUser.passwordDigest;
      // res.json({ posts: [newPost], users: [sendUser] });
    });  
  });
});
// application routes
app.use('/api', api);

// expose app
module.exports = app;

// start server
if (require.main === module) {
  app.listen(config.port, function() {
    return console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
  });
}
