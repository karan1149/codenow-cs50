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
var projectSchema = new mongoose.Schema({
	email: String, //email of the community member
	contact_number: String, //contact number of the community member
	liked_students: [String], // students who have liked the project
	liked_student_names: [String],
	assigned_students: [String], // students who have been assigned to the project
	description: String,  // description of the project
	community_member: String,  // community who created project
	tag: String,  // tag associated with the project
	title: String, // title of the project
	reviewed: Boolean // if the project has been reviewed by the admins
});

// the schema is useless so far
// we need to create a model using it
var Project = mongoose.model('Project', projectSchema);

// make this available to our users in our Node applications
module.exports = Project;
