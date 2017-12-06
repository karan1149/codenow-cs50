'use strict';

/* Home view controller. Adjust welcome message and toolbar title */
cs50App.controller('privateProfileController', ['$scope', '$rootScope', '$routeParams','$resource',
function ($scope, $rootScope, $routeParams, $resource) {
  var resource = $resource("/user/" + $scope.main.login_name);

  resource.get({}, function(model){
      console.log(model)
  });
}]);
