'use strict';

/* Home view controller. Adjust welcome message and toolbar title */
cs50App.controller('HomeController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    var toolbarTitle = document.getElementById("toolbarTitle");
    toolbarTitle.innerHTML = "Home Page";
}]);