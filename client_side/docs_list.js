var store = require('store');

var $ = require('jquery');
var doc_list = require('../includes/doc_list.jade');

var Docs = require('./docs');

function load () {
  var profile = store.get('firepad_profile');

  if (!profile) {
    window.location.hash = '#/';
  }

  $('.files-page').show();

  var docs = new Docs(profile.firebase_token);

  docs.list(profile, function (err, docs) {
    $('.content')
      .html(doc_list({docs: docs}));
  });
}

function create_new () {
  var profile = store.get('firepad_profile');
  var docs = new Docs(profile.firebase_token);
  docs.create_new(profile, function (err, docRef, id) {
    if (err) return;
    window.location.hash = '#/docs/' + id;
  });
}

module.exports = {
  load: load,
  create_new: create_new
};