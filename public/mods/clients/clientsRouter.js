'use strict';

angular.module('clients')
.config(['$routeProvider', function ($routeProvider) {
  	$routeProvider

	  .when('/clients/list', {
	    templateUrl: '/public/mods/clients/clientsViewMain.html',
	    controller: 'clientsControllerMain'
	  })

	  .when('/clients/add', {
	    templateUrl: '/public/mods/clients/clientsViewAdd.html',
	    controller: 'clientsControllerMain'
	  })

	  .when('/clients/:id/show', {
	    templateUrl: '/public/mods/clients/clientsViewShow.html',
	    controller: 'clientsControllerMain'
	  })

	  .when('/clients/:id/edit', {
	    templateUrl: '/public/mods/clients/clientsViewAdd.html',
	    controller: 'clientsControllerMain'
	  })

	  .when('/clients/panels', {
	    templateUrl: '/public/mods/clients/clientsViewPanels.html',
	    controller: 'clientsControllerMain'
	  });
	}
]);
