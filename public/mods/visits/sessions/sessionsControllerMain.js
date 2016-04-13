'use strict';

var visitsApp = angular.module('visits');

//Autocompleate - Factory
visitsApp.factory('SessionDataService', ["$http", function ($http) {
  return {
    search: function (term) {
      //var client = {title: new RegExp(term, 'i')};
      var maxRecs = 10;
      var fields = ('title _id');
      var sort = ({title:'ascending'});
      return $http({
        method: 'GET',
        url: '/api/v1/secure/feedbackDefs/find',
        params: { query: term, fields: fields, maxRecs: maxRecs, sort: sort }
      }).then(function (response) {
        return response.data;
      });
    }
  };
}]);

visitsApp.controller('sessionsControllerMain', ['$scope', '$http', '$routeParams', '$location', 'growl', '$filter', '$mdDialog','SessionService',
  function($scope, $http, $routeParams ,$location, growl, $filter, $mdDialog,SessionDataService) {

		console.log("session controller running");

		$scope.visitId = $routeParams.id;

		$scope.small= "small";
		$scope.large= "LARGE";
		$scope.medium= "medium";
		//filter table
		$scope.showAll = true;
		$scope.showFiltered = false;
		$scope.hideFilter = true;
		$scope.meetingPlaces =[];
		//	$scope.meetingPlacesData ='';
		// $scope.ownerId = "";
		// $scope.ownerEmail = "";
		// $scope.ownerUser = "";
		//
		// $scope.supporterId = "";
		// $scope.supporterEmail = "";
		// $scope.supporterUser = "";

		//$scope.mode = "add";

		var init = function() {
			console.log("init...")
			$http.get('/api/v1/secure/visits/' + $scope.visitId).success(function(response) {
				$scope.visit = response;
				$scope.visitStartDate = $scope.visit.startDate;
				$scope.visitEndDate = $scope.visit.endDate;
				$scope.scheduleDates = $scope.buildScheduleDates();
				//console.log($scope.scheduleDates);
				$scope.session = $scope.visit.sessionTmpl.title;//session feedback default title
				$scope.sessionFeedbackDefaultId = $scope.visit.sessionTmpl._id;//session feedback default id
				console.log($scope.visit);
				for(var i=0;i<$scope.visit.schedule.length;i++)
				{
				$scope.meetingPlaces.push($scope.visit.schedule[i].meetingPlace);
				$scope.meetingPlacesData = $scope.meetingPlaces.toString();//pushing all meeting location data to meetingPlacesData
				}
			});
			console.log("init complete");
		}

		var refresh = function(){
			console.log("refresh init");
			$http.get('/api/v1/secure/visitSchedules/visit/' + $scope.visitId ).success(function(response) {
				$scope.scheduleList = response;
				console.log($scope.scheduleList);
			}); // get visitSchedule call back ends
			console.log("refresh complete");
		}; // refresh method ends

		init();
		refresh();

	  $scope.sendMeetingPlace = function(meetingPlacesData)
	  {
	  //$scope.meetingPlacesData = '';
	  //console.log($scope.meetingPlacesData);
	  //console.log(meetingPlacesData);
	  $scope.sessionMeetingData = meetingPlacesData;
	  }

	  $scope.sendFeedbackId = function(sessionId)
	  {
	  //console.log(sessionId);
	  if($scope.mode =='add')
	  {
	  	if(sessionId != undefined || sessionId != '')
	  	{
	  		$scope.sessionFeedbackId = sessionId;
	  	}

	  	if(sessionId == '' || sessionId == undefined)
	  	{
	  		$scope.sessionFeedbackId = $scope.sessionFeedbackDefaultId;
	  	}
	  }

	  if($scope.mode =='edit')
	  { 
	  	$scope.sessionFeedbackId = sessionId;
	  }
	}

	  $scope.buildScheduleDates = function()
	  {
			return DatesInRange($scope.visitStartDate, $scope.visitEndDate);
	  }

	  	$scope.showAllSchedules = function(location)
	  	{	
	  		$http.get('/api/v1/secure/visitSchedules/visit/' + $scope.visitId ).success(function(response) {
	  			$scope.scheduleList = response;
	  		});
	  		$scope.showAll = true;
	  		$scope.showFiltered = false;
	  	}

		$scope.setEntryDate = function(dt){
			//console.log($scope.visitId)
			// if(dt==="all")
			// {	
			// 	//$scope.entryDate = "";
			// 	$http.get('/api/v1/secure/visitSchedules/visit/' + $scope.visitId ).success(function(response) {
			// 	$scope.scheduleList = response;
			// 	$scope.showAll = true;
			// 	$scope.showFiltered = false;				
			// });
			// }
			// else
			// {
				$scope.entryDate = dt;
				$scope.showFiltered = true;
				$scope.showAll = false;
			// }
		}

		$scope.dayFilter = function (schedule) {
			if($scope.entryDate === "")
				return true;

			var dt1 = moment.utc(schedule.scheduleDate);
			var dt2 = moment.utc($scope.entryDate);

			var duration = moment.duration(dt2.diff(dt1));
			var days = duration.asDays();

			return (days==0);

		};

		$scope.addSchedule = function(){
	    $scope.mode = "add";
	    console.log("Add new for::" + $scope.entryDate);
			$scope.schedule="";
			angular.element('#myModalShower').trigger('click');
	  }

	  $scope.addSchedule1 = function(ev){
	    $scope.mode = "add";
	    console.log("Entry for::" + $scope.entryDate);
			$scope.schedule="";
	    $scope.showAdvanced(ev);
	  }

	  $scope.editSession = function(ev, id){
	    $scope.mode = "edit";
	    $http.get('/api/v1/secure/visitSchedules/' + id ).success(function(response) {
	      console.log(response)	;
	      $scope.schedule = response;
				// reassign data
	      $scope.startTime = DateGetTime($scope.schedule.session.startTime);
	      $scope.endTime = DateGetTime($scope.schedule.session.endTime);
	      $scope.startHourTime = $scope.startTime.split(":")[0];
	      $scope.startMinTime = $scope.startTime.split(":")[1];
	      $scope.endHourTime = $scope.endTime.split(":")[0];
	      $scope.endMinTime = $scope.endTime.split(":")[1];
	      $scope.meetingPlaceData = $scope.schedule.session.location;
	      $scope.sessiondfbid = $scope.schedule.feedbackTemplate;
	      $http.get('/api/v1/secure/feedbackDefs/id/' + $scope.sessiondfbid).success(function(response) {
	  	  console.log(response);
	  	  $scope.sessiondata = response.title;
	      });

	      // $scope.session = $scope.schedule;
	      //$scope.startMinTime = $scope.hourStartTime[1];
	      //$scope.startEndTime =
				$scope.ownerId = $scope.schedule.session.owner;
				$scope.supporterId = $scope.schedule.session.supporter;
				$scope.arraydata = $scope.schedule.invitees;

				console.log($scope.ownerId);
				console.log($scope.supporterId);
				console.log("edit session...");
				console.log($scope.schedule);
	      $scope.showAdvanced(ev);
	    }); // get visitSchedule call back ends
	  }

	$scope.checkTime = function()
	 {
	var start_time = $scope.startHourTime + $scope.startMinTime;
	var end_time = $scope.endHourTime + $scope.endMinTime;

	if (start_time > end_time || end_time < start_time) {
		$scope.errMessage = "Wrong Time Entry Done !!!"
	}

	else
	{
		$scope.errMessage="";
	}
    };
		// $scope.editSession1 = function(id){
		// 	$scope.mode = "edit";
		// 	$http.get('/api/v1/secure/visitSchedules/' + id ).success(function(response) {
		// 		$scope.schedule = response;
		// 		$scope.schedule.startTime = new Date($scope.schedule.startTime);
		// 		$scope.schedule.endTime = new Date($scope.schedule.endTime);
		// 		angular.element('#myModalShower').trigger('click');
		// 	}); // get visitSchedule call back ends
		// }

	  $scope.deleteSession = function(schedule) {
	    $http.delete('/api/v1/secure/visitSchedules/' + schedule._id).success(function(response) {
	      growl.info(parse("Title: [%s]<br/>Session schedule deleted successfully", schedule.session.title));
	      refresh();
	    })
	    .error(function(data, status) {
	      growl.error("Error deleting visitSchedule");
	    }); // http delete visitSchedule ends
	  }; // delete method ends

	  $scope.save = function() {
		console.log("session save init for " + $scope.entryDate);
	    $scope.schedule.scheduleDate = $scope.entryDate;
	    $scope.schedule.visit = $scope.visit._id;
	    $scope.schedule.client = $scope.visit.client._id;
	    console.log($scope.arraydata);
	    $scope.schedule.invitees = $scope.arraydata;
	    console.log($scope.schedule.invitees);
	   // $scope.schedule.session.location = $scope.meetingPlacesData;
			//session invitees to be added

			// session info
			$scope.schedule.session.owner = $scope.ownerId;
	    $scope.schedule.session.supporter = $scope.supporterId;
	    var startTime = $scope.startHourTime + ":" +$scope.startMinTime;
	    var endTime = $scope.endHourTime + ":" +$scope.endMinTime;
	    $scope.schedule.session.startTime = DateReplaceTime($scope.entryDate, startTime);
	    $scope.schedule.session.endTime = DateReplaceTime($scope.entryDate, endTime);
	    //console.log($scope.data);
	   	if($scope.mode == 'add')
	   	{	
	    	if($scope.sessionMeetingData == '' || $scope.sessionMeetingData == undefined)
	    	{
	    	$scope.schedule.session.location = $scope.meetingPlacesData;
			}

			if($scope.sessionFeedbackId == '' || $scope.sessionFeedbackId == undefined)
			{
				$scope.schedule.feedbackTemplate = $scope.sessionFeedbackDefaultId;
			}
		}

		if($scope.mode == 'edit')
	   	{
	   		if($scope.sessionMeetingData == '' || $scope.sessionMeetingData == undefined)
	   		{
	   			$scope.schedule.session.location = $scope.meetingPlaceData;
	   		}

	   		if($scope.sessionFeedbackId == '' || $scope.sessionFeedbackId == undefined)
	   		{
	   			$scope.schedule.feedbackTemplate = $scope.sessiondfbid;
	   		}
	   	}	

		if($scope.sessionMeetingData != '' && $scope.sessionMeetingData != undefined)
		{
		 $scope.schedule.session.location = $scope.sessionMeetingData;
		}


		if($scope.sessionFeedbackId != '' && $scope.sessionFeedbackId != undefined)
		{
			$scope.schedule.feedbackTemplate = $scope.sessionFeedbackId;
		}

	    switch ($scope.mode) {
	      case "add":
	        $scope.create();
	        break;

	      case "edit":
	        $scope.update();
	        break;
	    } // end of switch scope.mode ends
			console.log("session save done")
	  } // end of save method

	  $scope.create = function() {
			console.log("Save new...");
			console.log($scope.schedule);
	    $http.post('/api/v1/secure/visitSchedules', $scope.schedule).success(function(response) {
				console.log("add complete");
	      growl.info(parse("Title: [%s]<br/>New session schedule added", $scope.schedule.session.title));
				$mdDialog.hide();
				//refresh();
				
	    })
	    .error(function(data, status) {
	      growl.error("Error adding visitSchedule");
	    }); // http post visitSchedule ends
	  }; // create method ends

	  $scope.update = function() {
			console.log("Save update...");
			console.log($scope.schedule);
	    $http.put('/api/v1/secure/visitSchedules/' + $scope.schedule._id, $scope.schedule).success(function(response) {
	      growl.info(parse("Title: [%s]<br/>Session schedule updated successfully", $scope.schedule.session.title));
	           $mdDialog.hide();
				//refresh();
	    })
	    .error(function(data, status) {
	    	growl.error("Error updating visitSchedule");
	    }); // http put visitSchedule ends
	  }; // update method ends

	  // type field dropdown list
	  $scope.prTypes = ['presentation','discussion','tea','lunch','dinner','floor-walk'];

	  // location field dropdown list
	  $scope.locations = [{
	    "city" : "Hyderabad",
	    "rooms": ['Hyd Board Room','B7 1st Floor Conference Room','B4 Cafeteria',
	    'B4 Executive Dining Room','Hyd Amphi Theatre','Hyd Main Lobby']
	  },
	  {
	    "city" : "Noida",
	    "rooms": ['Noida Board Room','Noida Cafeteria','Noida Amphi Theatre','Noida Main Lobby']
	  },
	  {
	    "city" : "Chennai",
	    "rooms": ['Chennai Lobby Area','Chennai Ex Lunch','Chennai Amphi Theatre','Chennai Main Lobby']
	  },
	  {
	    "city" : "Bangalore",
	    "rooms": ['Bng Lobby Area','Bng Ex Lunch','Bng Amphi Theatre','Bng Main Lobby']
	  }];


		$scope.showAdvanced = function(ev) {
			$mdDialog.show({
				templateUrl: '/public/mods/visits/sessions/sessionAddDialog0.html',
				parent: angular.element(document.body),
				scope:$scope.$new(),
				targetEvent: ev,
				clickOutsideToClose:false
			})
			.then(function(response) {
				refresh();
			});

		}

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

]);

//Autocompleate - Directive
visitsApp.directive("sessiondata", ["SessionDataService", function (SessionDataService) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          SessionDataService.search(searchTerm.term).then(function (autocompleteResults) {
            response($.map(autocompleteResults, function (autocompleteResult) {
              return {
                label: autocompleteResult.title,
                value: autocompleteResult.title,
                id: autocompleteResult._id
              }
            }))
          });
        },
        minLength: 4,
        select: function (event, selectedItem) {
          scope.sessiondata= selectedItem.item.value;
          scope.sessionId= selectedItem.item.id;
          scope.$apply();
          event.preventDefault();
        }
      });
    }
  };
}]);