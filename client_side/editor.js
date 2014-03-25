var CodeMirror = global.CodeMirror = require('code-mirror');
var Firepad = require('firepad');
var $ = require('jquery');
var Docs = require('./docs');
var store = require('store');
var editor = require('../includes/editor.jade');
var title_editor = require('./title_editor');
var marked = require('marked');
var cajaSanitizer = require('caja-sanitizer');
var share = require('./share');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

require('code-mirror/mode/markdown');
var previewer;

function setup_editor (docRef) {
  var firepadDiv = $('#editor').html('');
  var codeMirror = CodeMirror(firepadDiv[0], {
    mode: 'markdown',
    theme: require('code-mirror/theme/default'),
    extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"},
    lineWrapping: true
  });

  Firepad.fromCodeMirror(docRef, codeMirror);

  $('a.share').show().off('click').on('click', function (e) {
    e.preventDefault();
    share.show(docRef);
  });

  codeMirror.on('change', function () {
    var text = codeMirror.getValue();
    $('#preview').html(cajaSanitizer.sanitize(marked(text), function (url) {
      return url;
    }));
  });

  docRef.once('value', function (s) {
    console.log(s.val());
  });

  title_editor.setup(docRef);
}

function load (id) {
  var profile = store.get('firepad_profile');
  var docs = new Docs(profile.firebase_token);
  $('.content').html(editor({}));

  docs.get_doc(profile, id, function (err, docRef) {
    if (err) throw err;
    setup_editor(docRef);
  });
}

function unload () {
  if (previewer) clearInterval(previewer);
}

module.exports = {
  load: load,
  unload: unload
};