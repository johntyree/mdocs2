var CodeMirror = global.CodeMirror = require('code-mirror');
var Firepad = require('firepad');
var $ = require('jquery');
var Docs = require('./docs');
var store = require('store');

require('code-mirror/mode/markdown');

function setup_editor (docRef) {
  var firepadDiv = $('#firepad').html('');
  var codeMirror = CodeMirror(firepadDiv[0], {
    mode: 'markdown',
    theme: require('code-mirror/theme/default'),
    extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
  });

  Firepad.fromCodeMirror(docRef, codeMirror, {
    richTextShortcuts: true,
    richTextToolbar: true
  });

  $('.add-contrib').off('click').on('click', function (e) {
    e.preventDefault();
    var contrib = prompt('Insert the email address of the contributor:');
    docRef.child('owners')
      .child(btoa(contrib))
      .set({'can_write': true});
  });
}

function load (id) {
  var profile = store.get('profile');
  var docs = new Docs(profile.firebase_token);
  docs.get_base_ref('/docs/' + id, function (err, docRef) {
    if (err) throw err;
    setup_editor(docRef);
  });
  $('.editor-page').show();
}

module.exports = {
  load: load
};