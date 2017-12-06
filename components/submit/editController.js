'use strict';

/* Manages control over user-detail functionality */
cs50App.controller('EditController', ['$scope', '$rootScope', '$routeParams', '$resource', '$location',
    function ($scope, $rootScope, $routeParams, $resource, $location) {

        // We use Scope Variables so that Angular can update these for us as the user is typing in them. See loginTemplate.html
        var projectResource = $resource("/projects/" + $routeParams.projectId);
        projectResource.get({}, function (model) {
            $scope.description = model.description
            $scope.community_member = model.community_member
            $scope.tag = model.tag
            $scope.title = model.title
            $scope.email = model.email
            $scope.contact_number = model.contact_number
            $scope.reviewed = model.reviewed

        }, function (err) {
            window.alert(err);
        });

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
            if (!$scope.contact_number || !$scope.email || !$scope.description || !$scope.community_member || !$scope.title) {
                window.alert("Missing Fields.");

            } else {

                // Post - /user
                var userRes = $resource("/projects/" + $routeParams.projectId + "/update");
                var obj = {contact_number: $scope.contact_number, description: $scope.description, community_member: $scope.community_member,
                    tag: $scope.tag, title: $scope.title, email: $scope.email, reviewed: $scope.reviewed};
                console.log(obj)
                userRes.save(obj, function (data, headers, status) {


                    // Alert successful submission
                    window.alert("Successfully updated project: " + $scope.title);
                    $location.path('/home');
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
