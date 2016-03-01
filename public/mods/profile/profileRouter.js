'use strict';

angular.module('profile')
  .config(['$routeProvider', function ($routeProvider,req, res) {
    $routeProvider
      
      .when('/p/', {
        templateUrl: '/public/mods/profile/profileViewMain.html',
        controller: 'profileControllerMain'
      })

/*      .when('/add', {
        templateUrl: '/public/mods/keynotes/keynotesViewAdd.html',
        controller: 'keynotesControllerMain'
      })

      .when('/:id/show', {
        templateUrl: '/public/mods/keynotes/keynotesViewShow.html',
        controller: 'keynotesControllerMain'
      })

      .when('/:id/edit', {
        templateUrl: '/public/mods/keynotes/keynotesViewAdd.html',
        controller: 'keynotesControllerMain'
      });
*/

    }
  ]);
