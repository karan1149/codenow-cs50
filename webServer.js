"use strict";

/* jshint node: true */

/*
 * This exports the current directory via webserver listing on a hard code (3000) port. It also
 * establishes a connection to the MongoDB named 'CS50Project'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * If using MongoDB, make sure to run "mongod" before running "node webServer.js"
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the CS50 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 */

/********************************************************************************************/
/***************************************    SET UP     **************************************/
/********************************************************************************************/

/*** INFO: "require" statements are Node.js's version of import statements ***/
var mongoose = require('mongoose');
var async = require('async');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require("fs");

// Load the Mongoose schema for User and Data Point (example)
var User = require('./schema/user.js');
var Data = require('./schema/data.js');

// Load Express
var express = require('express');
var app = express();

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// Connect to the CS50Project Mongo Database
mongoose.connect('mongodb://localhost/CS50Project');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us. This EXPORTS your current working directory that webServer.js is in. (__dirname)
app.use(express.static(__dirname));



/************************************************************************************************/
/*******************************     REST API Back End CALLS     ********************************/
/************************************************************************************************/
/*
 * Example #1: Simple GET Request
 * When making an AJAX GET request to the path '/', the web server responds with a simple message.
 */
app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});


/*
 * Example #2: GET Request Querying MongoDB
 * This request retrieves a list of all data points stored in our MongoDB
 */
app.get('/data/all', function (request, response) {
	
	var search = Data.find({});

	// Query to only get first_name, last_name, and id attributes.
	search.select("message date").exec(function (err, data_points) { 
		if (!err) {
			response.status(200).end(JSON.stringify(data_points));
		} else {
			response.status(501).send("Error");    	
		}
	});
});

/*
 * Example #3: GET Request Checking for Logged In Status
 * Checking if there is a currently logged in user as specified by session variable
 */
app.post('/admin/status', function(request, response) {
	if (request.session.login_name === null) {
		response.status(200).end(false);
	} else {
		response.status(200).end(true);
	}
});

/*
 * Example #4: POST Request Logging in User
 */
app.post('/admin/login', function (request, response) {
	// Get login_name and password
    var userName = request.body.login_name;
    var password = request.body.password;

    // Search for matching login_name, then compare Users.
    User.findOne({login_name: userName}, function (err, user) { 
		// If found and valid password, set to current session.
    	if (!err && user !== null && password === user.password) {
    		request.session.login_name = user.login_name;
    		response.status(200).end(JSON.stringify(user));
    	// Error handling
    	} else if (user === null) {
			response.status(400).end("Error: Invalid User");    	
    	} else if (password !== user.password){
    		response.status(400).end("Error: Incorrect Password");  
    	} else {
    		response.status(400).end("Error!");  
    	}
    });
});

/*
 * Example #5: POST Request Logging OUT User
 */
app.post('/admin/logout', function (request, response) {
	// delete attributes of session
    delete request.session.login_name;
    
    // DESTROY EVERYTHINGGGGGGG
    request.session.destroy(function (err) {
    	if (!err) {
    		response.status(200).end("Success");
    	} else {
    		response.status(400).send("Error");
    	}
    });
});

/*
 * Example #6: POST Request Creating New User (Account Creation Example)
 */
app.post('/user', function(request, response) {

	// Get body parameters
	var login_name = request.body.login_name;
	var password = request.body.password;
	var first_name = request.body.first_name;
	var last_name = request.body.last_name;
	
	// Check if login credentials already exist
	User.findOne({login_name: login_name}, function (err, user) { 
		
		// If no User with login_name exists yet and no Error, create new User
    	if (!err && user === null && login_name !== null && password !== null && first_name !== null && last_name !== null) {
    		User.create({
            	first_name: first_name,
            	last_name: last_name,
            	login_name: login_name,
            	password: password
        	}, function (err, userObj) {
            	if (err) {
                	console.error('Error create user', err);
            	} else {
                	// Set the unique ID of the object.
                	userObj.save();
                	response.end("Complete Registration");
            	}
        	});
        	
        // Error Handling - one of these had to have happened for us to not have created the User
    	} else if (user !== null) {
			response.status(400).send("Login Name already exists!");    	
    	} else if (login_name === null) {
			response.status(400).send("Cannot have a blank login name!");    	
    	} else if (password === null) {
			response.status(400).send("Cannot have a blank password!");    	
    	} else if (first_name === null) {
			response.status(400).send("First Name Required!");    	
    	} else if (last_name === null) {
			response.status(400).send("Last Name Required!");    		
    	} else {
    		response.status(400).send("Error!");
    	}
    });
});

/*
 * Example #7 - Return the information for specified User (based on Login_Name)
 * URL Parameter instead of request variable!
 */
app.get('/user/:login_name', function (request, response) {
	var param = request.params.login_name;

	// Search for single id and return user + relevant information
	User.findOne({login_name: param}, 'first_name last_name', function (err, user) { 
		if (!err) {
			response.end(JSON.stringify(user));
		} else {
			response.status(400).send("Error");    	
		}
	});
});


// DO NOT DELETE: Opens port for loading your webserver locally
var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


