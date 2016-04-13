
angular.module('home', ['ngRoute'])

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

  .when('/home', {
    templateUrl: '/public/m/home/home.html',
    controller: 'homeCtrl'
  })
  
.when('/welcome', {
    templateUrl: '/public/m/home/welcome.html',
    controller: 'welcomeCtrl'
  })
.when('/thankyou', {
    templateUrl: '/public/m/home/thankyou.html',
    controller: 'thankyouCtrl'
  })

	// if none of the above states are matched, use this as the fallback
  $routeProvider.otherwise('/home');

}]);
