'use strict';

angular.module('feedback')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider

  		.when('/feedbackTmpl/list', {
  			templateUrl: '/public/mods/feedback/feedbackViewMain.html',
  			controller: 'feedbackControllerMain'
  		})

      .when('/feedbackTmpl/add', {
        templateUrl: '/public/mods/feedback/feedbackViewAdd.html',
        controller: 'feedbackControllerMain'
      })

      .when('/feedbackTmpl/:id/show', {
        templateUrl: '/public/mods/feedback/feedbackViewShow.html',
        controller: 'feedbackControllerMain'
      })

      .when('/feedbackTmpl/:id/edit', {
        templateUrl: '/public/mods/feedback/feedbackViewAdd.html',
        controller: 'feedbackControllerMain'
      })

      .when('/feedbackTmpl/panels', {
        templateUrl: '/public/mods/feedback/feedbackViewPanels.html',
        controller: 'feedbackControllerMain'
      });
    }
  ]);
