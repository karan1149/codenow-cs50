'use strict';

/* Home view controller. Adjust welcome message and toolbar title */
cs50App.controller('UnderReviewController', ['$scope','$routeParams','$resource',
  function ($scope, $routeParams,$resource) {
    // var toolbarTitle = document.getElementById("toolbarTitle");
    // toolbarTitle.innerHTML = "Home Page";

    var resource = $resource('/underReview/');
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
}]);
