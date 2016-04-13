var feedback=angular.module('overallFeedback', ['ngRoute'])
feedback.config(['$routeProvider', function ($routeProvider) {
  $routeProvider

 .when('/feedback', {
    templateUrl: '/public/m/overallFeedback/overallFeedback.html',
    controller: 'overallFeedbackCtrl'
})

}])
   feedback.controller('overallFeedbackCtrl', function($scope, $timeout, $interval, $location) {

  

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

        $scope.next = function() {
            if (!(angular.element('.form-div').last().hasClass('active'))) {
                var cur_active = angular.element('.form-div.active');
                count++;
                cur_active.next().addClass('active');
                angular.element(".corousel-inner").css("transform", "translateX(" + (count - 1) * minusWidth + "px)");
                cur_active.removeClass('active');
                angular.element('.progress-bar').css('width', count * $scope.progress_percentage + "%");
            }
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
            $location.path('/thankyou');
             
        };
    });
