var $ = require('jquery');

var Router = require('director').Router;
var auth = require('./auth');
var docs_list = require('./docs_list');
var editor = require('./editor');

function clean_content () {
  $('.content').html('');
  $('a.share').hide();
}

function set_active_menu() {
  $('.menu-button').removeClass('active');
  $('li[data-menu-route="' + window.location.hash + '"]')
    .addClass('active');
}

var routes = {
  '/': clean_content,
  '/login':  auth.login,
  '/logout': auth.logout,
  '/docs': [ clean_content, docs_list.load ],
  '/new': docs_list.create_new,
  '/docs/:docId': [ clean_content, editor.load ]
};

var router = Router(routes);
router.configure({
  on: set_active_menu
});

router.init();