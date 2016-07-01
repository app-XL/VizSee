'use strict';

var visitsApp = angular.module('visits');

//Autocompleate - Factory
visitsApp.factory('SessionDataService', ["$http", function ($http) {
  return {
    search: function (term) {
      //var client = {title: new RegExp(term, 'i')};
      var maxRecs = 10;
      var fields = ('title _id type');
      var sort = ({title:'ascending'});
      var type = "session";
      return $http({
        method: 'GET',
        url: '/api/v1/secure/feedbackDefs/find',
        params: { query: term, fields: fields, maxRecs: maxRecs, sort: sort, type: type }
      }).then(function (response) {
        return response.data;
      });
    }
  };
}]);

visitsApp.controller('sessionsControllerMain', ['$scope', '$http', '$routeParams', '$location', 'growl', '$filter', '$mdDialog','SessionService',
  function($scope, $http, $routeParams ,$location, growl, $filter, $mdDialog,SessionDataService) {

		$scope.visitId = $routeParams.id;

		$scope.small= "small";
		$scope.large= "LARGE";
		$scope.medium= "medium";
		//filter table
		$scope.showAll = true;
		$scope.showFiltered = false;
		$scope.hideFilter = true;
		$scope.meetingPlaces =[];
		$scope.submitOwnerSupporter = true;
		$scope.checkTimeVar = false;
		$scope.nameonly = "nameonly";
		$scope.meetingLocations =[];
		$scope.submitOwner = true;

		var init = function() {
			$http.get('/api/v1/secure/visits/' + $scope.visitId).success(function(response) {
				$scope.visit = response;
				$scope.visitStartDate = $scope.visit.startDate;
				$scope.visitEndDate = $scope.visit.endDate;
				$scope.scheduleDates = $scope.buildScheduleDates();
				$scope.session = $scope.visit.sessionTmpl.title;//session feedback default title
				$scope.sessionFeedbackDefaultId = $scope.visit.sessionTmpl._id;//session feedback default id
				for(var i=0;i<$scope.visit.schedule.length;i++)
				{
				$scope.meetingPlaces.push($scope.visit.schedule[i].meetingPlace);
				$scope.meetingPlacesData = $scope.meetingPlaces.toString();//pushing all meeting location data to meetingPlacesData
				}
				$scope.clientId = $scope.visit.client;
				if ($scope.clientId.logo!=undefined) {
		          $scope.showPrintAvatar = true
		          $scope.printAvatar= $scope.clientId.logo;
		        }
		        else $scope.showPrintAvatar = false;
			});

			$http.get("/api/v1/secure/visits/" + $scope.visitId + "/getLocations").success(function(response) {
				$scope.location = response;
				for(var i=0;i<$scope.location.length;i++){
					$scope.meetingLocations.push($scope.location[i]);
				}
			});
		}

		$http.get('/api/v1/secure/lov/sessionType').success(function(response) {
			 $scope.sessionType = response.values;
			// console.log($scope.prTypes);
		});


		var refresh = function(){
			$http.get('/api/v1/secure/visitSchedules/visit/' + $scope.visitId ).success(function(response) {
				$scope.scheduleList = response;
			}); // get visitSchedule call back ends
		}; // refresh method ends

		init();
		refresh();

	  $scope.sendMeetingPlace = function(meetingPlacesData)
	  {
	  $scope.sessionMeetingData = meetingPlacesData;
	  }

	  $scope.sendFeedbackId = function(sessionId)
	  {
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

		$scope.setEntryDate = function(dt,index){

				$scope.entryDate = dt;
				$scope.index = $scope.location[index];
				$scope.showFiltered = true;
				$scope.showAll = false;

				if($scope.index)
				{
	    			$scope.rooms =[];
	    			
				    $http.get('/api/v1/secure/meetingPlaces').success(function(response1)
				    { 
				    	$scope.roomsList = $filter('filter')(response1, {location: $scope.index.toLowerCase() });
				    	for(var i=0;i<$scope.roomsList.length;i++)
				    	{
				    		$scope.rooms.push($scope.roomsList[i].meetingPlace);
				    	}
				    });
				}
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
			$scope.schedule="";
			angular.element('#myModalShower').trigger('click');
	  }

	  $scope.addSchedule1 = function(ev){
	    $scope.mode = "add";
		$scope.schedule="";
		$scope.startHourTime =null;
		$scope.startMinTime =null;
		$scope.endHourTime =null;
		$scope.endMinTime =null;
		$scope.ownerId=null;
		$scope.supporterId=null;
	    $scope.showAdvanced(ev);
	  }

	  $scope.editSession = function(ev, id){

	    $scope.mode = "edit";
	    $http.get('/api/v1/secure/visitSchedules/' + id ).success(function(response) {
	      $scope.schedule = response;
				// reassign data
		console.log('edit session '+$scope.schedule.feedbackElg);
	      $scope.startTime = DateGetTime($scope.schedule.session.startTime);
	      $scope.endTime = DateGetTime($scope.schedule.session.endTime);
	      $scope.startHourTime = $scope.startTime.split(":")[0];
	      $scope.startMinTime = $scope.startTime.split(":")[1];
	      $scope.endHourTime = $scope.endTime.split(":")[0];
	      $scope.endMinTime = $scope.endTime.split(":")[1];
	      $scope.meetingPlaceData = $scope.schedule.session.location;
	      console.log($scope.schedule.session.type);
	      // if($scope.schedule.session.type == "Presentation" || $scope.schedule.session.type =="Discussion" || $scope.schedule.session.type =="Floor-Walk" || $scope.schedule.session.type =="Visit-Wrap-Up" || $scope.schedule.session.type.toLowerCase() == "presentation" || $scope.schedule.session.type.toLowerCase() =="discussion" || $scope.schedule.session.type.toLowerCase() =="floor-walk" || $scope.schedule.session.type.toLowerCase() == "visit-wrap-up")
		  if($scope.schedule.session.type)
		  {
	      $scope.sessiondfbid = $scope.schedule.feedbackTemplate;
	      $http.get('/api/v1/secure/feedbackDefs/id/' + $scope.sessiondfbid).success(function(response) {
	  	  $scope.sessiondata = response.title;
	      });
	  }

				$scope.ownerId = $scope.schedule.session.owner;
				$scope.supporterId = $scope.schedule.session.supporter;
				$scope.arraydata = $scope.schedule.invitees;
				if($scope.schedule.feedbackElg!=undefined)
				{
				$scope.collectlistData = $scope.schedule.feedbackElg;
				$scope.collectlist = $scope.collectlistData.split(',');
				}
		$scope.showAdvanced(ev);
	    }); // get visitSchedule call back ends
	  }

	$scope.checkTime = function()
	 {
	var start_time = $scope.startHourTime + $scope.startMinTime;
	var end_time = $scope.endHourTime + $scope.endMinTime;
	if ((start_time >= end_time || end_time <= start_time) && $scope.startHourTime!=null && $scope.startMinTime!=null && $scope.endHourTime!=null) {
		$scope.errMessage = "Wrong Time Entry Done !!!"
		$scope.checkTimeVar = true;
	}

	else
	{
		$scope.errMessage="";
		$scope.checkTimeVar = false;
	}

	$scope.startHourGreatTime = start_time;
	$scope.endHourGreatTime = end_time;
    };


	  $scope.save = function() {
	  	$scope.schedule.scheduleDate = $scope.entryDate;
	    $scope.schedule.visit = $scope.visit._id;
	    $scope.schedule.client = $scope.visit.client._id;
	    $scope.schedule.invitees = $scope.arraydata;
	    $scope.schedule.feedbackElg = $scope.collectlist;
	   // $scope.schedule.session.location = $scope.meetingPlacesData;
			//session invitees to be added

			// session info
		// console.log($scope.startHourTime);
		// console.log()
		$scope.schedule.session.owner = $scope.ownerId;
    	$scope.schedule.session.supporter = $scope.supporterId;
	    var startTime = $scope.startHourTime + ":" +$scope.startMinTime;
	    var endTime = $scope.endHourTime + ":" +$scope.endMinTime;
	    $scope.schedule.session.startTime = DateReplaceTime($scope.entryDate, startTime);
	    $scope.schedule.session.endTime = DateReplaceTime($scope.entryDate, endTime);
	    if($scope.mode == 'add')
	    {	
	  //   	if($scope.sessionMeetingData == '' || $scope.sessionMeetingData == undefined)
	  //   	{
	  //   	$scope.schedule.session.location = $scope.meetingPlacesData;
			// }
			if($scope.schedule.session.type)
		  	{
				if($scope.sessionFeedbackId == '' || $scope.sessionFeedbackId == undefined)
				{
					$scope.schedule.feedbackTemplate = $scope.sessionFeedbackDefaultId;
				}
			}
		}

		if($scope.mode == 'edit')
		{
	   		// if($scope.sessionMeetingData == '' || $scope.sessionMeetingData == undefined)
	   		// {
	   		// 	$scope.schedule.session.location = $scope.meetingPlaceData;
	   		// }
	   		if($scope.schedule.session.type)
		  	{
	   			if($scope.sessionFeedbackId == '' || $scope.sessionFeedbackId == undefined)
	   			{
	   				$scope.schedule.feedbackTemplate = $scope.sessiondfbid;
	   			}
	   		}
	   	}	

		// if($scope.sessionMeetingData != '' && $scope.sessionMeetingData != undefined)
		// {
		//  $scope.schedule.session.location = $scope.sessionMeetingData;
		// }

		if($scope.schedule.session.type)
		{		
			if($scope.sessionFeedbackId != '' && $scope.sessionFeedbackId != undefined)
			{
				$scope.schedule.feedbackTemplate = $scope.sessionFeedbackId;
			}
		}
		console.log($scope.schedule);
	    switch ($scope.mode) {
	      case "add":
	        $scope.create();
	        break;

	      case "edit":
	        $scope.update();
	        break;
	    } // end of switch scope.mode ends
	  } // end of save method


	  $scope.create = function() {
	    $http.post('/api/v1/secure/visitSchedules', $scope.schedule).success(function(response) {
	    console.log(response);
		    if($scope.schedule.session.title === "" || $scope.schedule.session.title === null || $scope.schedule.session.title === undefined )
			{
			growl.info(parse("New session schedule added"));
			}
			else
			{
				growl.info(parse("Title: [%s]<br/>New session schedule added", $scope.schedule.session.title));
			}

			$mdDialog.hide();
	    })

	    .error(function(data, status) {
	      growl.error("Error adding visitSchedule");
	    }); // http post visitSchedule ends
	  }; // create method ends

	  $scope.update = function() {
	  	$http.get('/api/v1/secure/visitSchedules/' + $scope.schedule._id).success(function(response)
	  	{	
	  		$scope.commentsData = [];
	  		console.log(response);
	  		$scope.comments = response.comments;
	  		console.log($scope.comments);
	  		if($scope.comments!=null)
	  		{	
	  			for(var i=0;i<$scope.comments.length;i++)
	  			{
	  				$scope.commentsData.push($scope.comments[i]._id);
	  			}
	  		$scope.schedule.comments = $scope.commentsData;
	  		}

	    $http.put('/api/v1/secure/visitSchedules/' + $scope.schedule._id, $scope.schedule).success(function(response) {
			if($scope.schedule.session.title === "" || $scope.schedule.session.title === null || $scope.schedule.session.title === undefined )
			{
				growl.info(parse("Session schedule updated successfully"));
			}
			else
			{
				growl.info(parse("Title: [%s]<br/>Session schedule updated successfully", $scope.schedule.session.title));
			}

           $mdDialog.hide();
			//refresh();
	    })
	    .error(function(data, status) {
	    	growl.error("Error updating visitSchedule");
	    }); // http put visitSchedule ends
	  	});
	  	
	  }; // update method ends


	  $scope.deleteSession = function(schedule) {
		$http.delete('/api/v1/secure/visitSchedules/' + schedule._id).success(function(response) {
			if(schedule.session.title === "" || schedule.session.title === null || schedule.session.title === undefined )
			{
				growl.info(parse("Session schedule deleted successfully"));
			}
			else
			{
				growl.info(parse("Title: [%s]<br/>Session schedule deleted successfully", schedule.session.title));
			}
	  refresh();
	})
	.error(function(data, status) {
	  growl.error("Error deleting visitSchedule");
	}); // http delete visitSchedule ends
	}; // delete method ends


	  // type field dropdown list
	  // $scope.prTypes = ['Presentation','Discussion','Breakfast','Tea-Break','Lunch','Dinner','Floor-Walk', 'Visit-Wrap-Up'];

	  // location field dropdown list
	  // $scope.locations = [{
	  //   "city" : "Hyderabad",
	  //   "rooms": ['Hyd Board Room','B7 1st Floor Conference Room','B4 Cafeteria',
	  //   'B4 Executive Dining Room','Hyd Amphi Theatre','Hyd Main Lobby']
	  // },
	  // {
	  //   "city" : "Noida",
	  //   "rooms": ['Noida Board Room','Noida Cafeteria','Noida Amphi Theatre','Noida Main Lobby']
	  // },
	  // {
	  //   "city" : "Chennai",
	  //   "rooms": ['Chennai Lobby Area','Chennai Ex Lunch','Chennai Amphi Theatre','Chennai Main Lobby']
	  // },
	  // {
	  //   "city" : "Bangalore",
	  //   "rooms": ['Bng Lobby Area','Bng Ex Lunch','Bng Amphi Theatre','Bng Main Lobby']
	  // }];


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

		$scope.printToCard = function(printSectionId) {
			$scope.innerContents = angular.element('#'+printSectionId).html();
			var popupWinindow = window.open('', '_blank', 'width=895,height=700,scrollbars=yes,menubar=yes,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<link rel="stylesheet" href="/public/assets/w/styles/dataview-table.css" /><link rel="stylesheet" href="/public/libs/bootstrap/dist/css/bootstrap.css"/><link rel="stylesheet" media="print" href="/public/assets/w/styles/print.css" type="text/css" /><link rel="stylesheet" href="/public/assets/w/styles/printCustom.css" /><body onload="window.print()">' + $scope.innerContents + '</body>');
            popupWinindow.document.close();
        }
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
          	if(autocompleteResults == undefined || autocompleteResults == ''){
              scope.sessionAuto=true;
              scope.sessionNotFound="Session Feedback Template not found!!!"
            }
            else
            {
            response($.map(autocompleteResults, function (autocompleteResult) {
              return {
                label: autocompleteResult.title,
                value: autocompleteResult.title,
                id: autocompleteResult._id
              }
            }))
        	}
          });
        },
        minLength: 4,
        select: function (event, selectedItem) {
          scope.sessiondata= selectedItem.item.value;
          scope.sessionId= selectedItem.item.id;
          scope.sessionAuto=false;
          scope.$apply();
          event.preventDefault();
        }
      });
    }
  };
}]);