var store = require('store');

var $ = require('jquery');
var login_info = require('./templates/login_info.ejs');
var doc_row = require('./templates/doc_row.ejs');

var editor = require('./editor');
var Docs = require('./docs');

function load () {
  var profile = store.get('profile');

  if (!profile) {
    window.location.hash = '#/';
  }

  $('.files-page').show();
  $('.login-info').html(login_info(profile));

  var docs = new Docs(profile.firebase_token);

  docs.list(profile, function (err, list) {
    var table = $('.table tbody').html('');
    list.forEach(function (r) {
      table.append(doc_row({doc_id: r}));
    });
  });

  $('.create-button').off('click').on('click', function (e) {
    e.preventDefault();

    docs.create_new(profile, function (err, docRef, id) {
      if (err) return;
      window.location.hash = '#/docs/' + id;
    });
  });
}

module.exports = {
  load: load
};