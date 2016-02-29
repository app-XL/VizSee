'use strict';

var profileApp = angular.module('profile');

profileApp.service('multipartForm', ['$http', function($http){
  this.post = function(uploadUrl, data){
    var fd = new FormData();
    for(var key in data)
      fd.append(key, data[key]);
    $http.post(uploadUrl, fd, {
      transformRequest: angular.indentity,
      headers: { 'Content-Type': undefined }
    }).success(function(response){
      console.log(response)
        });
  }
}]);


profileApp.controller('profileControllerMain', ['$scope', '$http', '$routeParams', '$location', 'growl', '$rootScope', 'Upload', '$timeout','ngDialog',
	function($scope, $http, $routeParams, $location, growl, $rootScope, Upload, $timeout, ngDialog) {		
   	    //rootScope for capturing the value of croppedimage across controllers
        $rootScope.cropdataurl='';
        $scope.welcome={};
        //$scope.welcome.avatar='';
        //upload the file(url of image) to database with ngFileupload and multer 
    	$scope.upload = function (dataUrl) {
        	console.log('upload function')
        	Upload.upload({
            	url: '/api/v1/upload/',
            	data: {
                	file: Upload.dataUrltoBlob(dataUrl),                
            	},
        	}).then(function (response) {
            
                $scope.result = response.data;
                console.log(response.data.file.path);
                $scope.user.avatar=response.data.file.path;                
                console.log($scope.user.avatar);
                console.log($scope.user);

                $http.post('/api/v1/users/',$scope.user).success(function(response1) {
                 console.log(response1);
                });
           });
        
        //$scope.profile.avatar=data;
        //console.log($scope.profile.avatar);
   		};


    
    	//sending the croppeddatauri from ngDialog to profilehtml page
    	$scope.send = function (dataUrl) {     
      	  	console.log('send function')      
       	 	$rootScope.cropdataurl = dataUrl;
       		console.log($rootScope.cropdataurl); 
      		ngDialog.closeAll();       
    	};

    	$scope.cancel = function () {       
       		ngDialog.closeAll();
    	};		
}])

profileApp.controller('MainCtrl', function($scope, ngDialog) {
    $scope.clickToOpen = function () {
        ngDialog.open({ template: 'templateId' });
    };
});

