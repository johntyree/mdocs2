function DocStore (token) {
  this._token = token;
}

DocStore.prototype.get_base_ref = function (path, callback) {
  if (typeof path === 'function') {
    callback = path;
    path = '';
  }

  var url = 'https://brilliant-fire-7193.firebaseio.com';
  var firepadRef = new Firebase(url + path);

  return firepadRef.auth(this._token, function (err) {
    if (err) return callback(err);
    callback(null, firepadRef);
  });
};

DocStore.prototype.list = function (profile, callback) {
  this.get_base_ref('/users/' + profile.fb_id, function (err, ref) {
    if (err) return callback(err);

    ref.once('value', function (snapshot) {
      console.log('snapshot:', snapshot);
      var docs = snapshot.val();
      var result = Object.keys(docs);
      callback(null, result);
    });

  });
};

DocStore.prototype.create_new = function (owner, callback) {
  this.get_base_ref(function (err, base_ref) {
    if (err) return callback(err);

    var docs_ref = base_ref.child('docs');
    var users_ref = base_ref.child('users');

    var new_doc = { owners: {} };
    new_doc.owners[owner.fb_id] = { can_write: true };

    var docRef = docs_ref.push(new_doc, function (err) {
      if (err) {
        return callback(err);
      }

      var doc_id = docRef.toString().split('/').slice(-1)[0];

      users_ref
        .child(owner.fb_id)
        .child(doc_id)
        .set(true);

      callback(null, docRef, doc_id);
    });
  });
};

module.exports = DocStore;