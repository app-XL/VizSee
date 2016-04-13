var client=angular.module('clientInfo', ['ngRoute'])
client.config(['$routeProvider', function ($routeProvider) {
  $routeProvider



  .when('/clientInfo/id/:id', {
    templateUrl: '/public/m/clientInfo/clientInfo.html',
    controller: 'clientInformationCtrl'
})
  .when('/clientInfo/id', {
        templateUrl: '/public/m/dummy.html',
        controller: 'clientBlankCtrl'
    })
}])

client.controller('clientBlankCtrl', function($scope, $routeParams, $http, $location) {
    console.log("client  blank controller running");
        $http.get('/api/v1/secure/visits/all/activeVisit').success(function(response) {
                //console.log("next visit id " + "#/sessions/" + response.visits._id));
        console.log(response.visits._id);
                $location.path("clientInfo/id/" + response.visits._id);
        });
})
client.controller('clientInformationCtrl', function($scope, $routeParams, $http) {
    //$scope.id="a02234567892345678900001";
    $http.get('/api/v1/secure/clients').success(function(response) {
        $scope.clientList1 = response;
    });
       $http.get('/api/v1/secure/clients/id/' + $routeParams.id).success(function(response) {
        $scope.clientList = response;
        console.log($scope.clientList);
        console.log($scope.clientList.name);
        console.log($scope.clientList.cscPersonnel.salesExec._id)

    });

        angular.element('#hamburger-menu').css('display', 'none');

        $scope.representatives = [{
            'client_representatives': [{
                'name': 'Harry John',
                'picture': '/public/assets/g/imgs/avatar.jpg',
                'designation': 'Sr Analyst, EMC Inc, IL, USA',
                'bio': 'Met my aggressive timeline requirement with very good quality. Worked with me to come up with a viable solution to meet the timeline. Easy to work with and have the customers best interest in mind. You can find less expensive alternatives but the quality and responsiveness is well worth the price',
                'email': 'vincent@csc.com',
                'telephone': '+555 555 555'
            }, {
                'name': 'Jayne Smith',
                'picture': '/public/assets/g/imgs/avatar.jpg',
                'designation': 'Sr Analyst, EMC Inc, IL, USA',
                'bio': 'Met my aggressive timeline requirement with very good quality. Worked with me to come up with a viable solution to meet the timeline. Easy to work with and have the customers best interest in mind. You can find less expensive alternatives but the quality and responsiveness is well worth the price',
                'email': 'vincent@csc.com',
                'telephone': '+555 555 555'
            }, {
                'name': 'Rossy Hall',
                'picture': '/public/assets/g/imgs/avatar.jpg',
                'designation': 'Sr Analyst, EMC Inc, IL, USA',
                'bio': 'Met my aggressive timeline requirement with very good quality. Worked with me to come up with a viable solution to meet the timeline. Easy to work with and have the customers best interest in mind. You can find less expensive alternatives but the quality and responsiveness is well worth the price',
                'email': 'vincent@csc.com',
                'telephone': '+555 555 555'
            }]
        }];

        $scope.past_events = [{
            'visit_date': '13/09/2015',
            'visit_name': 'Moto - Mobility Visit',
            'visit_details': 'Met my aggressive timeline requirement with very good quality'
        }, {
            'visit_date': '13/09/2014',
            'visit_name': 'Moto - Mobility Visit',
            'visit_details': 'Met my aggressive timeline requirement with very good quality'
        }];

        $scope.current_engagement = [{
            'project_name': 'Back Office Operations Project',
            'project_details': 'Met my aggressive timeline requirement with very good quality'
        }, {
            'project_name': 'Payment Project',
            'project_details': 'Met my aggressive timeline requirement with very good quality'
        }];

        $scope.prime_competitors = [{
            'image': '/public/uploads/images/industry/diversified.png'
        }, {
            'image': '/public/uploads/images/industry/healthcare.png'
        }, {
            'image': '/public/uploads/images/industry/insurance.png'
        }];

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

        $scope.viewAgenda = function(event) {
            event.stopPropagation();
        };
    })
