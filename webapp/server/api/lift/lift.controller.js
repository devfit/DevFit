/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /lifts              ->  index
 * POST    /lifts              ->  create
 * GET     /lifts/:id          ->  show
 * PUT     /lifts/:id          ->  update
 * DELETE  /lifts/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Lift = require('./lift.model');

// Get list of lifts
exports.index = function(req, res) {
  Lift.find(function (err, lifts) {
    if(err) { return handleError(res, err); }
    return res.json(200, lifts);
  });
};

// Get a single lift
exports.show = function(req, res) {
  Lift.findById(req.params.id, function (err, lift) {
    if(err) { return handleError(res, err); }
    if(!lift) { return res.send(404); }
    return res.json(lift);
  });
};

// Creates a new lift in the DB.
exports.create = function(req, res) {
  Lift.create(req.body, function(err, lift) {
    if(err) { return handleError(res, err); }
    return res.json(201, lift);
  });
};

// Updates an existing lift in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Lift.findById(req.params.id, function (err, lift) {
    if (err) { return handleError(res, err); }
    if(!lift) { return res.send(404); }
    var updated = _.merge(lift, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, lift);
    });
  });
};

// Deletes a lift from the DB.
exports.destroy = function(req, res) {
  Lift.findById(req.params.id, function (err, lift) {
    if(err) { return handleError(res, err); }
    if(!lift) { return res.send(404); }
    lift.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
