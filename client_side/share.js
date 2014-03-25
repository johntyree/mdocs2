var template = require('../includes/share.jade');
var collaboratorRow = require('../includes/collaborator-row.jade');
var visibilityRow = require('../includes/visibility-row.jade');

var $ = require('jquery');
var store = require('store');

function removeCollaborator (docRef) {
  return function (e) {
    e.preventDefault();

    var email = $(this).parents('tr').attr('data-email');

    docRef.child('owners')
        .child(window.btoa(email))
        .remove();
  };
}

function addCollaborator (docRef) {
  return function (e) {
    e.preventDefault();

    var email = $('#new-collab').val();
    var can_write = $('#new-collab-type :selected').val() === 'can_write';

    docRef.child('owners')
          .child(window.btoa(email))
          .set({
            can_write: can_write
          }, function (err) {
            if (err) return console.log(err);
            $('#new-collab').val('');
          });

    return false;
  };
}

function changePermissions(docRef, can_write) {
  return function (e) {
    e.preventDefault();

    var email = $(this).parents('tr').attr('data-email');
    docRef.child('owners')
        .child(window.btoa(email))
        .set({
          can_write: can_write
        });
  };
}

function changeCompanyPermissions (docRef) {
  return function (e) {
    e.preventDefault();
    var company = $(this).parents('tr').attr('data-level');
    var type = $(this).attr('data-type');
    docRef.child('companies')
        .child(company)
        .set(type);
  };
}

exports.show = function (docRef) {
  $('#settings-popup').remove();
  var profile = store.get('firepad_profile');

  docRef.once('value', function (doc) {
    var modal = $(template({
      doc: doc,
      profile: profile,
      url: window.location.href
    })).appendTo('.content').modal('show');

    //subscribe to changes in the owners property and render the list of owners
    docRef.child('owners')
      .on('value', function (snapshot) {
        var owners = snapshot.val();
        $('#collabs-table').html('');
        Object.keys(owners||{}).map(function (email) {
          return { email: window.atob(email), can_write: owners[email].can_write };
        }).map(collaboratorRow).forEach(function (row) {
          $('#collabs-table').append(row);
        });
      });

    if (!profile.identities[0].isSocial) {
      docRef.child('companies')
        .on('value', function (snapshot) {
          console.log(snapshot.val());
          var target = $('#visibility-table').html('');
          var company = profile.company;
          var type = (snapshot.val()||{})[company] || 'none';
          $(visibilityRow({d: {company: company, type: type}}))
            .appendTo(target);
        });
    }

    new ZeroClipboard($('.copy-btn'), {
      moviePath: '//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/1.3.3/ZeroClipboard.swf'
    }).on('complete', function() {
        var btn = $(this);
        btn.tooltip({
          title:     'copied!',
          placement: 'bottom',
          trigger:   'manual'
        }).tooltip('show');
        setTimeout(function(){
          btn.tooltip('hide');
        }, 1000);
      });

    $(modal).on('click', '.remove-collab', removeCollaborator(docRef));
    $('#add-collab').on('submit', addCollaborator(docRef));
    $(modal).on('click', '.can-view-option', changePermissions(docRef, false));
    $(modal).on('click', '.can-write-option', changePermissions(docRef, true));
    $(modal).on('click', '#visibility-table .change-level', changeCompanyPermissions(docRef));
  });

};