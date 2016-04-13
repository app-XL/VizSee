

angular.module('feedbackDirective', ['ngRateIt','ngAnimate', 'toaster'])

.controller('feedbackDirectiveControllerMain', ['$scope', '$http','$rootScope','$timeout','toaster', function($scope, $http, $rootScope,$timeout,toaster) {

  // console.log($scope.feedbackId);
  // console.log($scope.visitId);
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

// function longestCommonSubstring(str1, str2){
//   if (!str1 || !str2)
//     return {
//       length: 0,
//       sequence: "",
//       offset: 0
//     };

//   var sequence = "",
//     str1Length = str1.length,
//     str2Length = str2.length,
//     num = new Array(str1Length),
//     maxlen = 0,
//     lastSubsBegin = 0;

//   for (var i = 0; i < str1Length; i++) {
//     var subArray = new Array(str2Length);
//     for (var j = 0; j < str2Length; j++)
//       subArray[j] = 0;
//     num[i] = subArray;
//   }
//   var thisSubsBegin = null;
//   for (var i = 0; i < str1Length; i++)
//   {
//     for (var j = 0; j < str2Length; j++)
//     {
//       if (str1[i] !== str2[j])
//         num[i][j] = 0;
//       else
//       {
//         if ((i === 0) || (j === 0))
//           num[i][j] = 1;
//         else
//           num[i][j] = 1 + num[i - 1][j - 1];

//         if (num[i][j] > maxlen)
//         {
//           maxlen = num[i][j];
//           thisSubsBegin = i - num[i][j] + 1;
//           if (lastSubsBegin === thisSubsBegin)
//           {//if the current LCS is the same as the last time this block ran
//             sequence += str1[i];
//           }
//           else //this block resets the string builder if a different LCS is found
//           {
//             lastSubsBegin = thisSubsBegin;
//             sequence= ""; //clear it
//             sequence += str1.substr(lastSubsBegin, (i + 1) - lastSubsBegin);
//           }
//         }
//       }
//     }
//   }
//   return {
//     length: maxlen,
//     sequence: sequence,
//     offset: thisSubsBegin
//   };
// }

// function reverseString(str) {
//     return str.split('').reverse().join('');
// }

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

    delete $scope.feedbackModel.type;
    console.log($scope.feedbackModel);
    $http.post('/api/v1/secure/feedbacks/', $scope.feedbackModel).success(function(response) {
      console.log(response);
    })

    var myEl = angular.element(document.getElementsByClassName('feedback-form'));
    myEl.css('display', 'none');
    var myEl2 = angular.element(document.getElementsByClassName('submit-success-text'));
    myEl2.css('display', 'block');
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
      //var multiAnswerChoice = longestCommonSubstring($scope.feedbackModel.item[index].choices.toString(),$scope.selection.toString());
      //console.log(multiAnswerChoice.sequence);
      console.log(answerChoice.toString());
      $scope.feedbackModel.item[index].answer = answerChoice.toString();
    };

function showSuccessMessage()
{
  toaster.info({title: "Thank You Note", body:"Thank you for your valuable feedback."});
}

}])

.directive('feedback', function() {
  return {
    controller: 'feedbackDirectiveControllerMain',
    templateUrl: '/public/d/feedbackDirective/templates/feedbackPage.html',
    scope: {
      feedbackModel: "=feedbackModel",
      feedbackId: "=feedbackId",
      visitId: "=visitId"
    },

};
});