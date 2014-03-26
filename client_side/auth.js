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

if (store.get('firepad_profile')) {
  login_fin(store.get('firepad_profile'));
}

widget.getProfile(window.location.hash, function (err, profile) {
  if (err || !profile) return;
  store.set('firepad_profile', profile);
  login_fin(profile);
});

function login_fin(profile) {
  $('#signed-in').html(logged_in_tmpl({
    profile: profile
  }));
  $('#sign-in').hide();
  if (!window.location.hash || window.location.hash.indexOf('#access_token') === 0) {
    var return_url = store.get('return_url_after_login');

    if (return_url) {
      store.remove('return_url_after_login');
      window.location = return_url;
      return;
    }

    window.location.hash = '#/docs';
  }
}

function login() {
  widget.signin();
}

function logout () {
  $('#signed-in').hide();
  $('#sign-in').show();
  store.remove('firepad_profile');
  window.location.hash = '#/';
}

module.exports = {
  login: login,
  logout: logout
};