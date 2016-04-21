
angular.module('visitAdd', ['ngRoute','header','scroll','ui.calendar','angular-growl','textAngular','ngMaterial','ngMessages','ngImgCrop','ngFileUpload'])

.run(function ($rootScope, $location, $http) {
	$http.get('/token')
  .success(function (user, status) {
    if (user) {
     $rootScope.user = user;
   }
   else {
			// user not found, ask to login
    }
  });
})

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/add',{
    templateUrl: '/public/mods/visits/visitAdd.html',
    controller: 'visitsControllerMain'
  })
  .when('/home',{
    templateUrl: '/public/m/dummy2.html',
    controller: 'homeBlankCtrl'
  })

$routeProvider.otherwise('/home');

}]);
