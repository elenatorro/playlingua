'use strict';

  angular.module('PlaylinguaApp', ['ngResource', 'ngRoute', 'ngAnimate', 'ngDraggable'])

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
        .when("/dashboard/sinonimos/:level", {
          templateUrl: "/views/synonyms/index.html",
          controller: "SynonymsController"
        })
        .otherwise({
           redirectTo: '/dashboard/user'
        });
    }
  ]);
