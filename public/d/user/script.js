

angular.module('userDirective', [])
.controller('userDirectiveControllerMain', ['$scope', '$http', function($scope, $http) {

  // console.log($scope.switchMode);
  // console.log($scope.userType);

  if($scope.userModel === undefined || $scope.userModel === "")
    $scope.showFlag = "none";
  else
    $scope.showFlag = "user";

  $scope.getUser = function(){
    var url= "";
    if($scope.userId!="" && $scope.userId!=undefined){
      // $scope.showFlag = "none";
      // return;
      url='/api/v1/secure/admin/users/' + $scope.userId;
    }
    
    if ($scope.userEmail!="" && $scope.userEmail!=undefined) {
      url='/api/v1/secure/admin/users/email/' + $scope.userEmail;
    }
    // else{
    //     message = "Invalid User Id/email";
    //     return;
    // }

    $http.get(url).success(function(response) {

    if($scope.userType == response.association){
      $scope.userModel = response;
      $scope.userId = response._id;
      $scope.userEmail = response.email;
      $scope.showFlag = "user";
    }

    else{
      $scope.showFlag = "noUser";
      message = "User not found";
    }

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
  } // end of getUser method
  
  if($scope.switchMode == 'edit')
  {  
   if($scope.userId)
   { 
	 $scope.getUser(); // autoload data
   }
   $scope.showFlag = "user";
  }

  //ToDo: User Picker not working with inline editing.
}])

.directive('user', function() {
  return {
    controller: 'userDirectiveControllerMain',
    templateUrl: '/public/d/user/templates/user-picker.html',
    scope: {
      userModel: "=userModel",
      userId: "=userId",
      userEmail: "=userEmail",
      viewType: "=viewType",
      switchMode: "=switchMode",
      userType: "@userType"
    },

    link : function(scope,element,attrs)
    {
      scope.getTemplate = function(){

      var viewmode = scope.viewType.toLowerCase();

       if(viewmode === "small" && scope.userEmail!="")
       {
        return "/public/d/user/templates/smallpanel.html";
      }
      if(viewmode === "large"){
        return "/public/d/user/templates/largepanel.html";
      }
      if(viewmode === "medium"){
        return "/public/d/user/templates/mediumpanel.html";
      }

    }
  }


};
});
