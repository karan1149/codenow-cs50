'use strict';

/* Home view controller. Adjust welcome message and toolbar title */
<<<<<<< HEAD
cs50App.controller('projectController', ['$scope','$routeParams','$resource',
=======
cs50App.controller('ProjectController', ['$scope','$routeParams','$resource',
>>>>>>> 9d16e60d3319fec48dc2b03c893732d6d8c16a38
  function ($scope, $routeParams,$resource) {
    var toolbarTitle = document.getElementById("toolbarTitle");
    toolbarTitle.innerHTML = "Project Page";

    var projectId = $routeParams.projectId;
    console.log($routeParams)
    console.log('What is this?');
    var resource = $resource('/projects/' + projectId);
    resource.get({}, function(model){
      $scope.project = model;
    });

/* project will have the following attributes:

  contact_info: String, // contact info of community member
  student: String, // student who has accepted the project
  description: String,  // description of the project
  community_member: String,  // community who created project
  tag: String,  // tag associated with the project
  title: String, // title of the project
  reviewed: Boolean // if the project has been reviewed by the admins

  */

  // todo: need a function to check if the user is admin so as to decide whether or not to display the form to accept/reject proposal
  /*
  $scope.isAdmin = function() {
    if (//check if the logged in user is an admin)
      return true;
    else
      return false;
    };
    */
  //right now, just returning false so that the form doesn't appear
  $scope.isAdmin = function() {
    return false;
  }
  
  // todo: POST REQUEST NEEDED to submit the fact that project is reviewed/not reviewed
  $scope.submitProposal = function() {
  };

}]);
