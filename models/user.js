// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose.Promise = Promise; // pour ne pas avoir un avertissement dans la console

// set up a mongoose model and pass it using module.exports
var userSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    nickname: String,
    role: {
      type: String,
      enum: [
        'admin',
        'member',
        'guest'
      ]
    },
    created: {
      type: Date,
      default: Date.now
    }
  },
  {collection: 'users'}
);
module.exports = mongoose.model('User', userSchema);
