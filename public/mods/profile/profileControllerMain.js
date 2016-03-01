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
	function($scope, $http, $routeParams, $location, growl, $rootScope, Upload, $timeout, ngDialog,req) {	
	  	//acts as get data by id
  		var refresh = function(id) {
  	  id="56d4349456dc4ddc32dac0f9";
  		$http.get('/api/v1/users/'+id).success(function(response) {
  		$scope.user = response;  
      $scope.email = $scope.user.email;
      $scope.facebooktoken = $scope.user.facebook.token;
      $scope.twittertoken = $scope.user.twitter.token;
      $scope.googletoken = '';
      console.log($scope.facebooktoken);
      console.log($scope.user);

  		});
  		};refresh();	
   	  
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
                $rootScope.cropdataurl=response.data.file.path;             
                console.log($scope.user.avatar);
                console.log($scope.user);

                $http.post('/api/v1/users/',$scope.user).success(function(response1) {
                 console.log(response1);
                });
           });
        
        //$scope.profile.avatar=data;
        //console.log($scope.profile.avatar);
   		};

   		$scope.editpicture = function (dataUrl,id) {
   			id="56d4349456dc4ddc32dac0f9"
        	console.log('edit picture function');
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

                $http.put('/api/v1/users/'+ id, $scope.user).success(function(response1) {
                 console.log(response1);
                 window.location.reload();
                });
           });
           ngDialog.closeAll();        
   		};	
      
      $scope.editprofile = function (id) {
        id="56d4349456dc4ddc32dac0f9"
          console.log('edit profile function');
          console.log($scope.user);
          $http.put('/api/v1/users/'+ id, $scope.user).success(function(response) {
                 console.log(response);
                 window.location.reload();
          });
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

