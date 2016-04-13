'use strict';

angular.module('users')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider

      .when('/users/', {
        templateUrl: '/public/mods/admin/users/usersViewMain.html',
        controller: 'usersControllerMain'
      })

      .when('/groups/', {
        templateUrl: '/public/mods/admin/users/groupsViewMain.html',
        controller: 'usersControllerMain'
      })

      .when('/users/panels', {
        templateUrl: '/public/mods/admin/users/usersViewPanels.html',
        controller: 'usersControllerMain'
      });

    }
  ]);
