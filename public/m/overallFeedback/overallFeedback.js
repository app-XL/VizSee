var feedback=angular.module('overallFeedback', ['ngRoute'])
feedback.config(['$routeProvider', function ($routeProvider) {
  $routeProvider

 .when('/feedback', {
    templateUrl: '/public/m/overallFeedback/overallFeedback.html',
    controller: 'overallFeedbackCtrl'
})

}])
   feedback.controller('overallFeedbackCtrl', function($scope, $timeout, $interval, $location, $routeParams,$http,$rootScope) {
    $scope.order = 0;
    $scope.showSaveNext = true;
    $scope.form_id = "form-" +  $scope.order;
    //$scope.feedbackModel = '';
    $http.get('/api/v1/secure/visits/all/activeVisit').success(function(response) {
                // console.log(response.visits.feedbackTmpl);
                $scope.overallFeedbackTmpl = response.visits.feedbackTmpl;
                $scope.visitId = response.visits._id;
                $http.get('/api/v1/secure/feedbackDefs/id/'+ $scope.overallFeedbackTmpl).success(function(response) {
                    $scope.items = response.item;
                    $scope.length = response.item.length - 1;
                    $scope.feedbackModel = response;
                });
    });

    $scope.orderIncrement = function()
    {   

        $scope.order = $scope.order + 1;
        // console.log($scope.order,$scope.length);
        if($scope.order == $scope.length)
        {
            $scope.showSaveNext = false;
            // $scope.order = 0;
        }

        if($scope.order < $scope.length)
        {
            $scope.showSaveNext = true;
        }
    }

    $scope.orderDecrement = function()
    {   
        if($scope.order == 0)
        {
            $scope.order =0;
            // $scope.order = 0;
        }
        else
        {
        $scope.order = $scope.order - 1;
        $scope.showSaveNext = true;
        }
        // if($scope.order < $scope.length)
        // {
        //     $scope.showSaveNext = true;
        // }
    }

        var form_div = angular.element('.form-div');
        var max_forms = form_div.length;

        $interval(function() {
            if (angular.element('.form-div').first().hasClass('active')) {
                angular.element('.prev-button').addClass('disabled');
            } else {
                angular.element('.prev-button').removeClass('disabled');
            }
            if (angular.element('.form-div').last().hasClass('active')) {
                angular.element('.save-exit-button').show();
                angular.element('.save-next-button').hide();
            } else {
                angular.element('.save-exit-button').hide();
                angular.element('.save-next-button').show();
            }
        }, 1);

        $scope.progress_percentage = 100 / max_forms;
        angular.element('.progress-bar').css('width', $scope.progress_percentage + "%");
        var count = 1;

        var device_width,
            corousel_inner_width,
            minusWidth;

        changeWidth();

        $(window).resize(function() {
            changeWidth();
        });

        function changeWidth() {
            device_width = angular.element(document).width();
            minusWidth = "-" + device_width;
            corousel_inner_width = device_width * max_forms;
            angular.element('.corousel-inner').css('width', corousel_inner_width + "px");
            form_div.css('width', device_width - 20 + "px");
        }

        function deleteData() {
            delete $scope.feedbackModel._id;
            delete $scope.feedbackModel.createBy;
            delete $scope.feedbackModel.title;
            delete $scope.feedbackModel.createOn;
        }

        $scope.next = function() {
            deleteData();
            var providedById = $rootScope.user._id;
            $scope.feedbackModel.visitid = $scope.visitId;
            $scope.feedbackModel.template = $scope.overallFeedbackTmpl;
            $scope.feedbackModel.providedBy = providedById;
            $scope.feedbackModel.feedbackOn = $scope.feedbackModel.type;
            $scope.feedbackModel.item[$scope.order].answer = $scope.items[$scope.order].answer;
            // console.log($scope.feedbackModel);
            
            $http.put('/api/v1/secure/feedbacks/'+ $scope.overallFeedbackTmpl , $scope.feedbackModel).success(function(response) {
              // console.log(response);
            })    

            $scope.orderIncrement();

            // if (!(angular.element('.form-div').last().hasClass('active'))) {
            //     var cur_active = angular.element('.form-div.active');
            //     count++;
            //     cur_active.next().addClass('active');
            //     angular.element(".corousel-inner").css("transform", "translateX(" + (count - 1) * minusWidth + "px)");
            //     cur_active.removeClass('active');
            //     angular.element('.progress-bar').css('width', count * $scope.progress_percentage + "%");
            // }
        };

        $scope.prev = function() {
            if (!(angular.element('.form-div').first().hasClass('active'))) {
                var cur_active = angular.element('.form-div.active');
                count--;
                cur_active.prev().addClass('active');
                cur_active.removeClass('active');
                angular.element('.progress-bar').css('width', $scope.progress_percentage * count + "%");
                angular.element(".corousel-inner").css("transform", "translateX(" + (count - 1) * minusWidth + "px)");
            }
        };

        $scope.submitAndExitForm = function() {
            var providedById = $rootScope.user._id;
            $scope.feedbackModel.visitid = $scope.visitId;
            $scope.feedbackModel.template = $scope.overallFeedbackTmpl;
            $scope.feedbackModel.providedBy = providedById;
            $scope.feedbackModel.feedbackOn = $scope.feedbackModel.type;
            $scope.feedbackModel.item[$scope.order].answer = $scope.items[$scope.order].answer;
            console.log($scope.feedbackModel);
            
            $http.post('/api/v1/secure/feedbacks/', $scope.feedbackModel).success(function(response) {
              // console.log(response);
            })
            $location.path('/thankyou');
             
        };

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

         $scope.selection = [];
         // toggle selection for a given choice by name
         $scope.toggleSelection = function toggleSelection(choice,index) {
            // console.log(index);

            var idx = $scope.selection.indexOf(choice);
            // is currently selected
              if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }

            // is newly selected
            else {
                $scope.selection.push(choice);
            }

            var answerChoice = arrayIntersection($scope.feedbackModel.item[index].choices.toString().split(","),$scope.selection.toString().split(","));
            // console.log(answerChoice.toString());
            $scope.feedbackModel.item[index].answer = answerChoice.toString();
      };

    });
