/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var mongoose = require('mongoose');
var UserSchema = require('../api/user/user.model');
var User = mongoose.model('User', UserSchema);
var LiftSchema = require('../api/lift/lift.model');
var Lift = mongoose.model('Lift', LiftSchema);

var clearUsers = function() {
  console.log('Clearing User Data');
  return User.remove({}).exec();
};

var clearLifts = function() {
  console.log('Clearing Lifts');
  return Lift.remove({}).exec();
}

var createTestLifts = function(users) {
  var lifts = [
    {
      userId: users[0]._id,
      name: 'Bench Press',
      lifts:[
        {
          weight: 135,
          reps: 5,
          date: Date.now()
        }
      ]
    },
    {
      userId: users[0]._id,
      name: 'Squat',
      lifts:[
        {
          weight: 225,
          reps: 5,
          date: Date.now()
        }
      ]
    }
  ]

  return Lift.collection.insert(lifts, function(err, docs) {
    if (err) {
      console.log('Lifts seed failed');
    } else {
      console.log(docs);
    }
  });
};

var createTestUsers = function(callback) {
  var users = [
    {
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    }
  ];

  User.collection.insert(users, callback)
};

var createData = function() {
  createTestUsers(function(err, docs) {
    if (err) {

    } else {
      console.log(docs);
      createTestLifts(docs);
    }
  });
};

exports.seedData = function() {
    return clearUsers()
      .then(clearLifts())
      .then(createData());
};
