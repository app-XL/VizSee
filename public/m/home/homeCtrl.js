

var app = angular.module('home');

app.controller('homeCtrl', ['$scope', 'location', function ($scope, location) {
   location.get(angular.noop, angular.noop);
   $scope.dayHighlighter = [{
   	    day:"1",
     	date: "10 Apr 2016",
		location: "Noida",
		starts: "09:30",
		ends: "17:30",
		climate: {
			temp: "26C",
			humidity:"12",
			dayLike: "cloudy"
		}
   },
   {
        day:"2",
     	date: "11 Apr 2016",
		location: "Hyderabad",
		starts: "09:30",
		ends: "17:30",
		climate: {
			temp: "37C",
			humidity:"12",
			dayLike: "sunny"
   }
},
{
        day:"3",
     	date: "13 Apr 2016",
		location: "Bangalore",
		starts: "09:30",
		ends: "17:30",
		climate: {
			temp: "20C",
			humidity:"12",
			dayLike: "rainy"
   }
},
{
        day:"4",
     	date: "14 Apr 2016",
		location: "Vadodara",
		starts: "09:30",
		ends: "17:30",
		climate: {
			temp: "25C",
			humidity:"12",
			dayLike: "rainy"
   }
}];
}]);


app.controller('welcomeCtrl', ['$scope', 'location', function ($scope, location) {

}]);

app.controller('thankyouCtrl', ['$scope', 'location', function ($scope, location) {

}]);




// app.directive("scroll", function ($window) {
//     return function(scope, element, attrs) {
// 			console.log("scrolling...");
//     	 	scope.navClass = 'big';
//         //scope.data = false;
//         angular.element($window).bind("scroll", function() {
//              if (this.pageYOffset >= 100) {
//                  scope.navClass = 'small';
//                  //scope.data = true;
//              } else {
//                   scope.navClass = 'big';
//                   //scope.data = false;
//              }
//             scope.$apply();
//         });
//     };
// });