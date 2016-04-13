

angular.module('inviteesDirective', [])
.controller('inviteesDirectiveControllerMain', ['$scope', '$http', function($scope, $http) {

  console.log($scope.switchMode);
  
  $scope.small= "small";
  $scope.large= "LARGE";
  $scope.medium= "medium";
  $scope.array = [];
  $scope.arraydata=[];
  
  var j=[];

  $scope.addInvitees=function(invite){
    console.log("12"+invite);
//email there r not
$http.get('/api/v1/secure/admin/users/email/' + invite).success(function(response) {
 if($scope.userType ==response.association)
 { 
   $scope.userId = response._id;

   $scope.array.push({
    invite: $scope.userId,
  });

$scope.checked = false;
console.log("length"+$scope.array.length);
for (var i =0 ;i<$scope.array.length;  i++) {
 j =$scope.array[i].invite; 

};

$scope.arraydata.push(j);
console.log($scope.arraydata);

 }

  else {
    $scope.checked = true;
  $scope.message = "not an organization employee";
}

 })



.error(function(response, status){
  if(status===404)
  {
    $scope.message = "User not found";
  }
  else
    console.log("error with user directive");
});
//email there r not
$scope.invite='';
  };//end of addInvitees

  $scope.removeInvitees = function(index){
    console.log(index);
    $scope.array.splice(index, 1);
  };

  $scope.removeInviteesdata = function(index){
    console.log(index);
    $scope.arraydata.splice(index, 1);
  };

}])

.directive('invitees', function() {
  return {
    controller: 'inviteesDirectiveControllerMain',
    templateUrl: '/public/d/invitees/templates/invitee.html',
    scope: {
      // array: "=array",
      arraydata: "=arraydata",
      switchMode: "=switchMode",
      userType: "@userType"
    },

    link : function(scope,element,attrs)
    {
      scope.getTemplate = function(){

        var viewmode = scope.viewType;//.toLowerCase();

        if(viewmode === "small" && scope.userEmail!="")
        {
          return "/public/d/invitees/templates/smallpanel.html";
        }

      }
    }


  };
});
