'use strict';

angular.module('contactList')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      
      .when('/contactList/list', {
        templateUrl: '/public/mods/contactList/contactListViewMain.html',
        controller: 'contactListControllerMain'
      })

      .when('/contactList/panels', {
        templateUrl: '/public/mods/contactList/contactListViewPanels.html',
        controller: 'contactListControllerMain'
      });
    }
  ]);
