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
    if (err) {
      if (err.code === 'EXPIRED_TOKEN') {
        window.location.hash = '#/logout';
        return;
      }
      return callback(err);
    }
    callback(null, firepadRef);
  });
};

DocStore.prototype.get_doc = function (user, doc_id, callback) {
  return this.get_base_ref('/docs/' + doc_id, function (err, ref) {
    if (err) return callback(err);

    var doc_meta = ref.parent().parent()
                     .child('users')
                     .child(user.fb_id)
                     .child(doc_id);

    ref.child('title').on('value', function (v) {
      var title = v.val();
      doc_meta.set({title: title});
    });

    callback(null, ref);
  });
};

DocStore.prototype.list = function (profile, callback) {
  this.get_base_ref('/users/' + profile.fb_id, function (err, ref) {
    if (err) return callback(err);

    ref.once('value', function (snapshot) {
      console.log('snapshot:', snapshot);
      var docs = snapshot.val();
      var result = Object.keys(docs).map(function (id) {
        return {
          doc_id: id,
          title:  docs[id].title
        };
      });
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