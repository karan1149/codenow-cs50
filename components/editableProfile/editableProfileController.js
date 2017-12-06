'use strict';

/* Home view controller. Adjust welcome message and toolbar title */
cs50App.controller('privateProfileController', ['$scope', '$rootScope', '$routeParams','$resource','$location',
function ($scope, $rootScope, $routeParams, $resource,$location) {
  console.log("login: " + $scope.main.login_name);
  var resource = $resource("/user/" + $scope.main.login_name);
  resource.get({}, function(model){
      $scope.userProjects = [];
      for(let project_id of model.projects){
        let resource_getProj = $resource("/projects/" + project_id);
        resource_getProj.get({}, function(project){
          $scope.userProjects.push(project);
        });
      }

      //$scope.user.email = model.email;
      //$scope.user.contact =
  }, function (err) {
    console.log(err);
  });

  $scope.edit = function() {
    window.location = "#!/editUser";
  };

  $scope.go = function (projectId) {
    let path = '/project/' +  projectId;
    $location.path( path );
  };

}]);
