'use strict';
var usersApp = angular.module('users');

usersApp.controller('usersControllerMain', ['$scope', '$http', '$routeParams','$location', 'growl','$rootScope','$mdDialog',
  function($scope, $http, $routeParams, $location,growl,$rootScope,$mdDialog) { 

    $scope.hideFilter = true;
    $scope.hideAddRow = true;
    $scope.action = "none";

    //fetching all the user details by calling refresh function
    var refresh = function() {
      $http.get('/api/v1/secure/admin/users').success(function(response) {       
        $scope.userlist = response;
        $scope.user = "";
      });

      $http.get('/api/v1/secure/admin/groups').success(function(response) {       
        $scope.grouplist = response;       
      });
    };

    refresh();

    $scope.addRecord = function(){
      $scope.hideAddRow = false;
      $scope.action = "add";
    };

    $scope.save = function() {
      switch($scope.action)
      {
        case "add":
        $scope.addUser();
        break;

        case "edit":
        $scope.update();
        break;
      }
    }

    //adding new user into the user model
    $scope.addUser = function() {      
      $http.post('/api/v1/secure/admin/users/', $scope.user).success(function(response) {        
        refresh();
        $scope.action = "none";
        $scope.hideAddRow = true;
        growl.info(parse("User with email [%s]<br/>added successfully",$scope.user.email));
      });
    };

    //removing the user from user model
    $scope.remove = function(user) {
     var email = user.email;
     $http.delete('/api/v1/secure/admin/users/' + user._id).success(function(response) {
      refresh();
      growl.info(parse("User with email [%s]<br/>deleted successfully",email));
    });
   };

   //editing the existing user details
   $scope.edit = function(id) {      
    $http.get('/api/v1/secure/admin/users/' + id).success(function(response) {
      $scope.user = response;
      $scope.hideAddRow = false;
      $scope.action = "edit";
    });
  }; 

  //updating user details
  $scope.update = function() {      
    $http.put('/api/v1/secure/admin/users/' + $scope.user._id, $scope.user).success(function(response) {
      refresh();
      $scope.action = "none";
      $scope.hideAddRow = true;
    })
  };

  //closing the record by clicking on close button
  $scope.deselect = function() {
    $scope.user = "";
    $scope.hideAddRow = true;
  }

  //lock the existing user whose status is active  
  $scope.lock = function(id,user) {
    user.status = "Locked" ;
    $http.put('/api/v1/secure/admin/users/' + id,user).success(function(response) {
      refresh();
      growl.info(parse("User with email [%s]<br/>locked successfully",user.email));        
    })
  };

  //unlock the existing user whose status is locked  
  $scope.unlock = function(id,user) {
    user.status = "Active" ;
    $http.put('/api/v1/secure/admin/users/' + id, user).success(function(response) {
      refresh();       
      growl.info(parse("User with email [%s]<br/>unlocked successfully",user.email));
    })
  };

  // getting user details and show dialog box when clicking on group icon
  $scope.getUserDetails = function(id,ev) {
    $mdDialog.show({
     controller: Dialog,
     templateUrl: '/public/mods/admin/users/userDialog.html',
     locals: { usersid: id },
     parent: angular.element(document.body),
     targetEvent: ev,
     clickOutsideToClose:true
   });
  }; 

    // selected groups
    $scope.selection = [];
    $scope.selectedgroup = null;

    // toggle selection for a given group by name
    $scope.toggleSelection = function toggleSelection(groupId) {

     var idx = $scope.selection.indexOf(groupId);
     $scope.selectedgroupid = groupId;
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }
      
      // is newly selected
      else {
        $scope.selection.push(groupId);
      }
    };

    // add user to the group which admin has selected
    $scope.addGroup = function(selection,usersid) {

      $http.get('/api/v1/secure/admin/users/' + usersid).success(function(response) {
        $scope.users=response;            

        angular.forEach(selection, function(value, key) {

          // if groups already exists in users data,don't include groups in users data.
          var groupFound = $scope.users.group.reduce(function(previous, i){
            if (value === i) return true;
            return previous;
          }, false);
          if (groupFound){
              //alert('The selected user is already a part of this group.' + value);
            }
            //else add group to users data one by one
            else{
              $scope.users.group.push(value);
            }            
          });

        $http.put('/api/v1/secure/admin/users/' + usersid,$scope.users).success(function(response) {
          growl.info(parse("groups added successfully for email id [%s]",$scope.users.email));  
        })
      }) 
      $mdDialog.hide();
    };

  }]);


function Dialog($scope, $mdDialog,$http,usersid) {

  $scope.usersid = usersid;

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}
