

angular.module('userdisplayDirective', [])
.controller('userdisplayDirectiveControllerMain', ['$scope', '$http', function($scope, $http) {

  if($scope.userModel === undefined || $scope.userModel === "")
    $scope.showFlag = "none";
  else
    $scope.showFlag = "user";

  $scope.getUser = function(){
    if($scope.userId===""){
      $scope.showFlag = "none";
      return;
    }

    $http.get('/api/v1/secure/admin/users/' + $scope.userId).success(function(response) {
      $scope.userModel = response;
      $scope.userId = response._id;
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

}])

.directive('userdisplay', function() {
  return {
    controller: 'userdisplayDirectiveControllerMain',
    templateUrl: '/public/d/userDisplay/templates/userdisplay.html',
    scope: {
      userId: "=userId",
      viewMode: "=viewMode"
    },
    transclude: true,

    link : function(scope,element,attrs)
    {
      scope.getTemplate = function(){

      var viewmode = scope.viewMode.toLowerCase();

      if(viewmode === "nameonly"){
        return "/public/d/userDisplay/templates/nameOnlyPanel.html";
      }

      if(viewmode === "summaryonly"){
        return "/public/d/userDisplay/templates/summaryOnlyPanel.html";
      }

      if(viewmode === "bulletsmallonly"){
        return "/public/d/userDisplay/templates/bulletSmallOnlyPanel.html";
      }

      if(viewmode === "bulletmediumonly"){
        return "/public/d/userDisplay/templates/bulletMediumOnlyPanel.html";
      }

      if(viewmode === "emailonly"){
        return "/public/d/userDisplay/templates/emailOnlyPanel.html";
      }

      if(viewmode === "small")
      {
        return "/public/d/userDisplay/templates/smallpanel.html";
      }

      if(viewmode === "large")
      {
        return "/public/d/userDisplay/templates/largepanel.html";
      }

      if(viewmode === "medium")
      {
        return "/public/d/userDisplay/templates/mediumpanel.html";
      }
    }
  }
};
});
