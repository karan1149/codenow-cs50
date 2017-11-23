'use strict';

/* Home view controller. Adjust welcome message and toolbar title */
cs50App.controller('projectController', ['$scope','$routeParams','$resource',
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
}]);
