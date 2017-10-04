"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a Data Point
 *  When creating your own Schema for your CS50 project, just copy this format but alter
 *  the fields in the schema :)
 *
 *  Learn more by googling about Mongoose and its schemas.
 */

var mongoose = require('mongoose');

// create a schema
var dataSchema = new mongoose.Schema({
    message: String, // Message in data point
    date: { type: Date, default: Date.now }
});

// the schema is useless so far
// we need to create a model using it
var Data = mongoose.model('Data', dataSchema);

// make this available to our users in our Node applications
module.exports = Data;
