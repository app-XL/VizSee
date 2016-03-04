'use strict';

angular.module('baseApp', ['keynotes', 'clients', 'facts' , 'scheduler' , 'profile' ,'visits' , 'userDirective'])
.run(function ($rootScope, $location, $http) {
	$http.get('/token')
		.success(function (user, status) {
		if (user) {
			$rootScope.user = user;
			console.log($rootScope.user);
		}
	});
})
.config(['growlProvider', function(growlProvider) {
	growlProvider.globalReversedOrder(true);
	growlProvider.globalTimeToLive({success: 1000, error: 2000, warning: 3000, info: 4000});
	growlProvider.globalDisableCountDown(true);
	growlProvider.globalPosition('top-center');
}]);
