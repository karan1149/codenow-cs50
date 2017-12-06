'use strict';

/* Home view controller. Adjust welcome message and toolbar title */
cs50App.controller('privateProfileController', ['$scope', '$rootScope', '$routeParams','$resource',
function ($scope, $rootScope, $routeParams, $resource) {
  console.log("login: " + $scope.main.login_name);
  var resource = $resource("/user/" + $scope.main.login_name);
  resource.get({}, function(model){
      console.log(model);
      console.log(model.projects);
      $scope.userProjects = [];
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
