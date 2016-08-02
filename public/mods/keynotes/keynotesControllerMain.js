'use strict';

var keynotesApp = angular.module('keynotes');

keynotesApp.controller('keynotesControllerMain', ['$scope', 'appUserService','$http','$rootScope', '$routeParams', '$location', 'growl',
  function($scope, appUserService, $http,$rootScope, $routeParams, $location, growl) {

    appUserService.activeUser().then(function(user){
    //console.log("thsis"+user._id);
    $scope.activeUser = user;

   // $scope.entity = "entity";
   // var self = this;
   // self.readonly = false;
   $scope.nameonly= "nameonly";
   $scope.tags=[];
   // var tag=$scope.tags;
   // console.log(tag);
   var id = $routeParams.id;
      // AUtomatically swap between the edit and new mode to reuse the same frontend form
      $scope.mode=(id==null? 'add': 'edit');
      $scope.hideFilter = true;

      // $scope.noteById = "";
      // $scope.noteByEmail = "";
      // $scope.noteByUser =  "";
      $scope.small= "small";
      $scope.large= "LARGE";
      $scope.medium= "medium";
      $scope.isSaving= false; 
      $scope.submitKeynotes = true;
      // $scope.keyTruedone=true;
      $scope.signatory1Submit = true;

        $scope.groupMember = $scope.activeUser.groups;
      if ($scope.activeUser.groups.indexOf("vManager") > -1 ) {
        $scope.isSaving= true; 
      }      
      // if ($rootScope.user.groups.indexOf("vManager") > -1 ) {
      //   $scope.isSaving= true; 
      // }
      var refresh = function() {
        $http.get('/api/v1/secure/keynotes').success(function(response) {

          $scope.keynotesList = response;
          $scope.keynotes = "";


          switch($scope.mode)    {
            case "add":
            $scope.keynotes = "";
            break;

            case "edit":
            $scope.keyTruedone=false;
            
            $scope.keynotes = $http.get('/api/v1/secure/keynotes/id/' + id).success(function(response){

              
              var keynotes = response;
              $scope.array.push(response.attachment);
              // reformat date fields to avoid type compability issues with <input type=date on ng-model
              $scope.keynotes.startDate = new Date($scope.keynotes.createdOn);
              $scope.keynotes = keynotes;

              if(response.noteBy !=null || response.noteBy !=undefined)
              {  
                $scope.noteByUser = response.noteBy;
                $scope.noteByEmail = response.noteBy.email;
                $scope.noteById = response.noteBy._id;
              }
              if(response.noteBy1 !=null || response.noteBy1 !=undefined)
              {
                $scope.noteByUser1 = response.noteBy1;
                $scope.noteByEmail1 = response.noteBy1.email;
                $scope.noteById1 = response.noteBy1._id;
              }
              if(response.noteBy2 !=null || response.noteBy2 !=undefined)
              {
                $scope.noteByUser2 = response.noteBy2;
                $scope.noteByEmail2 = response.noteBy2.email;
                $scope.noteById2 = response.noteBy2._id;
              }

            });

      } // switch scope.mode ends
    }); // get keynote call back ends
  }; // refresh method ends

  refresh();

  $scope.save = function(){
    // set noteBy based on the user picker value
    $scope.keynotes.noteBy = $scope.noteById;
    $scope.keynotes.noteBy1 = $scope.noteById1;
    $scope.keynotes.noteBy2 = $scope.noteById2;

    $scope.keynotes.attachment = $scope.array.toString();
    // console.log($scope.keynotes.noteBy);
    $scope.keynotes.createby = $rootScope.user._id;
    // $scope.keynotes.tags = tag;
    angular.forEach($scope.keynotes.tags, function(ofrngs){
     if($scope.keynotes.tags === undefined)
      $scope.keynotes.tags = ofrngs.tag1;
    else
      $scope.keynotes.tags = $scope.keynotes.tags+ ", " + ofrngs.tag1;

  });

    switch($scope.mode)    {
      case "add":
      $scope.create();
      break;

      case "edit":
      $scope.update();
      break;
      } // end of switch scope.mode ends

      $location.path("keynotes/list");
  } // end of save method

  $scope.create = function() {

    $http.post('/api/v1/secure/keynotes', $scope.keynotes).success(function(response) {
      console.log($scope.keynotes.title)
      refresh();
      growl.info(parse("Keynote [%s]<br/>Added successfully", $scope.keynotes.title));
    })
    .error(function(data, status){
      growl.error("Error adding keynote");
    }); // http post keynoges ends
  }; // create method ends

  $scope.delete = function(keynotes) {
    var title = keynotes.title;
    $http.delete('/api/v1/secure/keynotes/' + keynotes._id).success(function(response) {
      refresh();
      growl.info(parse("Keynotes [%s]<br/>Deleted successfully", title));
    })
    .error(function(data, status){
      growl.error("Error deleting keynote");
    }); // http delete keynoges ends
  }; // delete method ends

  $scope.copy = function(keynotes) {
    delete keynotes._id;
    var title = "Copy of " + keynotes.title;
    keynotes.title = title;
    $http.post('/api/v1/secure/keynotes/',keynotes).success(function(response) {
      refresh();
      growl.info(parse("Keynotes [%s]<br/>Copied successfully", title));
    })
    .error(function(data, status){
      growl.error("Error Copying keynote");
    });
  };

  $scope.update = function() {

    $http.put('/api/v1/secure/keynotes/id/' + $scope.keynotes._id, $scope.keynotes).success(function(response) {
      // refresh();
      growl.info(parse("Keynote [%s]<br/>Edited successfully", $scope.keynotes.title));
    })
    .error(function(data, status){
      growl.error("Error updating keynote");
    }); // http put keynoges ends

  }; // update method ends

  $scope.cancel = function() {

    $scope.keynotes="";
    $location.path("keynotes/list");
  }

  $scope.getUser = function(){
    console.log($scope.keynotes.speaker);
    console.log($scope.keynote.receiver);
    $http.get('/api/v1/secure/admin/users/' + $scope.keynotes.speaker).success(function(response) {
      console.log(response);
      var user = response;
      $scope.keynotes.speaker = parse("%s %s, <%s>", user.name.first, user.name.last, user.email);
    });/*
     $http.get('/api/v1/secure/admin/users/' + $scope.keynotes.receiver).success(function(response) {
      console.log(response);
      var user = response;
      $scope.keynotes.receiver = parse("%s %s, <%s>", user.name.first, user.name.last, user.email);
    });*/
}

$scope.removeImageItem = function(index){
  console.log($scope.array);
  $scope.array.splice(index, 1);
  console.log($scope.array);
};
// $scope.keyTrue=function(){
//   console.log("reached");
//   $scope.keyTruedone=false;
// }
});
}]);﻿ // controller ends
