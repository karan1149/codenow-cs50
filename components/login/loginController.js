'use strict';

/* Manages control over user-detail functionality */
cs50App.controller('LoginController', ['$scope', '$rootScope', '$routeParams', '$resource',
  function ($scope, $rootScope, $routeParams, $resource) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */

    // We use Scope Variables so that Angular can update these for us as the user is typing in them. See loginTemplate.html
    $scope.newLogin;
    $scope.newPass;
    $scope.confirmPass;
    $scope.newFirst;
    $scope.newLast;

    // Register a new user - function is called upon Register button being clicked
    $scope.register = function() {

        // Check for missing fields
        if (!$scope.newLogin || !$scope.newPass || !$scope.newFirst || !$scope.newLast) {
            window.alert("Missing Fields.");

        // Check to make sure the password and confirmed password fields match
        } else if ($scope.newPass !== $scope.confirmPass) {
            window.alert("Passwords do not match.");
        } else {

            // Post - /user
            var userRes = $resource("/user");
            userRes.save({login_name: $scope.newLogin, password: $scope.newPass, first_name: $scope.newFirst,
                last_name: $scope.newLast}, function (model) {

                // Alert successful registration
                window.alert("Successfully registered! Logging In!");
                // Set logged in user. Notice how the scope.main.loggedInUser variables can be used across different files!
                $scope.main.loggedInUser = $scope.newFirst + " " + $scope.newLast;
                // Upon successful registration, automatically log in the user.
                var userRes = $resource("/admin/login");

                userRes.save({login_name: $scope.newLogin, password: $scope.newPass}, function (model) {

                    // Signal login
                    $scope.loggingIn();

                    // set next location
                    window.location = "#/home";

                    // Change visibility of file upload and logout button
                    $scope.logout.style.visibility = "visible";
                }, function errorHandling(err) {

                    // Alert user with error
                    window.alert(err.data);
                });

            }, function errorHandling(err) {
                window.alert("Invalid Login. Please Try Again.");
                console.log(err.data);  // console.log prints to the console in the browser.
            });
        }
    };
}]);
