'use strict';

angular.module('users')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      
      .when('/u/', {
        templateUrl: '/public/mods/admin/users/usersViewMain.html',
        controller: 'usersControllerMain'
      })
      
      .when('/g/', {
        templateUrl: '/public/mods/admin/users/groupsViewMain.html',
        controller: 'usersControllerMain'
      });
      
    }
  ]);
