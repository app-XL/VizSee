

angular.module('feedbackDirective', ['ngRateIt','ngAnimate', 'toaster'])

.controller('feedbackDirectiveControllerMain', ['$scope', '$http','$rootScope','$timeout','toaster', function($scope, $http, $rootScope,$timeout,toaster) {

  if($scope.feedbackModel === undefined || $scope.feedbackModel === "")
    $scope.showFlag = "none";
  else
    $scope.showFlag = "feedback";

  $scope.getFeedback = function(){
    if($scope.feedbackId===""){
      $scope.showFlag = "none";
      return;
    }

    $http.get('/api/v1/secure/feedbackDefs/id/' + $scope.feedbackId).success(function(response) {
      console.log(response);
      $scope.feedbackModel = response;
      $scope.showFlag = "feedback";
    })
    .error(function(response, status){
      $scope.showFlag = "noFeedback";
      if(status===404)
      {
        message = "Feedback not found";
      }
      else
        console.log("error with feedback directive");
    });
  }

var arrayContains = Array.prototype.indexOf ?
    function(arr, val) {
        return arr.indexOf(val) > -1;
    } :
    function(arr, val) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === val) {
                return true;
            }
        }
        return false;
    };

function arrayIntersection() {
    var val, arrayCount, firstArray, i, j, intersection = [], missing;
    var arrays = Array.prototype.slice.call(arguments); // Convert arguments into a real array

    // Search for common values
    firstArr = arrays.pop();
    if (firstArr) {
        j = firstArr.length;
        arrayCount = arrays.length;
        while (j--) {
            val = firstArr[j];
            missing = false;

            // Check val is present in each remaining array
            i = arrayCount;
            while (!missing && i--) {
                if ( !arrayContains(arrays[i], val) ) {
                    missing = true;
                }
            }
            if (!missing) {
                intersection.push(val);
            }
        }
    }
    return intersection;
}

 function deleteData() {
    delete $scope.feedbackModel._id;
    delete $scope.feedbackModel.createBy;
    delete $scope.feedbackModel.title;
    delete $scope.feedbackModel.createOn;
 }

  $scope.submit = function() {
    
    deleteData();
    providedById = $rootScope.user._id;
    $scope.feedbackModel.visitid = $scope.visitId;
    $scope.feedbackModel.template = $scope.feedbackId;
    $scope.feedbackModel.providedBy = providedById;
    $scope.feedbackModel.feedbackOn = $scope.feedbackModel.type;
    $scope.feedbackModel.sessionid = $scope.sessionId;

    $http.post('/api/v1/secure/feedbacks/', $scope.feedbackModel).success(function(response) {
    })

    showSuccessMessage();
  };

  $scope.selection = [];
  // toggle selection for a given choice by name
  $scope.toggleSelection = function toggleSelection(choice,index) {
    console.log(index);

    var idx = $scope.selection.indexOf(choice);
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.selection.push(choice);
      }

      var answerChoice = arrayIntersection( $scope.feedbackModel.item[index].choices.toString().split(","),$scope.selection.toString().split(","));
      $scope.feedbackModel.item[index].answer = answerChoice.toString();
    };

function showSuccessMessage()
{
  toaster.pop({title: "Thank You Note", body:"Thank you for your valuable feedback."});
}
}])

.directive('feedback', function() {
  return {
    controller: 'feedbackDirectiveControllerMain',
    templateUrl: '/public/d/feedbackDirective/templates/feedbackPage.html',
    scope: {
      feedbackModel: "=feedbackModel",
      feedbackId: "=feedbackId",
      visitId: "=visitId",
      sessionId: "=sessionId"
    },

};
});