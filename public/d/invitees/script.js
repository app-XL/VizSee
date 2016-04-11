

angular.module('inviteesDirective', [])
.controller('inviteesDirectiveControllerMain', ['$scope', '$http', function($scope, $http) {

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

// Visit invitees table
$scope.small= "small";
$scope.large= "LARGE";
$scope.medium= "medium";

$scope.addInvitees=function(specialInvite){
  console.log(specialInvite.inviteId);
  $scope.inviteesData.push({
    invite: specialInvite.inviteId
  });

  specialInvite.inviteId='';
  specialInvite.inviteUser='';
  specialInvite.inviteEmail='';
};

$scope.removeInvitees = function(index){
  $scope.inviteesData.splice(index, 1);
};

$scope.editInvitees = function(index,specialInvite){
  $scope.specialInvite= specialInvite;
  $scope.inviteesData.splice(index, 1);
};
// Visit specialInvite table end

}])

.directive('invitees', function() {
  return {
    controller: 'userDirectiveControllerMain',
    templateUrl: '/public/d/invitees/templates/user-picker.html',
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
          return "/public/d/invitees/templates/smallpanel.html";
        }
        if(viewmode === "large"){
          return "/public/d/invitees/templates/largepanel.html";
        }
        if(viewmode === "medium"){
          return "/public/d/invitees/templates/mediumpanel.html";
        }

      }
    }


  };
});
