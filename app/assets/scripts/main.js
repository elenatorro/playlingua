'use strict';

  angular.module('PlaylinguaApp', ['ngResource', 'ngRoute', 'ngAnimate', 'ngDraggable', 'ngTouch'])

  .config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });

      $routeProvider
        .when("/dashboard/user", {
          templateUrl: "/views/users/index.html",
          controller: "UserController"
        })
        .when("/dashboard/:name/:level", {
          templateUrl: function(params){ return '/views/games/' + params.name + '.html';   },
          controller: "LevelController"
        })
        .when("/dashboard/friends", {
          templateUrl: "/views/users/friends.html",
          controller: "FriendsController"
        })
        .otherwise({
           redirectTo: '/dashboard/user'
        });
    }
  ]);
