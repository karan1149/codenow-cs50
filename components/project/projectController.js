'use strict';

/* Home view controller. Adjust welcome message and toolbar title */
cs50App.controller('projectController', ['$scope','$routeParams','$resource', '$window',
  function ($scope, $routeParams,$resource, $window) {

    var projectId = $routeParams.projectId;
    var resource = $resource('/projects/' + projectId);
    resource.get({}, function(model){
      $scope.project = model;
      let like_string = 'Liked by ';
      for (let name of $scope.project.liked_student_names){
        like_string += ' ' + name + ',';
      }
      if (like_string == 'Liked by ' ){
          like_string = 'Be the first to like!'
      }
      console.log(like_string);
      $scope.like_string = like_string;
    });
    //listen to changes in database.s
    //Need to convert the id's to student names

    // use in html with something like '<button ng-click="like()">Like or unlike</button>'
    $scope.like = function() {
      var likeResource = $resource('/project/' + projectId + '/like' );
      console.log('/project/' + projectId + '/like');
      likeResource.save({"name": $scope.main.loggedInUser}, function(like_message){
        console.log(like_message); // this will either by 'Like' or 'Unlike'
      });
      resource.get({}, function(model){
        console.log('HI !!!');
        $scope.project = model;
        console.log(model);
        let like_string = 'Liked by ';
        for (let name of $scope.project.liked_student_names){
          like_string += ' ' + name + ',';
        }
        if (like_string == 'Liked by ' ){
            like_string = 'Be the first to like!'
        }
        console.log(like_string);
        $scope.like_string = like_string;
      });
    }

    $scope.sendMail = function(emailId,subject,message){
      console.log(emailId)
      $window.open("mailto:"+ emailId + "?subject=" + subject+"&body="+message,"_self");
    };

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
/*
  $scope.isAdmin = function() {
    return false;
  }

  // todo: POST REQUEST NEEDED to submit the fact that project is reviewed/not reviewed
  $scope.submitProposal = function() {
  };
*/
}]);
