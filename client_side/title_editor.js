var editable = require('editable');

exports.setup = function (firebaseRef) {
  var title = editable(document.getElementById('name'));
  var title_field = firebaseRef.child('title');

  //when changing the text in the dom, update on firebase
  title.on('data', function (d){
    title_field.set(d);
    title.write(d || 'untitled');
  });

  //when the value changes in firebase update the dom
  title_field.on('value', function (v) {
    title.write(v.val() || 'untitled');
  });
};