var $ = require('jquery');

var Router = require('director').Router;
var auth = require('./auth');
var docs_list = require('./docs_list');
var editor = require('./editor');

function hide_all_sections () {
  $('section').hide();
}

var routes = {
  '/': [hide_all_sections, function () {
      $('.login-page').show();
  }],
  '/login':  auth.login,
  '/logout': auth.logout,
  '/docs': [ hide_all_sections, docs_list.load ],
  '/docs/:docId': [ hide_all_sections, editor.load ]
};

var router = Router(routes);
router.init();