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
var Project = require('./schema/project.js');

// Load Express
var express = require('express');
var app = express();

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// Connect to the CS50Project Mongo Database
// mongoose.connect('mongodb://localhost/CS50Project');
mongoose.connect('mongodb://code-now-user:codenow@ds121896.mlab.com:21896/heroku_c2f6v1db');
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
            request.session._id = user._id;
            request.session.user_type = user.user_type;
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
    delete request.session._id;
    delete request.session.user_type;

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
 * Example #7 - Return the information for specified User (based on Login_Name)
 * URL Parameter instead of request variable!
 */
app.get('/user/:login_name', function (request, response) {
    if (request.session._id === undefined) {
        response.status(401).send('No one logged in');
        return;
    }

    var param = request.params.login_name;

    // Search for single id and return user + relevant information
    User.findOne({login_name: param}, function (err, user) {
        if (!err) {
            response.end(JSON.stringify(user));
        } else {
            response.status(400).send("Error");
        }
    });
});

/*
 * GET Request for all the projects
 */
app.get('/projectlist/', function(request, response) {
    if (request.session._id === undefined) {
        response.status(401).send('No one logged in');
        return;
    }

    Project.find({reviewed: true}, function (err, projects) {
        if (err){
            response.status(400).send(err);
        }
        projects = JSON.parse(JSON.stringify(projects));
        response.status(200).send(projects);
    });
});


/*
 * POST Request to assign a particular student to a project
 */
app.post('/projects/:projectId/assign/:studentUsername', function (request, response) {
    if (request.session._id === undefined) {
        response.status(401).send('No one logged in');
        return;
    }
    if (request.session.user_type !== "Admin") {
        console.log(user.login_name + " is not an admin");
        response.status(400).send(user.login_name + " is not an admin");
        return;
    }

    var projectId = request.params.projectId

    Project.findOne({_id: projectId}, function (err, project) {
        if (err) {
            console.log(1)
            response.status(400).send("err in proj");
        }


        var studentUsername = request.params.studentUsername

        User.findOne({userName: studentUsername}, function (err2, student) {
            if (err2) {
                console.log(2)
                response.status(400).send("err in stud");
            }

            project.assigned_students.push(studentUsername);
            project.save();
            student.projects.push(projectId);
            student.save();
            response.status(200).send();
        })
    });
});

/*
 * POST Request to remove a particular student to a project
 */
app.post('/projects/:projectId/remove/:studentUsername', function (request, response) {
    if (request.session._id === undefined) {
        response.status(401).send('No one logged in');
        return;
    }

    if (request.session.user_type !== "Admin") {
        console.log(user.login_name + " is not an admin");
        response.status(400).send(user.login_name + " is not an admin");
        return;
    }

    var projectId = request.params.projectId

    Project.findOne({_id: projectId}, function (err, project) {
        if (err) {
            response.status(400).send(err);
        }

        var studentUsername = request.params.studentUsername

        User.findOne({userName: studentUsername}, function (err2, student) {
            if (err2) {
                response.status(400).send(err);
            }

            project.assigned_students.splice(project.assigned_students.indexOf(studentUsername), 1);
            project.save();
            student.projects.splice(student.projects.indexOf(projectId), 1);
            student.save();
            response.status(200).send();
        })
    });
});

// /*
//  * POST Request for a user to like  and unlike a project
//  */
// app.post('/project/:id/like', function(request,response) {
//     console.log(request.body.name);
//     if (request.session._id === undefined) {
//         response.status(401).send('No one logged in');
//         return;
//     }

//     var user_id = request.session._id
//     var project_id = request.params.id;

//     Project.findOne({_id: project_id}, function (err, project) {
//         if (err) {
//             response.status(400).send(err);
//             return;
//         }
//         if (project.liked_students.includes(user_id) &&
//               project.liked_student_names.includes(request.body.name) ) {
//             project.liked_students.splice(project.liked_students.indexOf(user_id), 1);
//             project.liked_student_names.splice(project.liked_student_names.indexOf(request.body.name), 1);
//             project.save();
//             response.status(200).send('Unlike');
//         } else {
//           project.liked_students.push(user_id);
//           project.liked_student_names.push(request.body.name)
//           project.save();
//           response.status(200).send('like');
//         }

//     //     if (project.liked_students.includes(user_id)) {
//     //         project.liked_students.splice(project.liked_students.indexOf(user_id), 1);
//     //         project.save();
//     //
//     //
//     //     } else {
//     //         project.liked_students.push(user_id);
//     //         project.save();
//     //
//     //         response.status(200).send('Unlike');
//     //     }
//     });
// });


/*
 * GET Request for all unreviewed projects
 */
app.get('/underReview/', function(request, response) {
    if (request.session._id === undefined) {
        response.status(401).send('No one logged in');
        return;
    }

    if (request.session.user_type !== "Admin") {
        console.log(user.login_name + " is not an admin");
        response.status(400).send(user.login_name + " is not an admin");
        return;       
    }

    Project.find({reviewed: false}, function (err, projects) {
        if (err){
            response.status(400).send(err);
        }

        projects = JSON.parse(JSON.stringify(projects));
        response.status(200).send(projects);
    });
});

