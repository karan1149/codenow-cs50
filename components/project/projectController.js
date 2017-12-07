'use strict';

/* Home view controller. Adjust welcome message and toolbar title */
cs50App.controller('ProjectController', ['$scope','$routeParams','$resource', '$window',
  function ($scope, $routeParams,$resource, $window) {
    console.log($scope.main.user_type);
    var projectId = $routeParams.projectId;
    var resource = $resource('/projects/' + projectId);
    resource.get({}, function(model){
      $scope.project = model;
      let assignedString = "";
      for(let student of model.assigned_students){
        assignedString += student + ",";
      }
      console.log(assignedString)
      $scope.assignedString = assignedString;
      // let like_string = 'Liked by ';
      // for (let name of $scope.project.liked_student_names){
      //   like_string += ' ' + name + ',';
      // }
      // if (like_string == 'Liked by ' ){
      //     like_string = 'Be the first to like!'
      // }
      // console.log(like_string);
      // $scope.like_string = like_string;
    });
    //listen to changes in database.s
    //Need to convert the id's to student names

    // use in html with something like '<button ng-click="like()">Like or unlike</button>'
    // $scope.like = function() {
    //   var likeResource = $resource('/project/' + projectId + '/like' );
    //   console.log('/project/' + projectId + '/like');
    //   likeResource.save({"name": $scope.main.loggedInUser}, function(like_message){
    //     console.log(like_message); // this will either by 'Like' or 'Unlike'
    //   });
    //   resource.get({}, function(model){
    //     $scope.project = model;
    //     console.log(model);
    //     let like_string = 'Liked by ';
    //     for (let name of $scope.project.liked_student_names){
    //       like_string += ' ' + name + ',';
    //     }
    //     if (like_string == 'Liked by ' ){
    //         like_string = 'Be the first to like!'
    //     }
    //     console.log(like_string);
    //     $scope.like_string = like_string;
    //   });
    // }

    $scope.sendMail = function(emailId,subject,message){
      console.log(emailId);
      $window.open("mailto:"+ emailId + "?subject=" + subject+"&body="+message,"_self");
    };

    $scope.approve = function () {
      var reviewResource = $resource('/projects/' + $scope.project._id + '/update');
      $scope.project.reviewed = true
      reviewResource.save($scope.project, function (model) {
        window.alert("Successfully reviewed");
      }, function (err) {
        window.alert(err.data);
      });
    };

    $scope.edit = function() {
      window.location = "#!/projects/" + $scope.project._id + "/edit";
    };

    $scope.assignStudent = function (student) {
      console.log("/projects/" + projectId + "/assign/" + student);
      var assignStudentResource = $resource("/projects/" + projectId + "/assign/" + student);
      assignStudentResource.save({}, function (model){
        window.alert("Student " + student + " successfully assigned!")
      }, function (err) {
        console.log(err);
        window.alert(err.data);
      });
    };

    $scope.removeStudent = function (student) {
      var removeStudentResource = $resource("/projects/" + projectId + "/remove/" + student);
      removeStudentResource.save({}, function (model) {
        window.alert("Student " + student + " successfully removed!")
      }, function (err) {
        console.log(err)
        window.alert(err.data);
      });
    };
}]);
