'use strict';

/* Home view controller. Adjust welcome message and toolbar title */
cs50App.controller('HomeController', ['$scope','$routeParams','$resource','$location',
  function ($scope, $routeParams,$resource,$location) {
    // var toolbarTitle = document.getElementById("toolbarTitle");
    // toolbarTitle.innerHTML = "Home Page";
    console.log('hi prelist')
    var resource = $resource('/projectlist/');
    resource.query(function(payload){
      console.log(payload)
      $scope.projectList = payload
      // contact_info: String, // contact info of community member
      // student: String, // student who has accepted the project
      // description: String,  // description of the project
      // community_member: String,  // community who created project
      // tag: String,  // tag associated with the project
      // title: String // title of the project
    });
    $scope.go = function ( projectId ) {
      let path = '/project/' +  projectId;
      $location.path( path );
    };

}]);
