var bios = angular.module('execBios', ['ngRoute']);

bios.config(['$routeProvider', function ($routeProvider) {
  $routeProvider

  .when('/execBios/:id', {
	    templateUrl: '/public/m/execBios/execBios.html',
	    controller: 'execBiosCtrl'
	})

	.when('/execBios', {
		templateUrl: '/public/m/dummy.html',
		controller: 'execBiosBlankCtrl'
	})



}]);

bios.controller('execBiosBlankCtrl', function($scope, $routeParams, $http, $location) {
    console.log("exec bios blank controller running");
		$http.get('/api/v1/secure/visits/all/activeVisit').success(function(response) {
				//console.log("next visit id " + "#/sessions/" + response.visits._id));
				$location.path("execBios/" + response.visits._id);
		});
});

bios.controller('execBiosCtrl', function($scope, $routeParams, $http) {
$http.get('/api/v1/secure/visits/all/activeVisit').success(function(response) {
                //console.log("next visit id " + "#/sessions/" + response.visits._id));
                $scope.title= response.visits.title;
        });
    $http.get('/api/v1/secure/visits/'+$routeParams.id+'/execs').success(function(response) {
        console.log(response);//responce has two arrays with clienId's and cscId's
        $scope.cscData = response[0];
        $scope.clientData = response[1];
         })

    $scope.collapseDiv = function(index, text){
        var ele = angular.element(document.getElementById(text + index));
        ele.toggle();
        var status = window.getComputedStyle(ele[0], null).getPropertyValue("display");
        if(status === "block"){
            ele.prev().addClass('chevron-down-arrow');
        } else if(status === "none") {
            ele.prev().removeClass('chevron-down-arrow');
        }
    };
});
