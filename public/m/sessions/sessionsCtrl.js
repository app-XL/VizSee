angular.module('sessions')

.controller('sessionsCtrl', function($scope, $routeParams, $http) {
	console.log("sessions controller working");
    $http.get('/api/v1/secure/visits/' + $routeParams.id + '/sessions').success(function(response) {
        $scope.scheduleList = response;
          console.log($scope.scheduleList);
				//console.log(JSON.stringify($scope.scheduleList,null,2));
    });

		$scope.feedback_id="A10234567892345678900001";
    $scope.visit_id = $routeParams.id;

		$scope.hideFeeedbackDiv = true;
		$scope.toggleFeedbackDialog = function(index, $event){
			$scope.hideFeeedbackDiv = !$scope.hideFeeedbackDiv;
			$event.stopPropagation();
		};

})

.controller('sessionCtrl', function($scope, $routeParams, $http) {
	$scope.arrayData=[];
    console.log("session controller running");
    $http.get('/api/v1/secure/visitSchedules/' + $routeParams.id).success(function(response) {
        $scope.session = response;
				console.log(JSON.stringify($scope.session,null,2));
				    $scope.owner= $scope.session.session.owner;
				    $scope.supporter =$scope.session.session.supporter;
    console.log($scope.session.session.owner);
       console.log($scope.owner);
       $scope.arrayData.push($scope.owner)
       //$scope.arrayData.push($scope.supporter);

		});

        $scope.collapseDiv = function(index, text) {
            var ele = angular.element(document.getElementById(text + index));
            ele.toggle();
            var status = window.getComputedStyle(ele[0], null).getPropertyValue("display");
            if (status === "block") {
                ele.prev().addClass('chevron-down-arrow');
                ele.addClass('active');
            } else if (status === "none") {
                ele.prev().removeClass('chevron-down-arrow');
                ele.removeClass('active');
            }
        };


		$scope.hideFeeedbackDiv = true;
   	$scope.toggleFeedbackDialog = function(index, $event){
            $scope.hideFeeedbackDiv = !$scope.hideFeeedbackDiv;
            $event.stopPropagation();
        };
})

.controller('agendaCtrl', function($scope, $routeParams, $http, $location) {
    console.log("agenda controller running");
		$http.get('/api/v1/secure/visits/all/activeVisit').success(function(response) {
				//console.log("next visit id " + "#/sessions/" + response.visits._id));
				$location.path("sessions/" + response.visits._id);
		});
})
