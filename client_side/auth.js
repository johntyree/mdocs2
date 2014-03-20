var $              = require('jquery');
var Auth0Widget    = require('auth0-widget.js');
var store          = require('store');
var logged_in_tmpl = require('../includes/logged_in.jade');

var widget = new Auth0Widget({
  domain:           'mdocs.auth0.com',
  clientID:         'TnzEhJw9ADNWAICY3vRlb7sdj9pMWcQJ',
  callbackURL:      window.location.href.split('#')[0],
  callbackOnLocationHash: true
});

if (store.get('profile')) {
  login_fin(store.get('profile'));
}

widget.getProfile(window.location.hash, function (err, profile) {
  if (err || !profile) return;
  store.set('profile', profile);
  login_fin(profile);
});

function login_fin(profile) {
  $('#signed-in').html(logged_in_tmpl({
    profile: profile
  }));
  $('#sign-in').hide();
  if (!window.location.hash || window.location.hash.indexOf('#access_token') === 0) {
    window.location.hash = '#/docs';
  }
}

function login() {
  widget.signin();
}

function logout () {
  $('#signed-in').hide();
  $('#sign-in').show();
  store.remove('profile');
  window.location.hash = '#/';
}

module.exports = {
  login: login,
  logout: logout
};