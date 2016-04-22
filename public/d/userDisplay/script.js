

angular.module('userdisplayDirective', [])
.controller('userdisplayDirectiveControllerMain', ['$scope', '$http', function($scope, $http) {

  if($scope.userModel === undefined || $scope.userModel === "")
    $scope.showFlag = "none";
  else
    $scope.showFlag = "user";

  $scope.getUser = function(){
    if($scope.userId==="" || $scope.userId=== undefined){
      $scope.showFlag = "noUser";
      }
    else{
      $http.get('/api/v1/secure/admin/users/' + $scope.userId).success(function(response) {
        $scope.userModel = response;
        $scope.userId = response._id;
        $scope.showFlag = "user";
      })
      .error(function(response, status){
        $scope.showFlag = "error";
        if(status===500)
        {
          $scope.message = "Error!";

        }
      });
    }
    if($scope.showFlag === "noUser")
    {
      $scope.message = "User not found";
      if($scope.noUserMsg !== undefined){
        $scope.message = $scope.noUserMsg;
      }
    }

  }

}])

.directive('userdisplay', function() {
  return {
    controller: 'userdisplayDirectiveControllerMain',
    templateUrl: '/public/d/userDisplay/templates/userdisplay.html',
    scope: {
      userId: "=userId",
      viewMode: "=viewMode",
      noUserMsg: "@noUserMsg"
      
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
