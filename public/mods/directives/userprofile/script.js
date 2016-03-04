

angular.module('userprofileDirective', [])
.controller('userprofileDirectiveControllerMain', ['$scope', '$http', '$mdDialog', '$mdMedia','Upload','growl', function($scope, $http, $mdDialog, $mdMedia,Upload,growl) {

  if($scope.userModel === undefined || $scope.userModel === "")
    $scope.showFlag = "none";
  else
    $scope.showFlag = "user";

  getUser();

  function getUser() {

    //if both the email and id are given find the user by id only
    if($scope.userEmail || $scope.userId)   
    { 
      $http.get('/api/v1/secure/admin/users/' + $scope.userId).success(function(response) {
        $scope.userModel = response;
        $scope.showFlag = "user";
      })

      //if user email is not given then get user by id  
      if($scope.userId)
      {
        $http.get('/api/v1/secure/admin/users/' + $scope.userId).success(function(response) {
          $scope.userModel = response;
          $scope.showFlag = "user";
        })
        .error(function(response, status){
          $scope.showFlag = "noUser";
          if(status===404)
          {
            message = "User not found";
          }
          else
            console.log("error with user directive");
        }); 
      }

      //if user id is not given then get user by email
      if($scope.userEmail)
      {
        $http.get('/api/v1/secure/admin/users/email/' + $scope.userEmail).success(function(response) {
          $scope.userModel = response;
          $scope.showFlag = "user";
        })
        .error(function(response, status){
          $scope.showFlag = "noUser";
          if(status===404)
          {
            message = "User not found";
          }
          else
            console.log("error with user directive");
        }); 
      }
    }

    else
    {
      $scope.showFlag = "noUser";
        if(status===404)
        {
          message = "User not found";
        }
        else
        {  
        console.log("Error with the directive");
        }
    }  
}

  $scope.editprofile = function (user,id) {
    console.log(user);
    console.log(id);
    var userid = id;
    $http.put('/api/v1/secure/admin/users/'+ id, user).success(function(response) {
      
      growl.info(parse("Profile for user [%s]<br/>Edited successfully", userid));
    });
  };

  //edit the profile picture of user by taking dataurl and user id.
  $scope.editpicture = function (dataUrl,users) {
    console.log(users._id);
    Upload.upload({
      url: '/api/v1/upload/',
      data: {
        file: Upload.dataUrltoBlob(dataUrl),                
      },
    }).then(function (response) {
      console.log('update');
      $scope.result = response.data;
      users.avatar = '\\' + response.data.file.path;
      console.log(users.avatar);                
      $http.put('/api/v1/secure/admin/users/'+ users._id, users).success(function(response1) {
          $mdDialog.hide();
      });
     
    });

  };  

  $scope.status = '  '; 

  $scope.showButton = function(userModel,ev) {
    //console.log(userModel);
    $mdDialog.show({
      controller: DialogCtrl,
      templateUrl: '/public/mods/directives/userprofile/templates/user-dialog.html',
      locals: { userModel: userModel },
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true

    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });

  };

}])

.directive('userprofile', function() {
  return {
    controller: 'userprofileDirectiveControllerMain',
    templateUrl: '/public/mods/directives/userprofile/templates/user-profile.html',
    scope: {
      userModel: "=userModel",
      userId: "=userId",
      userEmail: "=userEmail",     
   }
  };
});

function DialogCtrl($scope, $mdDialog,userModel) {
  
  $scope.users = userModel;
  console.log($scope.users);
  console.log($scope.users._id);
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
