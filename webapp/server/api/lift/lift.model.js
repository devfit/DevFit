'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LiftSetSchema = new Schema({
  weight: Number,
  reps: Number,
  date: Date
});

var LiftSchema = new Schema({
  userId: String,
  name: String,
  lifts: [LiftSetSchema],
  isActive: Boolean
});

module.exports = mongoose.model('Lift', LiftSchema);
