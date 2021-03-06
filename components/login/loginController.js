'use strict';

/* Manages control over user-detail functionality */
cs50App.controller('LoginController', ['$scope', '$rootScope', '$routeParams', '$resource',
  function ($scope, $rootScope, $routeParams, $resource) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */

    // Set toolbar title TODO:Remove this.
    // var toolbarTitle = document.getElementById("toolbarTitle");
    // toolbarTitle.innerHTML = "Please Login to the App";

    // login name and password
    $scope.login_name;
    $scope.password;

    // Grab the logout button by searching for it by its Id. TODO: Uncomment this.
    $scope.logout = document.querySelector(".loggedInToolBar");
    $scope.logout.style.display = "None";
    // Run Login and validate upon user clicking Login Button
    $scope.loginClick = function() {

        // POST REQUEST using $resource.
        var userRes = $resource("/admin/login");
        userRes.save({login_name: $scope.login_name, password: $scope.password}, function (model) {

            // Signal that user is successfully logging in
            $scope.loggingIn();

            // Set window location
            var next = "#/users/" + model._id;
            window.location = next;

            // Set logged in user. Notice how the scope.main.loggedInUser variables can be used across different files!
            $scope.main.loggedInUser = model.first_name + " " + model.last_name;
            console.log(model.user_type);
            $scope.main.user_type = model.user_type;
            $scope.main.login_name = model.login_name;

            // Set visibility of "Logout" Button
            $scope.logout.style.display = "block";
        }, function errorHandling(err) {

            // window.alert will show a popup containing text.
            window.alert(err.data);
        });
    };



    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */


    // Register a new user - function is called upon Register button being clicked

}]);
