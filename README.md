# Instructions for using this Wireframe Web App
This is a MEAN Stack Wireframe for CS50

Use this if you want a quick jumpstart on creating a website from scratch.

## Installation Instructions:
1. Navigate to the folder you want this to be in
2. run the command "git init"
3. then run "git clone https://github.com/KevinKhieu/CS50WireframeApp.git"
4. Go into the project folder by typing "cd CS50WireframeApp" 

This website uses MongoDB (via Mongoose), Express, Angular.JS, and Node.JS (for back end)

Note: You will need to install MongoDB and Node to run this application. CS142 has good instructions on how to do this at http://web.stanford.edu/class/cs142/install.html

## Running the App
To run, navigate into this directory and:
1. in Terminal, run "mongod"
2. Open another Terminal window, navigate to this directory, and run "node webServer.js" - this starts the server at port 3000
3. Open your browser and navigate to localhost:3000, which is port 3000
4. Explore the website.

To close:
1. Type control + C in both Terminal windows running "mongod" and "node webServer.js"

## Files of Interest:
Client-Side (Browser/Front-End) Files:
+++ index.html
This is the HTML shell that holds everything in our app. When we navigate between pages, we are merely changing the HTML in this file (Ctrl+F for ng-view)
This file also loads our node dependencies + our CSS files + our other scripts/controllers

+++ mainController.js
This file contains our main Angular controller that is always running. An angular controller allows us to have a dynamic front-end - we assign what controller controls which HTML in the ng-app tags (reference line 2 of index.html).

+++ /home
This folder contains the HTML template, CSS, and Controller loaded when the user navigates to /home (after logging in)

+++ /login
This folder contains the HTML template, CSS, and Controller loaded when the user navigates to /login (default page if user isnt logged in)

Server-Side Files:
+++ webServer.js
Contains REST API function calls, and server setup code. This is the file we run when calling node webServer.js.
This also sets up our schema for MongoDB (interacts with the Database)

+++ /schema/user.js and /schema/data.js
These are example schema files for Mongoose to use. Think of these as the structure of the User and Data databases in MongoDB.
