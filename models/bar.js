// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose.Promise = Promise; // pour ne pas avoir un avertissement dans la console

// set up a mongoose model and pass it using module.exports
var barSchema = mongoose.Schema(
  {
    name: String,
    address: String,
    description: String,
    lat: Number,
    lng:Number
  },
  {collection: 'bars'}
);
module.exports = mongoose.model('Bar', barSchema);
