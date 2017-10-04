'use strict';

// We initialize our module with our loaded dependences (Angular Route, Angular Material, and Angular Resource)
//     Angular Route - helps us with redirection/responding to URL paths
//     Angular Material - is a nice style aid that lets us use Google's Angular Material Library to make this app look fancy
//     Angular Material - is a nice style aid that lets us use Google's Angular Material Library to make this app look fancy
var cs50App = angular.module('cs50App', ['ngRoute', 'ngMaterial', 'ngResource']);

/* First thing we do is configure our angular app with routes. For each route, we specify which HTML to show in the md-content and what Controller takes over */
cs50App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'components/home/homeTemplate.html',
                controller: 'HomeController'
            }).
            when('/login', {
                templateUrl: 'components/login/loginTemplate.html',
                controller: 'LoginController'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }]);

/* Here we initialize our first controller, titled "MainController"
 * We inject into it a bunch of services, as specified by the $ signs
 */
cs50App.controller('MainController', ['$scope', '$rootScope', '$location', '$http', '$routeParams', '$resource', '$mdDialog', '$mdMedia',
    function ($scope, $rootScope, $location, $http, $routeParams, $resource, $mdDialog, $mdMedia) {
        
        $scope.loggedIn;	// Boolean to keep track if user is logged in.
        
        // the $rootScope injection helps us determine if a certain event has occurred that altered the route
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        	if (!$scope.loggedIn) {
         	    // no logged user, redirect to /login unless already there
        		if (next.templateUrl !== "components/login/loginTemplate.html") {
            		$location.path("/login");
        		}
      		}
   		});
   		
   		// $scope variables are accessible in any other Angular controller with the $scope injection. Also accessible in the HTML controlled by the Controller
        $scope.main = {};
        $scope.main.loggedInUser = "User Name"
        $scope.logout = document.getElementById("logout");
 		
 		// Upon logout, communicate with server to logout/destroy session and manage view
 		$scope.logoutClicked = function(){
    		$scope.userReq = $resource('/admin/logout');
    		$scope.userReq.save({}, function () {
				$scope.loggedIn = false;
      			window.location = "#/login";
      			$scope.logout.style.visibility = "hidden";
      			$rootScope.$broadcast('LoggedOut');
			}, function errorHandling(err) { 
				console.log("INVALID LOGIN");
			});
 		};
 		
 		// When logging in, we set the loggedIn bool to true and signal to all other apps.
 		$scope.loggingIn = function() {
 			$scope.loggedIn = true;
 			$rootScope.$broadcast('LoggedIn');
 		};		
    }]);