/*
 * GET: Request for a specific project by id
 * example would be /projects/1234
 */
app.get('/projects/:id', function(request, response) {
    if (request.session._id === undefined) {
        response.status(401).send('No one logged in');
        return;
    }

    var id = request.params.id;

    Project.findOne({_id: id}, function (err, project) {
        if (project === undefined) {
            console.log('Project with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }

        if (err) {
            response.status(400).send(err);
            return;
        }

        response.status(200).send(project);
    });
});


/*
 * POST: Request creating new PROJECT
 *  - Body of request should contain contact_number, email
 *      description, community_member, tag, title
 */
app.post('/projects/new', function(request, response) {
    if (request.session._id === undefined) {
        response.status(401).send('No one logged in');
        return;
    }

    var description = request.body.description;  // description of the project
    var community_member = request.body.community_member; // community who created project
    var tag = request.body.tag ; // tag associated with the project
    var title = request.body.title; // title of the project
    var email = request.body.email;
    var contact_number = request.body.contact_number;

    if (email === null) {
        response.status(400).send("Contact Info Required!");
    } else if (title === null) {
        response.status(400).send("Title Required!");
    } else if (community_member === null) {
        response.status(400).send("Community Member Required!");
    } else if (description === null) {
        response.status(400).send("Description Required!");
    } else if (contact_number === null) {
        response.status(400).send("Description Required!");
    }

    Project.create({
        contact_number: contact_number,
        email: email,
        description: description,
        community_member: community_member,
        tag: tag,
        title: title,
        reviewed: false
    }, function (err, projectObj) {
        if (err) {
            console.error('Error creating project', err);
            response.status(400).send(err)
        } else {
            // Set the unique ID of the project.
            projectObj.save();
            response.end("Project Created");
        }
    });

});

/*
 * POST: Request Creating New User (Account Creation Example)
 * Request contains user_type, login_name, password, first_name, last_name, email
 */
app.post('/user', function(request, response) {

	// Get body parameters
    var user_type = request.body.user_type;
	var login_name = request.body.login_name;
	var password = request.body.password;
	var first_name = request.body.first_name;
	var last_name = request.body.last_name;
    var email = request.body.email;

	// Check if login credentials already exist
	User.findOne({login_name: login_name}, function (err, user) {

		// If no User with login_name exists yet and no Error, create new User
    	if (!err && user === null && login_name !== null && password !== null && first_name !== null && last_name !== null && user_type !== null) {
    		User.create({
                user_type: user_type,
            	first_name: first_name,
            	last_name: last_name,
            	login_name: login_name,
                email: email,
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
        } else if (email === null) {
            response.status(400).send("Email Required!")
    	} else if (user_type === null) {
            response.status(400).send("User Type Required!");
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
    if (request.session._id === undefined) {
        response.status(401).send('No one logged in');
        return;
    }

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

/*
 * POST request to set the reviewed status of a project
 *  - Param "id" should be the mongo id of the project
 *  - Body of the request should include a boolean "reviewed" value
 */
 app.post('/projects/:id/update', function (request, response) {
    if (request.session._id === undefined) {
        response.status(401).send('No one logged in');
        return;
    }

    if (request.session.user_type !== "Admin") {
        console.log(user.login_name + " is not an admin");
        response.status(400).send(user.login_name + " is not an admin");
        return;
    }
    var id = request.params.id; // project id in mongo
    var reviewed= request.body.reviewed; // rewiewed status of project
    var contact_number = request.body.contact_number; // contact info of community member
    var email = request.body.email;
    var description = request.body.description;  // description of the project
    var community_member = request.body.community_member; // community who created project
    var tag = request.body.tag ; // tag associated with the project
    var title = request.body.title; // title of the project

    // check that all fields are filled out
    if (email === null) {
        response.status(400).send("Contact Info Required!");
    } else if (contact_number === null) {
        response.status(400).send("Contact Info Required!");
    } else if (title === null) {
        response.status(400).send("Title Required!");
    } else if (community_member === null) {
        response.status(400).send("Community Member Required!");
    } else if (description === null) {
        response.status(400).send("Description Required!");
    } else if (reviewed === null) {
        response.status(400).send("Reviewed Required!");
    }

    // find the project
    Project.findOne({_id: id}, function (err, project) {
        if (project === undefined) {
            console.log("Project with _id: " + id + " not found.");
            response.status(400).send("Project " + id + " not found");
            return;
        }

        // update the project
        project.reviewed = reviewed;
        project.contact_number = contact_number;
        project.email = email;
        project.tag = tag;
        project.community_member = community_member;
        project.description = description;
        project.title = title;

        project.save();

        response.status(200).send();
    });
 });



// DO NOT DELETE: Opens port for loading your webserver locally
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
