'use strict';

/* Manages control over user-detail functionality */
cs50App.controller('SubmitController', ['$scope', '$rootScope', '$routeParams', '$resource',
    function ($scope, $rootScope, $routeParams, $resource) {

        // We use Scope Variables so that Angular can update these for us as the user is typing in them. See loginTemplate.html
        $scope.contact_info;
        $scope.description;
        $scope.community_member;
        $scope.tag;
        $scope.title;

/*
        var contact_info = request.body.contact_info // contact info of community member
        var description = request.body.description  // description of the project
        var community_member = request.body.community_member // community who created project
        var tag = request.body.tag  // tag associated with the project
        var title = request.body.title // title of the project
*/
        // Register a new user - function is called upon Register button being clicked
        $scope.submitClick = function() {

            // Check for missing fields
            if (!$scope.contact_info || !$scope.description || !$scope.community_member || !$scope.title) {
                window.alert("Missing Fields.");

            } else {

                // Post - /user
                var userRes = $resource("/projects/new");
                userRes.save({contact_info: $scope.contact_info, description: $scope.description, community_member: $scope.community_member,
                    tag: $scope.tag, title: $scope.title}, function (model) {


                    // Alert successful submission
                    window.alert("Successfully submitted project: " + $scope.title);
                    /*
                    $scope.main.loggedInUser = $scope.community_member;

                    // Upon successful submission, go to the project page
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
                    */
                }, function errorHandling(err) {
                    window.alert("Invalid Submission. Please Try Again.");
                    console.log(err.data);  // console.log prints to the console in the browser.
                });
            }
        };
    }]);
