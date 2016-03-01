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
	  	
      //acts as get user profile by id
  		var refresh = function(id) {
  	  id=$rootScope.user._id;
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
   		};

      //edit the profile picture of user by taking dataurl and user id.
   		$scope.editpicture = function (dataUrl,id) {
   			  id=$rootScope.user._id;
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
      
      //edit the profile data user by taking user id.
      $scope.editprofile = function (id) {
          id=$rootScope.user._id;
          console.log('edit profile function');
          console.log($scope.user);
          $http.put('/api/v1/users/'+ id, $scope.user).success(function(response) {
                 console.log(response);
                 window.location.reload();
          });
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

