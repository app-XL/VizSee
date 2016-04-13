'use strict';

angular.module('facts')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider

      .when('/facts/list', {
        templateUrl: '/public/mods/facts/factsViewMain.html',
        controller: 'factsControllerMain'
      })

      .when('/facts/add', {
        templateUrl: '/public/mods/facts/factsViewAdd.html',
        controller: 'factsControllerMain'
      })

      .when('/facts/:id/show', {
        templateUrl: '/public/mods/facts/factsViewShow.html',
        controller: 'factsControllerMain'
      })

      .when('/facts/:id/edit', {
        templateUrl: '/public/mods/facts/factsViewAdd.html',
        controller: 'factsControllerMain'
      })

      .when('/facts/panels', {
        templateUrl: '/public/mods/facts/factsViewPanels.html',
        controller: 'factsControllerMain'
      });
    }
  ]);
