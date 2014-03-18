var $ = require('jquery');
var Auth0Widget = require('auth0-widget.js');
var docs_list = require('./docs_list');
var store = require('store');

var widget = new Auth0Widget({
  domain:           'mdocs.auth0.com',
  clientID:         'TnzEhJw9ADNWAICY3vRlb7sdj9pMWcQJ',
  callbackURL:      'http://localhost:8080/',
  callbackOnLocationHash: true
});

if (store.get('profile')) {
  window.location.hash = '#/docs';
}

widget.getProfile(window.location.hash, function (err, profile) {
  if (err || !profile) return;
  store.set('profile', profile);
  window.location.hash = '#/docs';
});

function login() {
  widget.signin();
}

function logout () {
  store.remove('profile');
  window.location.hash = '#/';
}

module.exports = {
  login: login,
  logout: logout
};