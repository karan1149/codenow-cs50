"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 *  When creating your own Schema for your CS50 project, just copy this format but alter
 *  the fields in the schema :)
 *
 *  Learn more by googling about Mongoose and its schemas.
 */

var mongoose = require('mongoose');

// create a schema
// NOTE: All documents (instances) in a Mongoose schema also have a _id field by default!
var userSchema = new mongoose.Schema({
    first_name: String, // First name of the user.
    last_name: String,  // Last name of the user.
    login_name: String,		// login_name of the user.
    password: String		// password of the user.
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
