'use strict';

var visitsApp = angular.module('visits');

//Autocompleate - Factory
visitsApp.factory('AutoCompleteService', ["$http", function ($http) {
  return {
    search: function (term) {
      //var client = {name: new RegExp(term, 'i')};
      var maxRecs = 10;
      var fields = ('name _id');
      var sort = ({name:'ascending'});
      return $http({
        method: 'GET',
        url: '/api/v1/secure/clients/find',
        params: { query: term, fields: fields, maxRecs: maxRecs, sort: sort }
      }).then(function (response) {
        return response.data;
      });
    }
  };
}]);
//Autocompleate - Factory
visitsApp.factory('FeedbackService', ["$http", function ($http) {
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
//Autocompleate - Factory
visitsApp.factory('SessionService', ["$http", function ($http) {
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
//Autocompleate - Factory
visitsApp.factory('KeynoteService', ["$http", function ($http) {
  return {
    search: function (term) {
      //var client = {title: new RegExp(term, 'i')};
      var maxRecs = 10;
      var fields = ('title _id');
      var sort = ({title:'ascending'});
      return $http({
        method: 'GET',
        url: '/api/v1/secure/keynotes/find',
        params: { query: term, fields: fields, maxRecs: maxRecs, sort: sort }
      }).then(function (response) {
        return response.data;
      });
    }
  };
}]);

visitsApp.controller('visitsControllerMain', ['$scope', '$http', '$routeParams','$rootScope', '$location', 'growl', '$window','$mdDialog', '$mdMedia', '$timeout','Upload', 'AutoCompleteService', 'FeedbackService', 'KeynoteService' , '$filter',
  function($scope, $http, $routeParams, $rootScope, $location, growl, $window ,$mdDialog , $mdMedia ,$timeout, Upload, AutoCompleteService, FeedbackService, SessionService, KeynoteService, $filter) {

    var id = $routeParams.id;

  // AUtomatically swap between the edit and new mode to reuse the same frontend form
  $scope.mode=(id==null? 'add': 'edit');
  $scope.hideFilter = true;
  $scope.checked = false;
  $scope.schedules=[];
  $scope.visitors=[];
  $scope.keynotes=[];
  $scope.small= "small";
  $scope.large= "LARGE";
  $scope.medium= "medium";
  $scope.clientnameonly= "clientnameonly";
  $scope.nameonly= "nameonly";
  $scope.visitid = id;
  $scope.showAvatar = false;
  $scope.arraydata = [];
  $scope.tab=false;
  $scope.anchor='';
  $scope.secondaryVmanager='';
  
  $scope.visitGrid=false;

  $scope.agendaTab=true;
  $scope.visitorsTab=false;
  $scope.finalizeTab=false;
  $scope.notifyTab=false;
  // $scope.errMessage = '';

  var user= $rootScope.user._id; 
  var group = $rootScope.user.memberOf;

  if ($rootScope.user.groups.indexOf("vManager") > -1) {
    $scope.visitGrid= true;
  }

  //visit manager group- HTTP get for drop-down
  $http.get('/api/v1/secure/admin/groups/vManager/users').success(function(response) {
    $scope.data=response;
  });

  //Location - Http get for drop-down
  $http.get('/api/v1/secure/lov/locations').success(function(response) {
    $scope.location=response.values;
  });

  //Influence - Http get for drop-down
  $http.get('/api/v1/secure/lov/influence').success(function(response) {
    $scope.influence=response.values;
  });

  $scope.visitorId = "";
  $scope.visitor = "";
  $scope.visitorUser =  "";

  $scope.agmId = "";
  $scope.agmEmail = "";
  $scope.agmUser =  "";

  var refresh = function() {

    $scope.setTimeline = function(time){
      $scope.timeline = time;
      console.log("setting timeline to " + $scope.timeline )
      $scope.visitBatch = $scope.allVisits[$scope.timeline];
    }
    
    $http.get('/api/v1/secure/visits/all/my').success(function(response) {
      $scope.allVisits = response;
      console.log("after delete :"+$scope.allVisits)
      if($scope.timeline=="" || $scope.timeline===undefined){
        $scope.timeline = "this-week";
        console.log("no timeline. Set to " + $scope.timeline);
        $scope.visitBatch = $scope.allVisits[$scope.timeline];
      }
      else{
       $scope.timeline = "this-week";
       console.log("no timeline. Set to " + $scope.timeline);
       $scope.visitBatch = $scope.allVisits[$scope.timeline];
     }
     console.log(JSON.stringify($scope.visitBatch,null,2));

     $scope.visits = "";
     $scope.schedules=[];
     $scope.visitors=[];
     $scope.keynotes=[];



     switch($scope.mode)    {
      case "add":
      $scope.visits = "";
      break;

      case "edit":
      $scope.visits = $http.get('/api/v1/secure/visits/' + id).success(function(response){
        var visits = response;
        if (visits.anchor!=undefined||visits.secondaryVmanager!=undefined) {
          $scope.anchor = visits.anchor._id;
          $scope.secondaryVmanager = visits.secondaryVmanager._id;
        };
        
        switch(visits.status){
          case "confirm": 
          $scope.agendaTab=true;
          $scope.visitorsTab=true;
          break;

          case "tentative": 
          $scope.agendaTab=true;
          $scope.visitorsTab=true;
          break;

          case "wip":
          if ($rootScope.user.groups.indexOf("vManager") > -1) {
            $scope.finalizeTab= true;
            $scope.agendaTab=true;
            $scope.visitorsTab=true;
            $scope.notifyTab=false;
          }
          else{
           $scope.agendaTab= true;
           $scope.visitorsTab= true;
           $scope.finalizeTab= false;
           $scope.notifyTab= false;
         }
         break;

         case "finalize": 
         if ($rootScope.user.groups.indexOf("vManager") > -1) {
          $scope.finalizeTab= true;
          $scope.agendaTab=true;
          $scope.visitorsTab=true;
          $scope.notifyTab=true;
        }
        else{
         $scope.agendaTab= true;
         $scope.visitorsTab= true;
         $scope.finalizeTab= false;
         $scope.notifyTab= false;
       }
       break;

       case "close": 
       if ($rootScope.user.groups.indexOf("vManager") > -1) {
        $scope.finalizeTab= true;
        $scope.agendaTab=true;
        $scope.visitorsTab=true;
        $scope.notifyTab=true;
      }
      else{
       $scope.agendaTab= true;
       $scope.visitorsTab= true;
       $scope.finalizeTab= false;
       $scope.notifyTab= false;
     }
     break;

   };

          $scope.schedules = visits.schedule;       //List of schedules
          $scope.keynotes = visits.keynote;
          $scope.visitors = visits.visitors;      //List of visitors
          $scope.visits = visits;     //Whole form object

          $scope.arraydata=response.invitees;

          $scope.agmUser = response.agm;
          $scope.agmEmail = response.agm.email;
          $scope.agmId = response.agm._id;

          $scope.clientName= response.client.name;//auto fill with reff client db
          $scope.feedback= response.feedbackTmpl.title;//auto fill with reff feedback db
          $scope.session= response.sessionTmpl.title;//auto fill with reff feedback db
          
          // $scope.anchorEmail = response.anchor.email;
          // $scope.anchorId = response.anchor._id;

            // Reformat date fields to avoid type compability issues with <input type=date on ng-model
            $scope.visits.createdOn = new Date($scope.visits.createdOn);
          });

      } // Switch scope.mode ends
    }); // Get visit call back ends
  }; // Refresh method ends

  refresh();

  $scope.save = function(){
    // Set agm based on the user picker value
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.agm = $scope.agmId;
    $scope.visits.status =$scope.status;
    $scope.visits.createBy= $rootScope.user._id;
    $scope.visits.client = $scope.clientId;
    $scope.visits.invitees = $scope.arraydata;
    console.log($scope.visits);
    
    if ($scope.checked == false){
      $scope.unbillable= "non-billable";
      if($scope.visits.wbsCode!=null){$scope.visits.wbsCode= null;}
      $scope.visits.billable=$scope.unbillable;}//check code
      else{
        $scope.billable= "billable";
        if($scope.visits.chargeCode!=null){$scope.visits.chargeCode= null;}
        $scope.visits.billable=$scope.billable;}//WBS code

        $scope.visits.feedbackTmpl = $scope.feedbackId;
        $scope.visits.sessionTmpl = $scope.sessionId;
        switch($scope.mode)    {
          case "add":
          $scope.create();
          break;

          case "edit":
          $scope.update();
          break;
      } // End of switch scope.mode ends
       $location.path("visits/list"); 
     // window.history.back();
  } // End of save method

  $scope.create = function() {

    var inData       = $scope.visits;
    inData.schedule = $scope.schedules;
    inData.keynote = $scope.keynotes;
    inData.visitors = $scope.visitors;
    inData.createBy =  $rootScope.user._id;
    
    $http.post('/api/v1/secure/visits', inData).success(function(response) {

    $http.get('/api/v1/secure/email/'+ response._id+'/newvisit').success(function(response) {
     console.log(response);
   })
      refresh();

      growl.info(parse("visit [%s]<br/>Added successfully", inData.title));
    })
    .error(function(data, status){
      growl.error("Error adding visit");
    }); // Http post visit ends
  }; //End of create method

  $scope.delete = function(visits) {
    var title = visits.title;
    $http.delete('/api/v1/secure/visits/' + visits._id).success(function(response) {
      refresh();
      growl.info(parse("visits [%s]<br/>Deleted successfully", title));
    })
    .error(function(data, status){
      growl.error("Error deleting visit");
    }); // Http put delete ends
  }; // Delete method ends

  $scope.update = function() {

    $http.put('/api/v1/secure/visits/' + $scope.visits._id,  $scope.visits).success(function(response) {
      refresh();
      growl.info(parse("visit [%s]<br/>Edited successfully",  $scope.visits.title));
    })
    .error(function(data, status){
      growl.error("Error updating visit");
    }); // Http put visit ends
  }; // Update method ends

  $scope.cancel = function() {

    $scope.visits="";
     $location.path("visits/list");
   // window.history.back();
  }

  $scope.getUser = function(){
    $http.get('/api/v1/secure/admin/users/' + inData.agm).success(function(response) {
      var user = response;
      $scope.visits.agm = parse("%s %s, <%s>", user.name.first, user.name.last, user.email); });
  }

   //add vmanager
   $scope.AddVmanager=function(){
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.status =$scope.status;
    $scope.visits.agm = $scope.agmId;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.createBy= $rootScope.user._id;
    $scope.visits.client = $scope.clientId;
    $scope.visits.invitees = $scope.arraydata;

    $http.put('/api/v1/secure/visits/' + $scope.visits._id, $scope.visits).success(function(response) {
     growl.info(parse("Visit Manager Edited successfully"));
     $location.path("/visits/"+$scope.visits._id+"/finalize"); 

   })
  };

  $scope.showNotifie= function(status){

    $scope.status = status;
    $scope.status="finalize";

    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.status =$scope.status;
    $scope.visits.agm = $scope.agmId;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.createBy= $rootScope.user._id;
    $scope.visits.client = $scope.clientId;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;

    $http.put('/api/v1/secure/visits/' + $scope.visits._id, $scope.visits).success(function(response) {
     growl.info(parse("Visit Manager Edited successfully"));
     $location.path("/visits/"+$scope.visits._id+"/finalize"); 
   })

  }
  $scope.next= function(){
     $location.path("/visits/"+$scope.visits._id+"/finalize"); 
    // $scope.visitorsTab=true;
  }
  $scope.sendAnchor= function(anchor,status){
    $scope.anchorman = anchor;

    $scope.status = status;
    $scope.status="wip";
  }
  $scope.sendSecVman= function(secondaryVmanager,status){
    $scope.vman = secondaryVmanager;
    $scope.status = status;
    $scope.status="wip";
  }
  $scope.clientEmail=function(){
    $http.get('/api/v1/secure/email/'+ $scope.visits._id+'/welcomeclient').success(function(response) {
     growl.info(parse("Visit Manager Edited successfully"));
   })
  }
  $scope.inviteEmail=function(){
    $http.get('/api/v1/secure/email/'+ $scope.visits._id+'/inviteeAttendees').success(function(response) {
     growl.info(parse("Visit Manager Edited successfully"));
   })
  }
  // Visit schedule table
  $scope.addSchedule=function(schedule){

    $scope.schedules.push({
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      location: schedule.location,
      meetingPlace: schedule.meetingPlace
    });

    schedule.startDate='';
    schedule.endDate='';
    schedule.location='';
    schedule.meetingPlace='';
  };

  $scope.removeSchedule = function(index){
    $scope.schedules.splice(index, 1);
  };

  $scope.editSchedule = function(index,schedule){
    $scope.schedule= schedule;
    $scope.schedules.splice(index, 1);
  };
// Visit schedule table end

 // Visit keynote table

 $scope.addkeynote=function(keynoteDef){

  $scope.keynotes.push({
    note: keynoteDef.note,
    context: keynoteDef.context,
    order: keynoteDef.order
  });

  keynoteDef.note='';
  keynoteDef.context='';
  keynoteDef.order='';
};

$scope.removekeynote = function(index){
  $scope.keynotes.splice(index, 1);
};

$scope.editkeynote = function(index,keynoteDef){
 $scope.keynoteDef= keynoteDef;
 $scope.keynotes.splice(index, 1);
};
// Visit keynote table end

  //adding visitor data if not registered user
  $scope.addvisitordata = function(userdata,emailId,influencedata,avatar)
  {
    //console.log(userdata);
    console.log(emailId);
    if(avatar == '' || avatar == undefined)
    {
      userdata.avatar = '/public/assets/g/imgs/avatar.jpg';
    }  
    if(avatar != '' || avatar !=undefined)
    {  
      userdata.avatar = avatar;
    }
    userdata.email = emailId;
    userdata.association = 'customer';
    console.log(userdata);
    $http.post('/api/v1/secure/admin/users/',userdata).success(function(response){
      console.log('POST');
      console.log(response);
    }).then(function() {
    // "complete" code here
    $http.get('/api/v1/secure/admin/users/email/' + userdata.email).success(function(response) {
     console.log('GET') ;
     $scope.userId = response._id;
     $scope.showFlag = "user";
     $scope.visitors.push({
      visitor: $scope.userId,
      influence: influencedata
    });
   });
  });
    $scope.avatar = '/public/assets/g/imgs/avatar.jpg';
  }

  // Visit visitor table

  $scope.addvisitor=function(visitorDef){
    $scope.showAvatar = false;
    $scope.showFlag='';
    $scope.message='';
    $scope.emailId = '';
    var influence= visitorDef.influence;
    var emailid = visitorDef.visitorId;
    var influencedata = visitorDef.influence;
    $http.get('/api/v1/secure/admin/users/email/' + visitorDef.visitorId).success(function(response) {
     if(response.association == 'customer')
     { 
       $scope.userId = response._id;
       $scope.showFlag = "user";
       $scope.visitors.push({
        visitor: $scope.userId,
        influence: influence
      });
     }

     else if(response.association !='customer')
     {
      $scope.showFlag = "noUser";
      $scope.message = "User not found";
      $timeout(function () { $scope.message = ''; }, 3000);
    }
  })

    .error(function(response, status){
      console.log(emailid);
      $scope.showFlag = "notRegisteredUser";
      if(status===404)
      { 
        console.log(influencedata);
        $scope.emailId = emailid;
        $scope.influencedata = influencedata;
        console.log($scope.emailId); 
        $scope.message = "User not found plz register";
      }
      else
        console.log("error with user directive");
    });


    //if not found add visitor-post that and get id
    visitorDef.influence='';
    visitorDef.visitorId='';
    visitorDef.visitor = '';
    visitorDef.visitorUser = '';
  };
  $scope.removevisitor = function(index){
    $scope.visitors.splice(index, 1);
  };

  $scope.editvisitor = function(index,visitorDef){
    $scope.visitorDef = visitorDef;
    $scope.visitors.splice(index, 1);
  };// Visit visitor table end

  //Feedback by Person
  $scope.feedbackbyPerson = function(visitid) {
    $http.get('/api/v1/secure/feedbacks').success(function(response1)
    {
      $scope.feedbackDatalist = $filter('filter')(response1, { visitid: visitid });
    });
  }

  //Feedback By Question
  $scope.feedbackbyQuestion = function(visitid) {
   $http.get('/api/v1/secure/feedbacks').success(function(response1)
   {
    $scope.arrayQuery = [];
    $scope.arrayItem = [];
    $scope.feedbacks = $filter('filter')(response1, { visitid: visitid });
    var feedbackData = $scope.feedbacks;

    for(var i =0;i<feedbackData.length;i++)
    {
      for(var j=0;j<feedbackData[0].item.length;j++)
      {
        $scope.arrayItem.push(feedbackData[i].item[j]);
      }
    }
  });
 }

 var indexedQuestions = [];

 $scope.questionsToFilter = function() {
  indexedQuestions = [];
  return $scope.arrayItem;
}

$scope.filterQuestions = function(item) {
  var questionIsNew = indexedQuestions.indexOf(item.query) == -1;
  if (questionIsNew) {
    indexedQuestions.push(item.query);
  }
  return questionIsNew;
}

// Show Profile Dialog for non-registered users
$scope.showProfileButton = function(ev) {
  $mdDialog.show({
    templateUrl: '/public/mods/visits/profilePictureDialog.html',
    scope: $scope.$new(),
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:true

  })
  .then(function(answer) {
    $scope.status = 'You said the information was "' + answer + '".';
  }, function() {
    $scope.status = 'You cancelled the dialog.';
  });

};

$scope.addpicture = function (dataUrl) {
  Upload.upload({
    url: '/api/v1/upload/profilePics',
    data: {
      file: Upload.dataUrltoBlob(dataUrl),
    },
  }).then(function (response) {
    $scope.userdata ='';
    $scope.result = response.data;
    var filepath = response.data.file.path;
    var imagepath = '/'+ filepath.replace(/\\/g , "/");
    $scope.avatar = imagepath;
    $scope.showAvatar = true;
    $mdDialog.hide();
  });

};

$scope.hide = function() {
  $mdDialog.hide();
};
$scope.canceldialog = function() {
  $mdDialog.cancel();
};
$scope.answer = function(answer) {
  $mdDialog.hide(answer);
};

$scope.checkErr = function(startDate,endDate) {
  var curDate = new Date();
  $scope.errMessage ='';
  if (startDate==null||endDate==null) {return true;}
  if(new Date(startDate).getTime() > new Date(endDate).getTime()){
      // $scope.errMessage =  'End Date should be greater than start date';
          // var err=function() {
          // $window.alert('End Date should be greater than start date');};
          // err();
          return true;
        }

        else if(new Date(startDate).getTime() >= curDate.getTime()){
         // $scope.errMessage = 'Start date should not be before today.';
          //  var err=function() {
          // $window.alert('Start date should not be before today.');};
          // err();
          return true;
        }
        else return false;

      };

    }])

//Autocompleate - Directive
visitsApp.directive("autocomplete", ["AutoCompleteService", function (AutoCompleteService) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          AutoCompleteService.search(searchTerm.term).then(function (autocompleteResults) {
            response($.map(autocompleteResults, function (autocompleteResult) {
              return {
                label: autocompleteResult.name,
                value: autocompleteResult.name,
                id: autocompleteResult._id
              }
            }))
          });
        },
        minLength: 4,
        select: function (event, selectedItem) {
          scope.clientName= selectedItem.item.value;
          scope.clientId= selectedItem.item.id;
          scope.$apply();
          event.preventDefault();
        }
      });
    }
  };
}]);
//Autocompleate - Directive
visitsApp.directive("feedback", ["FeedbackService", function (FeedbackService) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          FeedbackService.search(searchTerm.term).then(function (autocompleteResults) {
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
          scope.feedback= selectedItem.item.value;
          scope.feedbackId= selectedItem.item.id;
          scope.$apply();
          event.preventDefault();
        }
      });
    }
  };
}]);
//Autocompleate - Directive
visitsApp.directive("session", ["SessionService", function (SessionService) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          SessionService.search(searchTerm.term).then(function (autocompleteResults) {
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
          scope.session= selectedItem.item.value;
          scope.sessionId= selectedItem.item.id;
          scope.$apply();
          event.preventDefault();
        }
      });
    }
  };
}]);
//Autocompleate - Directive
visitsApp.directive("keynote", ["KeynoteService", function (KeynoteService) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          KeynoteService.search(searchTerm.term).then(function (autocompleteResults) {
            response($.map(autocompleteResults, function (autocompleteResult) {
              return {
                label: autocompleteResult.title,
                value: autocompleteResult._id,
                //id: autocompleteResult._id
              }
            }))
          });
        },
        minLength: 4,
        select: function (event, selectedItem) {
          scope.keynoteDef.note= selectedItem.item.value;
         // scope.keynoteId= selectedItem.item.id;
         scope.$apply();
         event.preventDefault();
       }
     });
    }
  };
}]);
//ui-date picker - Directive
visitsApp.directive('uiDate', function() {
  return {
    require: '?ngModel',
    link: function($scope, element, attrs, controller) {
      var originalRender, updateModel, usersOnSelectHandler;
      if ($scope.uiDate == null) $scope.uiDate = {};
      if (controller != null) {
        updateModel = function(value, picker) {
          return $scope.$apply(function() {
            return controller.$setViewValue(element.datepicker("getDate"));
          });
        };
        if ($scope.uiDate.onSelect != null) {
          usersOnSelectHandler = $scope.uiDate.onSelect;
          $scope.uiDate.onSelect = function(value, picker) {
            updateModel(value);
            return usersOnSelectHandler(value, picker);
          };
        } else {
          $scope.uiDate.onSelect = updateModel;
        }
        originalRender = controller.$render;
        controller.$render = function() {
          originalRender();
          return element.datepicker("setDate", controller.$viewValue);
        };
      }
      return element.datepicker($scope.uiDate);
    }
  };
});
