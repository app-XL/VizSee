angular.module('contacts')

.controller('spocCtrl', function($scope, $routeParams, $http, $location) {
   $http.get('/api/v1/secure/visits/all/activeVisit').success(function(response) {
    var str= String(response.visits.locations);
    var loc= str.split(",");
    $location.path("contacts/"+loc[0]);
    });
})

.controller('contactsCtrl', function($scope, $routeParams, $http) {

  $http.get('/api/v1/secure/contactList/city/' +$routeParams.city).success(function(response) {
    $scope.contactList = response;
  })

  $http.get('/api/v1/secure/visits/all/activeVisit').success(function(response) {
    var str= String(response.visits.locations);
    $scope.cities = str.split(/[ ,]+/);
    console.log($scope.cities)
    $scope.title=response.visits.title;
    $scope.anchor=response.visits.anchor;
     $http.get('/api/v1/secure/admin/users/'+$scope.anchor).success(function(response) {
       $scope.anchor=response;
    })
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
})
.directive("scroll", function ($window) {
  return function(scope, element, attrs) {
   console.log("scrolling...");
   scope.navClass = 'tb-big';
        //scope.data = false;
        angular.element($window).bind("scroll", function() {
         if (this.pageYOffset >= 100) {
           scope.navClass = 'tb-small';
                 //scope.data = true;
               } else {
                scope.navClass = 'tb-big';
                  //scope.data = false;
                }
                scope.$apply();
              });
      };
    });