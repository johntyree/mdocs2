var $ = require('jquery');

var Router = require('director').Router;
var auth = require('./auth');
var docs_list = require('./docs_list');
var editor = require('./editor');
var store = require('store');

function clean_content () {
  $('.content').html('');
  $('a.share').hide();
}

function set_active_menu() {
  $('.menu-button').removeClass('active');
  $('li[data-menu-route="' + window.location.hash + '"]')
    .addClass('active');
}

function require_login (next) {
  return function () {
    var profile = store.get('firepad_profile');
    if (profile) {
      return next.apply(null, arguments);
    }
    store.set('return_url_after_login', window.location.href);
    window.location.hash = '#/login';
  };
}

var routes = {
  '/': clean_content,
  '/login':  auth.login,
  '/logout': auth.logout,
  '/docs': [ clean_content, require_login(docs_list.load) ],
  '/new': docs_list.create_new,
  '/docs/:docId': [ clean_content, require_login(editor.load) ]
};

var router = Router(routes);
router.configure({
  on: set_active_menu
});

router.init();