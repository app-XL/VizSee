
'use strict';

var visitsApp = angular.module('visits');
//Autocompleate - Factory
visitsApp.factory('FeedbackService', ["$http", function ($http) {
  return {
    search: function (term) {
      //var client = {title: new RegExp(term, 'i')};
      var maxRecs = 10;
      var fields = ('title _id type');
      var sort = ({title:'ascending'});
      var type = "visit";
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
//Autocompleate - Factory
visitsApp.factory('SessionService', ["$http", function ($http) {
  return {
    search: function (term) {
      //var client = {title: new RegExp(term, 'i')};
      var maxRecs = 10;
      var fields = ('title _id type');
      var sort = ({title:'ascending'});
      var type ="session";
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

visitsApp.controller('visitsControllerMain', ['$scope','appUserService', '$http', '$route', '$filter', '$routeParams','$rootScope', '$location', 'growl', '$window','$mdDialog', '$mdMedia','$timeout','Upload', 'FeedbackService', 'KeynoteService',
  function($scope,appUserService, $http, $route,$filter, $routeParams, $rootScope, $location, growl, $window ,$mdDialog , $mdMedia ,$timeout, Upload, FeedbackService, SessionService, KeynoteService) {

  appUserService.activeUser().then(function(user){
    //console.log("thsis"+user._id);
    $scope.activeUser = user;
  
  var id = $routeParams.id;

  // AUtomatically swap between the edit and new mode to reuse the same frontend form
  $scope.mode=(id==null? 'add': 'edit');
  $scope.createBy='';
  $scope.hideFilter = true;
  $scope.checked = false;
  $scope.checked1 = true;
  $scope.schedules=[];
  $scope.visitors=[];
  $scope.keynotes=[];
  $scope.bods = [];
  $scope.small= "small";
  $scope.large= "LARGE";
  $scope.medium= "medium";
  $scope.clientnameonly= "clientnameonly";
  $scope.nameonly= "nameonly";
  $scope.visitid = id;
  $scope.showAvatar = false;
  $scope.arraydata = [];
  $scope.dataOne=[];
  $scope.tab=false;
  $scope.anchor='';
  $scope.secondaryVmanager='';
  $scope.clientId='';
  $scope.isSaving= false;
  $scope.j=[];
  $scope.kData=[];
  $scope.closeNoteTipReject= false;
  $scope.cancelReasonNote= false;


  $scope.visitGrid=false;
  $scope.navVisit ='';
  $scope.agendaEdit= false;
  $scope.showKey=false;
  $scope.subdis= true;
  $scope.allViei=false;
  $scope.stdate= true;
  $scope.rejectReason="";
  $scope.agendaTab=true;
  $scope.visitorsTab=false;
  $scope.finalizeTab=false;
  $scope.notifyTab=false;
  $scope.visitGrid= false;
  $scope.designation= "designation";
  $scope.visvalid= true;
  $scope.secTrue=false;
  $scope.privalid=true;
  $scope.array = [];
  $scope.arrayiwo = [];
  $scope.closeSave=0;
  $scope.parentClient = true;
  $scope.childClient = true;
  $scope.industryClient = true;
  $scope.regionClient = true;
  $scope.Addlogovisit=false;
  $scope.removelogovisit=false;
  $scope.closeNote=true;
  $scope.closeNoteTipSch=true;
  $scope.closeNoteTipVis=true;
  $scope.saveDrafButton=true;
  $scope.rejectValue= false;

  $scope.overallfeedback=[];

  $scope.cscPersonnel={};
  $scope.VisitVmag = false;
  // $scope.sessiondbId = "";
  //$scope.editScheduleRow = [];  flag for edit schedule functionality
 // $scope.addScheduleRow = true;  flag for add schedule functionality

 $scope.cscPersonnel={};

  // $scope.salesExecId = "";
  // $scope.salesExecEmail = "";
  // $scope.salesExecUser =  "";

  // $scope.accountGMId = "";
  // $scope.accountGMEmail = "";
  // $scope.accountGMUser =  "";

  // $scope.industryExecId = "";
  // $scope.industryExecEmail = "";
  // $scope.industryExecUser =  "";

  // $scope.globalDeliveryId = "";
  // $scope.globalDeliveryEmail = "";
  // $scope.globalDeliveryUser =  "";

  // $scope.creId = "";
  // $scope.creEmail = "";
  // $scope.creUser =  "";

  $scope.submitVisitsUsers = false;
  $scope.submitAddVisitor = true;
  $scope.submitAddEmail = true;
  $scope.myData = [];
  $scope.valueComment = "opt1";

  $scope.nextTab = function(data) {
    $location.path('/visits/'+data+'/edit');
    $route.reload();
  };

  // var user= $scope.activeUser._id; 
  // var group = $scope.activeUser.memberOf;
  $scope.groupMember = $scope.activeUser.groups;
  if ($scope.activeUser.groups.indexOf("vManager") > -1 || $scope.activeUser.groups.indexOf("admin") > -1) {
    $scope.visitGrid= true;
  }
  if ($scope.activeUser.groups.indexOf("vManager") > -1){
    $scope.isSaving= true;
  }
  if ($scope.activeUser.groups.indexOf("admin") > -1) {
    $scope.adminInitVman= true;
  }

  //visit manager group- HTTP get for drop-down
  $http.get('/api/v1/secure/admin/groups/vManager/users').success(function(response) {
    var i= 0;
    i= response.length;
    response[i++]= {name:{first:"none"},_id:null};
    $scope.data=response;
  });

  //Location - Http get for drop-down
  $http.get('/api/v1/secure/lov/locations').success(function(response) {
    $scope.location=response.values;
  });

  //offerings - Http get for drop-down
  $http.get('/api/v1/secure/lov/offerings').success(function(response) {
    $scope.offerings=response.values;
  });

  //Influence - Http get for drop-down
  $http.get('/api/v1/secure/lov/influence').success(function(response) {
    $scope.influence=response.values;
  });

  //vertical - Http get for drop-down
  $http.get('/api/v1/secure/lov/vertical').success(function(response) {
    $scope.vertical=response.values;
  });

  //regions - Http get for drop-down
  $http.get('/api/v1/secure/lov/regions').success(function(response) {
    $scope.regions=response.values;
  });
  $http.get('/api/v1/secure/lov/vertical').success(function(response) {
    $scope.vertical = response.values;
  });

  // $http.get('/api/v1/secure/visits').success(function(response) {
  //   $scope.VisitsAll = response;
  // });

$scope.visitAllvMan = function() {
  $scope.VisitVmag = true;
    // var today = new Date();
    // console.log(today);
    $http.get('/api/v1/secure/visits').success(function(response) {
      //$scope.VisitsAllList = response;

      // for (var i = 0; i < response.length; i++) {
      //   if((response[i].startDate <= today && response[i].endDate >= today) || (response[i].startDate >= today && response[i].endDate >= today)) {
        $scope.VisitsAllList = response;
        //   console.log($scope.VisitsAllList)
        // }
     // }
      //console.log($scope.VisitsAllList)
    });

  }
  // console.log($scope.mode);

  if($scope.mode == 'edit')
  {
    $http.get('/api/v1/secure/visitSchedules/visit/'+$routeParams.id).success(function(response) {
      $scope.sessiondbId = response;
    }); 
  }
  if($scope.mode == 'edit')
  {

    $http.get('/api/v1/secure/visits/' + id).success(function(response){

      if(response.overallfeedback.length=== 0){
        //first time 
        $http.get('/api/v1/secure/visits/'+$routeParams.id+'/execs',{
          cache: true
        }).success(function(response) {
          console.log(response)
          $scope.cscData = response["employees"];
          $scope.clientData = response["clients"];
          for (var i =0 ;i<$scope.cscData.length;  i++) {
           $scope.j.push({
            id: $scope.cscData[i]._id,
            role:'Employee',
            feedbackElg: false});
         };
         for (var i =0 ;i<$scope.clientData.length;  i++) {
           $scope.j.push({
            id: $scope.clientData[i]._id,
            role:'Client',
            feedbackElg: true
          });
         };
         console.log($scope.j);

       })
      }

      else if(response.overallfeedback.length !=0){
        //first time 
        $scope.checkOverLaa=response.overallfeedback;
        
        $http.get('/api/v1/secure/visits/'+$routeParams.id+'/execs',{
          cache: true
        }).success(function(response) {
          console.log(response)
          $scope.cscData = response["employees"];
          $scope.clientData = response["clients"];
          
          for (var i =0 ;i<$scope.cscData.length;  i++) {
           $scope.kData.push({
            id: $scope.cscData[i]._id,
            role:'Employee',
            feedbackElg: false});
         };

         for (var i =0 ;i<$scope.clientData.length;  i++) {
           $scope.kData.push({
            id: $scope.clientData[i]._id,role:'Client',
            feedbackElg: true
          });
         };

         console.log($scope.kData);//all ppl are here

         for (var i = 0; i < $scope.kData.length; i++) {
          if ($scope.checkOverLaa[i]== null || $scope.checkOverLaa[i]== undefined) 
          {
            // console.log("im in kData[i].id != ($scope.checkOverLaa")
             $scope.j.push({
              id: $scope.kData[i].id,
              role:$scope.kData[i].role,
              feedbackElg: $scope.kData[i].feedbackElg
            });
           }
           else if ($scope.kData[i].id === $scope.checkOverLaa[i].id ) {
            // console.log("im in kData[i].id == ($scope.checkOverLaa")

              if ($scope.checkOverLaa[i].feedbackElg === "true" ) {
                $scope.feedbackElg =true;
                $scope.j.push({
                  id: $scope.checkOverLaa[i].id,
                  role:$scope.checkOverLaa[i].role,
                  feedbackElg: $scope.feedbackElg
                });
              }
              else{
                $scope.feedbackElg =false;
                $scope.j.push({
                  id: $scope.checkOverLaa[i].id,
                  role:$scope.checkOverLaa[i].role,
                  feedbackElg: $scope.feedbackElg
                });
              }
            }
            else{
              // console.log($scope.kData[i].id+ "im in else"+$scope.checkOverLaa[i].id);

              $scope.feedbackElg =false;
              $scope.j.push({
                id: $scope.kData[i].id,
                role:$scope.kData[i].role,
                feedbackElg: $scope.kData[i].feedbackElg
              });
            }
          };
        })
}

})
}

$scope.selectedList = [];

$scope.visitorId = "";
$scope.visitor = "";
$scope.visitorUser =  "";

$scope.agmId = "";
$scope.agmEmail = "";
$scope.agmUser =  "";
$scope.comment = [];

if($scope.mode == 'edit')
{
  var refresh1 = function()
  { 
    // console.log($scope.visitid);

    $http.get('/api/v1/secure/visits/'+$scope.visitid).success(function(response)
    {
      $scope.comment = response.comments;
      // console.log($scope.comment);

      for(var i=0;i<$scope.comment.length;i++)
      {
        $scope.myData.push($scope.comment[i]._id);
      }
    });
  }

  refresh1();
}
var refresh = function() {
  $scope.setTimeline = function(time){
    $scope.VisitVmag = false;
    $scope.allViei=true;
      //console.log("im here")
      $scope.timeline = time;
      // console.log("setting timeline to " + $scope.timeline )
      $scope.visitBatch = $scope.allVisits[$scope.timeline];
    }
    
    $http.get('/api/v1/secure/visits/all/my').success(function(response) {
      $scope.allVisits = response;
      // console.log("after delete :"+$scope.allVisits)
      var allVisits = [];
      // var key ="today";
      Object.keys($scope.allVisits).forEach(function (key) {

       var value = $scope.allVisits[key]
       if(key === "today" || key === "further" || key === "past"){
        allVisits.push.apply(allVisits, value.visits);
        //console.log(value.visits.length, allVisits.length);

      }
    })


      var uniqueIDs = [];
      var uniqueArray = [];

      for(var i = 0; i < allVisits.length; i++){

        if(uniqueIDs.indexOf(allVisits[i]._id) === -1){
          uniqueArray.push(allVisits[i])
          uniqueIDs.push(allVisits[i]._id);
        }
      }


      $scope.allVisits["all"] = {
        "start" : "begin",
        "end": "end",
        "visits": uniqueArray
      };

      
      if($scope.timeline=="" || $scope.timeline===undefined){
        $scope.timeline = "all";
        // console.log("no timeline. Set to " + $scope.timeline);
        $scope.visitBatch = $scope.allVisits[$scope.timeline];
      }
      else{
       $scope.timeline = "all";
       // console.log("no timeline. Set to " + $scope.timeline);
       $scope.visitBatch = $scope.allVisits[$scope.timeline];
     }
     // console.log(JSON.stringify($scope.visitBatch,null,2));

     $scope.visits = "";
     $scope.schedules=[];
     $scope.visitors=[];
     $scope.keynotes=[];
     $scope.bods = [];


     switch($scope.mode)    {
      case "add":
      $scope.visits = "";
      $scope.visitorType = "";
      break;

      case "edit":
      $scope.parentClient = false;
      $scope.childClient = false;
      $scope.industryClient = false;
      $scope.regionClient = false;
      $scope.visits = $http.get('/api/v1/secure/visits/' + id).success(function(response){
        console.log(response);
        $scope.visitManagerAnchor = response.anchor;
        $scope.visitManagerSecondary = response.secondaryVmanager;
        
        for(var files=0;files<response.visitAttachment.length;files++)
        {
          $scope.array.push(response.visitAttachment[files])
        }

        $scope.arrayiwo.push(response.wbscodeAttachment);
        var visits = response;
        if (visits.anchor!=undefined){
          $scope.anchor = visits.anchor._id;
          $scope.secTrue=true;
        }
        if(visits.secondaryVmanager!=undefined) {
          $scope.secondaryVmanager = visits.secondaryVmanager._id;
          $scope.yes();
          $scope.addSec=false;
        }else {
          $scope.secTrue=false;
          $scope.addSecMan();
        }

        switch(visits.status){
          case "confirm": 
          $scope.agendaTab=true;
          $scope.visitorsTab=true;
          $scope.agendaSave=1;
          break;

          case "tentative": 
          $scope.agendaTab=true;
          $scope.visitorsTab=true;
          $scope.agendaSave=1;
          break;

          case "wip":
          if ($scope.activeUser.groups.indexOf("vManager") > -1 || $scope.activeUser.groups.indexOf("admin") > -1) {
            $scope.finalizeTab= true;
            $scope.agendaTab=true;
            $scope.visitorsTab=true;
            $scope.notifyTab=false;
            $scope.agendaSave=0;
            $scope.visitorSave=1;
          }
          else{
           $scope.agendaTab= true;
           $scope.visitorsTab= true;
           $scope.finalizeTab= false;
           $scope.notifyTab= false;
           $scope.agendaSave=1;

         }
         break;

         case "finalize": 
         if ($scope.activeUser.groups.indexOf("vManager") > -1 || $scope.activeUser.groups.indexOf("admin") > -1) {
          $scope.finalizeTab= true;
          $scope.agendaTab=true;
          $scope.visitorsTab=true;
          $scope.notifyTab=true;
          $scope.agendaSave=0;
          $scope.visitorSave=0;
          $scope.finalizeSave=1;
        }
        else{
         $scope.agendaTab= true;
         $scope.visitorsTab= true;
         $scope.finalizeTab= false;
         $scope.notifyTab= false;
         $scope.agendaSave=1;

       }
       break;

       case "complete": 
       if ($scope.activeUser.groups.indexOf("vManager") > -1 || $scope.activeUser.groups.indexOf("admin") > -1) {
        $scope.closeTab=true;
        $scope.finalizeTab= true;
        $scope.agendaTab=true;
        $scope.visitorsTab=true;
        $scope.notifyTab=true;
        $scope.agendaSave=0;
        $scope.visitorSave=0;
        $scope.finalizeSave=0;
        $scope.closeSave=1;
      }
      else{
       $scope.agendaTab= true;
       $scope.visitorsTab= true;
       $scope.finalizeTab= false;
       $scope.notifyTab= false;
       $scope.agendaSave=1;

     }
     break;

     case "close": 
     if ($scope.activeUser.groups.indexOf("vManager") > -1 || $scope.activeUser.groups.indexOf("admin") > -1) {
      $scope.closeTab=true;
      $scope.finalizeTab= true;
      $scope.agendaTab=true;
      $scope.visitorsTab=true;
      $scope.notifyTab=true;
      $scope.agendaSave=0;
      $scope.visitorSave=0;
      $scope.finalizeSave=0;
      $scope.closeSave=1;
    }
    else{
     $scope.agendaTab= true;
     $scope.visitorsTab= true;
     $scope.finalizeTab= false;
     $scope.notifyTab= false;
     $scope.agendaSave=1;

   }
   break;

   case "confirm draft": 
   $scope.agendaTab= true;
   $scope.visitorsTab= true;
   $scope.finalizeTab= false;
   $scope.notifyTab= false;
   $scope.agendaSave=1;
   break;

   case "tentative draft": 
   $scope.agendaTab= true;
   $scope.visitorsTab= true;
   $scope.finalizeTab= false;
   $scope.notifyTab= false;
   $scope.agendaSave=1;
   break;

   case "rejected": 
   $scope.agendaTab= true;
   $scope.visitorsTab= true;
   $scope.finalizeTab= false;
   $scope.notifyTab= false;
   $scope.agendaSave=1;
   break;//re-submitted

   case "re-submitted": 
   $scope.agendaTab= true;
   $scope.visitorsTab= true;
   $scope.finalizeTab= false;
   $scope.notifyTab= false;
   $scope.agendaSave=1;
   break;
 };
 if (visits.rejectReason!= null || visits.rejectReason!= undefined || visits.rejectReason!="") {
   $scope.rejectReason= visits.rejectReason;
 };
 if (visits.cancelReason!= null || visits.cancelReason!= undefined || visits.cancelReason!="") {
   $scope.cancelReason= visits.cancelReason;
 };
 $scope.createBy= response.createBy._id;
   // console.log(visits.rejectReason);
   $scope.clientIdData=visits.client._id;
   $scope.parentSelected= visits.client.name;
   $scope.childSelected= visits.client.subName;
   visits.industry= visits.client.industry;
   visits.regions= visits.client.regions;
   $scope.sfdcidSelected= visits.client.sfdcid;
   if (visits.client.logo!= null) {
    $scope.showAvatar =true;
    $scope.avatarVisit=visits.client.logo;
  }else{ 
    $scope.showAvatar =false;
    $scope.Addlogovisit=true;
    $scope.removelogovisit=true;}
    $http.get('/api/v1/secure/clients/id/' +$scope.clientIdData).success(function(response) {
// })

    $scope.selectedList = visits.offerings;
    if(response.status == "draft"){
      $scope.ClientDraft= true;
    // console.log("draft");
    if (response.logo!= null) {
      $scope.showAvatar =true;
      $scope.avatarVisit=visits.client.logo;
    }else 
    $scope.showAvatar =false;
    $scope.Addlogovisit=true;
    $scope.removelogovisit=true;
  }else{ $scope.ClientDraft= false;
   // console.log("final");
 }
})
    for(var files=0;files<response.visitGallery.length;files++)
    {
      $scope.arrayClose.push(response.visitGallery[files])
    }

    $scope.bods = visits.bod;
    $scope.visitors = visits.visitors;
    if ($scope.visitors.length == 0)
    {
      $scope.visvalid= true;
      $scope.closeNoteTipVis=true;

    }
    else{
      $scope.visvalid= false;

    }
        $scope.schedules = visits.schedule;//List of schedules
        if ($scope.schedules.length == 0)
        {
          $scope.subdis= true;
          $scope.closeNoteTipSch=true;
        }
        else{
          $scope.subdis= false;

        }

        if (response.visitorType!='')
          $scope.visitorType = response.visitorType; // response from visitor type
        else
          $scope.visitorType = '';
        if ($scope.activeUser.groups=="user" && visits.status == "rejected") {
          $scope.saveDrafButton=true;
          $scope.status = "tentative";
        }
        else if ( visits.status == "confirm draft") {
          $scope.saveDrafButton=true;
          $scope.status = "confirm";
        }
        else if (visits.status == "tentative draft") {
          $scope.saveDrafButton=true;
          $scope.status = "tentative";
        }else{
          $scope.status= visits.status;
          $scope.saveDrafButton=false;
        } 
        if (visits.billable == "billable") {
          $scope.checked=true;
        };
          $scope.visits = visits;//Whole form object

          $scope.arraydata=response.invitees;
          if (response.agm!=undefined) {
            $scope.agmUser = response.agm;
            $scope.agmEmail = response.agm.email;
            $scope.agmId = response.agm._id;
          }
          $scope.clientName= response.client.name;//auto fill with reff client db

          if (response.feedbackTmpl!=undefined) {
            $scope.feedback= response.feedbackTmpl.title;//auto fill with reff feedback db
          }

          if(response.sessionTmpl!=undefined) {
          $scope.session= response.sessionTmpl.title;//auto fill with reff feedback db
        }

        if (response.competitorVisit!=undefined) {
         $scope.vCompetitor= "no";
         $scope.checked1 = false;
          // $scope.value="yes";
        }else{
         $scope.vCompetitor= "yes";
         $scope.checked1 = true;
       }
       $scope.collectlistData = $scope.visits.overallfeedbackElg;
       // $scope.collectlist = $scope.collectlistData.split(',');
       if (response.cscPersonnel!=undefined) {
        $scope.closeNote= false;
        if(response.cscPersonnel.salesExec != null || response.cscPersonnel.salesExec != undefined)
        {
          $scope.saleExeId = response.cscPersonnel.salesExec._id;
        }

        if(response.cscPersonnel.salesExec == null || response.cscPersonnel.salesExec == undefined)
        {
          $scope.saleExeId = null;
        }

        if(response.cscPersonnel.accountGM != null || response.cscPersonnel.accountGM != undefined)
        {
          $scope.accountGmId = response.cscPersonnel.accountGM._id;
        }

        if(response.cscPersonnel.accountGM == null || response.cscPersonnel.accountGM == undefined)
        {
          $scope.accountGmId = null;
        }

        if(response.cscPersonnel.industryExec != null || response.cscPersonnel.industryExec != undefined)
        {
          $scope.industryExeCId = response.cscPersonnel.industryExec._id;
        }

        if(response.cscPersonnel.industryExec == null || response.cscPersonnel.industryExec == undefined)
        {
          $scope.industryExeCId = null;
        }

        if(response.cscPersonnel.globalDelivery != null || response.cscPersonnel.globalDelivery != undefined)
        {
          $scope.globalDeliveryId = response.cscPersonnel.globalDelivery._id;
        }

        if(response.cscPersonnel.globalDelivery == null || response.cscPersonnel.globalDelivery == undefined)
        {
          $scope.globalDeliveryId = null;
        }

        if(response.cscPersonnel.cre != null || response.cscPersonnel.cre != undefined)
        {
          $scope.crEId = response.cscPersonnel.cre._id;
        } 

        if(response.cscPersonnel.cre == null || response.cscPersonnel.cre == undefined)
        {
          $scope.crEId = null;
        } 
        
        if($scope.saleExeId !=null || $scope.saleExeId !=undefined)
        {
          $scope.salesExecUser = response.cscPersonnel.salesExec;
          $scope.salesExecEmail = response.cscPersonnel.salesExec.email;
          $scope.salesExecId = response.cscPersonnel.salesExec._id;
        }

        if($scope.accountGmId !=null || $scope.accountGmId !=undefined)
        {
          $scope.accountGMUser = response.cscPersonnel.accountGM;
          $scope.accountGMEmail = response.cscPersonnel.accountGM.email;
          $scope.accountGMId = response.cscPersonnel.accountGM._id;
        }

        if($scope.industryExeCId !=null || $scope.industryExeCId !=undefined)
        {
          $scope.industryExecUser = response.cscPersonnel.industryExec;
          $scope.industryExecEmail = response.cscPersonnel.industryExec.email;
          $scope.industryExecId = response.cscPersonnel.industryExec._id;
        }

        if($scope.globalDeliveryId !=null || $scope.globalDeliveryId !=undefined)
        {
          $scope.globalDeliveryUser = response.cscPersonnel.globalDelivery;
          $scope.globalDeliveryEmail = response.cscPersonnel.globalDelivery.email;
          $scope.globalDeliveryId = response.cscPersonnel.globalDelivery._id;
        }

        if($scope.crEId !=null || $scope.crEId !=undefined)
        {  
          $scope.creUser = response.cscPersonnel.cre;
          $scope.creEmail = response.cscPersonnel.cre.email;
          $scope.creId = response.cscPersonnel.cre._id;
        }
      }

      for (var i =0; i<visits.keynote.length;i++) {
        $scope.keynotes.push({
          note: visits.keynote[i].note._id,
          noteName: visits.keynote[i].note.title, 
          context: visits.keynote[i].context,
          order: visits.keynote[i].order
        });
      };
            // Reformat date fields to avoid type compability issues with <input type=date on ng-model
            $scope.visits.createdOn = new Date($scope.visits.createdOn);
          });
break;

      } // Switch scope.mode ends
    }); // Get visit call back ends
  }; // Refresh method ends

  refresh();
  $scope.saveDraft=function() {
    console.log($scope.visits.clientName);
    if ($scope.visits.clientName != undefined || $scope.visits.subName != undefined|| $scope.visits.regions != undefined ||  $scope.parentSelected != undefined || $scope.childSelected != undefined){
      $scope.saveDraf=true;
      $scope.saveDrafButton=true;
      $scope.save();}
      else{$scope.cancelsaveDraft= true;
        // console.log("im here");
        $scope.errsaveDraft= "Account Information - Client Parent Account Name, Child Account Name, Region are Mandatory fields!!";}        
      }
      $scope.cancelsaveDraftCall= function(){
        $scope.cancelsaveDraft = false;
      }
      $scope.save = function(){
    // console.log($scope.parentSelected);
    // Set agm based on the user picker value
    if ($scope.status != undefined) {
      if ( $scope.saveDraf==true && $scope.status == "confirm") {
        $scope.visits.status = "confirm draft";
      }
      else if ( $scope.saveDraf==true && $scope.status == "tentative") {
        $scope.visits.status = "tentative draft";
      }else{
        $scope.visits.status =$scope.status;
      }
    }else{
      $scope.visits.status = "tentative draft";
    }
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.offerings = $scope.selectedList;
    $scope.visits.agm = null;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.visitAttachment = $scope.array;
    $scope.visits.wbscodeAttachment = $scope.arrayiwo;
    $scope.visits.visitGallery = $scope.arrayClose;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.overallfeedbackElg = $scope.collectlist;
    if ($scope.j!= undefined || $scope.j != 0) {
      console.log($scope.j);
    $scope.visits.overallfeedback = $scope.j;};
    $scope.check= true;
    if ($scope.checked1 == true){
      $scope.visits.competitorVisit=null;
      }//check code
      if ($scope.checked == false){
        $scope.unbillable= "non-billable";
        if($scope.visits.wbsCode!=null){$scope.visits.wbsCode= null;}
        $scope.visits.billable=$scope.unbillable;
        $scope.visits.wbscodeAttachment ="";
      }//check code
      else{
        $scope.billable= "billable";
        if($scope.visits.chargeCode!=null){$scope.visits.chargeCode= null;}
        $scope.visits.billable=$scope.billable;
        $scope.visits.wbscodeAttachment = $scope.arrayiwo.toString();
        }//WBS code

        $scope.visits.feedbackTmpl = $scope.feedbackId;
        $scope.visits.sessionTmpl = $scope.sessionId;
        // console.log($scope.visits);
        // while edit vll get id den v need to search by id too...
        var inDataClient={};
        
        if ($scope.visits.clientName!=null) 
        {
          inDataClient.name = $scope.visits.clientName;
        }
        if($scope.visits.clientName==null)  
        {
          inDataClient.name = $scope.parentClientString;
        }
        // else inDataClient.name = $scope.parentSelected;

        if ($scope.visits.subName!=null) 
        {
          inDataClient.subName =$scope.visits.subName;
        }
        if($scope.visits.subName==null)  
        {
          inDataClient.subName = $scope.childClientString;
        }
        // else inDataClient.subName = $scope.childSelected;

        if ($scope.visits.industry!=null) 
        {
          inDataClient.industry =$scope.visits.industry;
        }
        if($scope.visits.industry==null)  
        {
          inDataClient.industry = $scope.industryClientString;
        }
        // else inDataClient.industry = $scope.industrySelected;

        if ($scope.visits.regions!=null) 
        {
          inDataClient.regions =$scope.visits.regions;
        }
        if($scope.visits.regions==null)  
        {
          inDataClient.regions = $scope.regionClientString;
        }
        // else inDataClient.regions = $scope.regionsSelected;

        // sfdcidClientString
      
        // else inDataClient.sfdcid = $scope.sfdcidSelected;

        // inDataClient.sfdcid=$scope.visits.sfdcid;

        if(inDataClient.name == null)
        {
          inDataClient.name = $scope.parentSelected;
        }

        if(inDataClient.subName == null)
        {
          inDataClient.subName = $scope.childSelected;
        }

        if(inDataClient.industry == null)
        {
          inDataClient.industry = $scope.industrySelected;
        }

        if(inDataClient.regions == null)
        {
          inDataClient.regions = $scope.regionsSelected;
        }

        if($scope.visits.sfdcid==null)  
        {
          inDataClient.sfdcid = $scope.sfdcidClientString;
        }

        if(inDataClient.sfdcid == null)
        {
          inDataClient.sfdcid = $scope.sfdcidSelected;
        }

        if ($scope.visits.sfdcid!=null) 
        {
          inDataClient.sfdcid =$scope.visits.sfdcid;
        }
        if(inDataClient.sfdcid == null || inDataClient.sfdcid == undefined || inDataClient.sfdcid == ""){
          inDataClient.sfdcid = "null";
        }

        

        inDataClient.netPromoter =$scope.visits.netPromoter;
        inDataClient.competitors =$scope.visits.competitors;
        inDataClient.logo= $scope.avatarVisit; 
        //console.log(inDataClient.name + " " + inDataClient.subName + " " +inDataClient.industry + " " + inDataClient.regions);
        $http.get('/api/v1/secure/clients/find?query=' + inDataClient.name+"&subQuery="+inDataClient.subName+"&regions="+inDataClient.regions+"&id=").success(function(response) {
          console.log(response);

          if (response.id!= null) {
            // console.log("im in here with id")
            $scope.visits.client = response.id;

            switch($scope.mode){
              case "add":
              $scope.create();
              break;

              case "edit":
              $scope.update();
              $route.reload();
              break;

            }
          }
          else if($scope.clientIdData!=undefined && response.id!= null ){
            // console.log("you can proceed now");
            $scope.visits.clientIdData=$scope.clientIdData;
            $scope.update(); 
          }
          else
        {//get al client data
          // console.log($scope.visits);
          
          var inDataClient ={};

          if ($scope.visits.clientName!=null) 
          {
            inDataClient.name = $scope.visits.clientName;
          }
          if($scope.visits.clientName==null)  
          {
            inDataClient.name = $scope.parentClientString;
          }
        // else inDataClient.name = $scope.parentSelected;

        if ($scope.visits.subName!=null) 
        {
          inDataClient.subName =$scope.visits.subName;
        }
        if($scope.visits.subName==null)  
        {
          inDataClient.subName = $scope.childClientString;
        }
        // else inDataClient.subName = $scope.childSelected;

        if ($scope.visits.industry!=null) 
        {
          inDataClient.industry =$scope.visits.industry;
        }
        if($scope.visits.industry==null)  
        {
          inDataClient.industry = $scope.industryClientString;
        }
        // else inDataClient.industry = $scope.industrySelected;

        if ($scope.visits.regions!=null) 
        {
          inDataClient.regions =$scope.visits.regions;
        }
        if($scope.visits.regions==null)  
        {
          inDataClient.regions = $scope.regionClientString;
        }
        // else inDataClient.regions = $scope.regionsSelected;

        // sfdcidClientString
        
        // else inDataClient.sfdcid = $scope.sfdcidSelected;

        // inDataClient.sfdcid=$scope.visits.sfdcid;

        if(inDataClient.name == null)
        {
          inDataClient.name = $scope.parentSelected;
        }

        if(inDataClient.subName == null)
        {
          inDataClient.subName = $scope.childSelected;
        }

        if(inDataClient.industry == null)
        {
          inDataClient.industry = $scope.industrySelected;
        }

        if(inDataClient.regions == null)
        {
          inDataClient.regions = $scope.regionsSelected;
        }

        if ($scope.visits.sfdcid!=null) 
        {
          inDataClient.sfdcid =$scope.visits.sfdcid;
        }
        if($scope.visits.sfdcid==null)  
        {
          inDataClient.sfdcid = $scope.sfdcidClientString;
        }

        if(inDataClient.sfdcid == null)
        {
          inDataClient.sfdcid = $scope.sfdcidSelected;
        }

        if(inDataClient.sfdcid == null || inDataClient.sfdcid == undefined || inDataClient.sfdcid == ""){
          inDataClient.sfdcid = "null";
        }
        
        if ($scope.activeUser.groups.indexOf("admin") > -1 ) {
          inDataClient.status="final";
        }else inDataClient.status="draft";

        inDataClient.netPromoter =$scope.visits.netPromoter;
        inDataClient.competitors =$scope.visits.competitors;

        if ($scope.avatarVisit!=undefined) {
          inDataClient.logo=$scope.avatarVisit;}
          console.log(inDataClient)

          $http.post('/api/v1/secure/clients', inDataClient).success(function(response) {
           $scope.visits.client = response._id;
           switch($scope.mode){
            case "add":
            $scope.create();
            break;

            case "edit":
            $scope.update();
            $route.reload();
            break;

          }
        })
        }
      })
        } // End of save method

        $scope.create = function() {
          var inData       = $scope.visits;
          inData.schedule = $scope.schedules;
          inData.keynote = $scope.keynotes;
          inData.bod = $scope.bods;
          inData.visitors = $scope.visitors;
          inData.createBy =  $scope.activeUser._id;
          inData.cscPersonnel =$scope.cscPersonnel;
          // console.log($scope.cscPersonnel);
          // console.log(inData);
          var client ={};
          client.cscPersonnel =$scope.cscPersonnel;
          $http.put('/api/v1/secure/clients/id/' + inData.client, client).success(function(response) {
            // console.log("added");
          })

          if ($scope.saveDraf==true) {
            $http.post('/api/v1/secure/visits', inData).success(function(response) {
              // console.log("im in saveDraf mode!!")

              $scope.nextTab(response._id);

              growl.info(parse("[%s] visit successfully saved as draft.", $scope.parentClientString));
            })
          }else{
            $http.post('/api/v1/secure/visits', inData).success(function(response) {
              // console.log("im in else saveDraf mode!!")
              $http.get('/api/v1/secure/email/'+ response._id+'/newvisit').success(function(response) {
               // console.log(response);
             })
              $scope.nextTab(response._id);
              growl.info(parse("Visit information saved successfully."));
            })
            .error(function(data, status){
              growl.error("Error adding visit");
              }); // Http post visit ends
          }
    }; //End of create method

    $scope.delete = function(visits) {
      var title = visits.title;
      $http.delete('/api/v1/secure/visits/' + visits._id).success(function(response) {
        refresh();
        growl.info(parse("visit deleted successfully."));
      })
      .error(function(data, status){
        growl.error("Error deleting visit");
    }); // Http put delete ends
  }; // Delete method ends

  $scope.update = function() {
    // console.log($scope.commentsData);
    console.log($scope.visits);
    // console.log($scope.visits.clientIdData)
    var inData       = $scope.visits;
    inData.keynote = $scope.keynotes;
    inData.createBy=$scope.createBy;
    inData.cscPersonnel =$scope.cscPersonnel;
    inData.comments = $scope.commentsData;
    // console.log(inData.comments);
    var client ={};
    client.cscPersonnel =$scope.cscPersonnel;

    if ($scope.visits.clientName!=null) 
    {
      client.name = $scope.visits.clientName;
    }
    if ($scope.visits.clientName==null)  
    {
      client.name = $scope.parentClientString;
    }
    // else client.name = $scope.parentSelected;

    if ($scope.visits.subName!=null) 
    {
      client.subName =$scope.visits.subName;
    }
    if ($scope.visits.subName==null)  
    {
      client.subName = $scope.childClientString;
    }
    // else client.subName = $scope.childSelected;

    if ($scope.visits.industry!=null) 
    {
      client.industry =$scope.visits.industry;
    }
    if ($scope.visits.industry==null)  
    {
      client.industry = $scope.industryClientString;
    }
    // else client.industry = $scope.industrySelected;

    if ($scope.visits.regions!=null) 
    {
      client.regions =$scope.visits.regions;
    }
    if($scope.visits.regions==null)  
    {
      client.regions = $scope.regionClientString;
    }
    // else client.regions = $scope.regionsSelected;

        // sfdcidClientString
        if ($scope.visits.sfdcid!=null) 
        {
          client.sfdcid =$scope.visits.sfdcid;
        }
        if ($scope.visits.sfdcid==null)  
        {
          client.sfdcid = $scope.sfdcidClientString;
        }

        if(client.name == null)
        {
          client.name = $scope.parentSelected;
        }

        if(client.subName == null)
        {
          client.subName = $scope.childSelected;
        }

        if(client.industry == null)
        {
          client.industry = $scope.industrySelected;
        }

        if(client.regions == null)
        {
          client.regions = $scope.regionsSelected;
        }

        if(client.sfdcid == null)
        {
          client.sfdcid = $scope.sfdcidSelected;
        }
        // else client.sfdcid = $scope.sfdcidSelected;

        if ($scope.activeUser.groups.indexOf("admin") > -1 ) {
          client.status="final";
        }

        if ($scope.avatarVisit!=undefined) {
          client.logo=$scope.avatarVisit;}

      // console.log(client);
      $http.put('/api/v1/secure/clients/id/' + inData.client, client).success(function(response) {
      })
      .error(function(data, status){
        growl.error("Error updating client");
    }); // http put keynoges ends

      $http.put('/api/v1/secure/visits/' + $scope.visits._id,  inData).success(function(response) {
       refresh();
       growl.info(parse("visit [%s]<br/>Edited successfully",  client.name));

       if ($scope.activeUser.groups.indexOf("vManager") > -1 || $scope.activeUser.groups.indexOf("admin") > -1) {
        if($scope.agendaTab == true && $scope.agendaEdit == false) {
          if(($scope.status == "confirm" || $scope.status =="tentative") ||( $scope.visitorsTab == true && $scope.check == true && $scope.finall == true && $scope.status == "wip"))
          {
            $location.path("visits/list");
          }else
          $location.path("/visits/"+$scope.visits._id+"/edit"); 
        }
        else if($scope.finalizeTab == true && $scope.finall == true)
        {
          $location.path("visits/list");
        }
        else   $location.path("/visits/"+$scope.visits._id+"/edit"); 
      }

      else if($scope.agendaTab == true && $scope.agendaEdit == false) {
        if($scope.visitorsTab == true && $scope.check == true)
        {
          $location.path("visits/list");
        }else
        $location.path("/visits/"+$scope.visits._id+"/edit"); 
      }
    })
.error(function(data, status){
  growl.error("Error updating visit");
    }); // Http put visit ends
  }; // Update method ends

  $scope.cancel = function() {

    $scope.visits="";
    growl.info(parse("Visit initiation cancelled successfully."));
    $location.path("visits/list");
   // window.history.back();
 }

 $scope.getUser = function(){
  $http.get('/api/v1/secure/admin/users/' + inData.agm).success(function(response) {
    var user = response;
    $scope.visits.agm = parse("%s %s, <%s>", user.name.first, user.name.last, user.email); });
}

$scope.updateClientStatus=function () {
  $http.get('/api/v1/secure/clients/id/'+$scope.visits.client._id).success(function(response) {
    // console.log(response);
    var inData       = $scope.visits;
    inData.keynote = $scope.keynotes;
    inData.createBy=$scope.createBy;
    inData.cscPersonnel =$scope.cscPersonnel;
    inData.comments = $scope.commentsData;
    var client ={};
    client.cscPersonnel =$scope.cscPersonnel;

    if ($scope.visits.clientName!=undefined) 
      {client.name =$scope.visits.clientName;}
    else client.name = $scope.parentSelected;

    if ($scope.visits.subName!=undefined) 
      {client.subName =$scope.visits.subName;}
    else client.subName = $scope.childSelected;

    if ($scope.visits.industry!=undefined) 
      {client.industry =$scope.visits.industry;}
    else client.industry = $scope.industrySelected;

    if ($scope.visits.regions!=undefined) 
      { client.regions =$scope.visits.regions;}
    else client.regions = $scope.regionsSelected;

    if ($scope.visits.sfdcid!=undefined) 
      { client.sfdcid =$scope.visits.sfdcid;}
    else client.sfdcid = $scope.sfdcidSelected;

    if ($scope.activeUser.groups.indexOf("admin") > -1 ) {
      client.status="final";
    }

    if ($scope.avatarVisit!=undefined) {
      client.logo=$scope.avatarVisit;}

      console.log(client);
      $http.put('/api/v1/secure/clients/id/' + response._id, client).success(function(response) {
      })
      .error(function(data, status){
        growl.error("Error updating client");
    }); // http put keynoges ends
    })
$scope.ClientDraft=false;
}
   //add vmanager
   $scope.AddVmanager=function(){
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.status =$scope.status;
    $scope.visits.agm = null;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.client = $scope.clientIdData;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.cscPersonnel=$scope.cscPersonnel;
    $scope.visits.createBy = $scope.createBy;
    // $scope.dataOne=[];

    var inData       = $scope.visits;
    inData.keynote = $scope.keynotes;
    inData.comments = $scope.commentsData;
    $http.put('/api/v1/secure/visits/' + $scope.visits._id, inData).success(function(response) {
     growl.info(parse("Visit Manager assigned successfully."));
     $scope.nextTab($scope.visits._id);
     
     //Notfication when Primary Visit Manager Assigned or Sec V manager Assigned 
     if($scope.visitManagerAnchor == undefined && $scope.visitManagerSecondary == undefined)
     {
       $http.get('/api/v1/secure/email/'+ $scope.visits._id+'/newvmanagerassigned').success(function(response) {
        console.log(response);
      }) 
     }

     if($scope.visitManagerSecondary == undefined && $scope.visitManagerAnchor != undefined && $scope.anchorman==undefined && $scope.vman!=undefined)
     {
       $http.get('/api/v1/secure/email/'+ $scope.visits._id+'/newvmanagerassigned').success(function(response) {
        console.log(response);
      }) 
     }
    
     //Notfication when Primary Visit Manager Changes
     if($scope.visitManagerAnchor._id != $scope.anchorman && $scope.anchorman!=undefined)
     {
       $http.get('/api/v1/secure/email/'+ $scope.visits._id + '/' + $scope.visitManagerAnchor.email + '/visitownerchange').success(function(response) {
        console.log(response);
      }) 
     }

     //Notfication when Secondary Visit Manager Changes
     if($scope.anchorman==undefined && $scope.vman!=undefined && $scope.visitManagerSecondary._id != $scope.vman)
     {
       $http.get('/api/v1/secure/email/'+ $scope.visits._id + '/' + $scope.visitManagerSecondary.email + '/visitownerchange').success(function(response) {
        console.log(response);
      }) 
     } 
   })
  };

  $scope.showNotifie= function(){
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.status ="finalize";
    $scope.visits.agm = null;
    $scope.visits.createBy = $scope.createBy;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.client = $scope.clientIdData;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.cscPersonnel=$scope.cscPersonnel;

    var inData       = $scope.visits;
    inData.keynote = $scope.keynotes;
    inData.comments = $scope.commentsData;
    $http.put('/api/v1/secure/visits/' + $scope.visits._id, inData).success(function(response) {
      growl.info(parse("Planning stage compleated successfully"));
      $scope.nextTab($scope.visits._id);
    })

  }
  $scope.reachedEnd=function(){
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.status ="close";
    $scope.visits.agm = null;
    $scope.visits.createBy = $scope.createBy;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.client = $scope.clientIdData;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;
    $scope.visits.visitGallery = $scope.arrayClose;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.cscPersonnel=$scope.cscPersonnel;

    var inData       = $scope.visits;
    inData.keynote = $scope.keynotes;
    inData.comments = $scope.commentsData;
    $http.put('/api/v1/secure/visits/' + $scope.visits._id, inData).success(function(response) {
      growl.info(parse("Planning stage compleated successfully"));
      $location.path("visits/list"); 
      
    })
  }
  $scope.getvalidation= function(ev){

    $scope.visits.agm = null;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.client = $scope.clientIdData;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.cscPersonnel=$scope.cscPersonnel;
    $scope.visits.createBy = $scope.createBy;



    var inData     = $scope.visits;
    inData.keynote = $scope.keynotes;
    inData.comments = $scope.commentsData;
    $scope.errinData=[];
    $http.put('/api/v1/secure/visits/validation/finalize/'+ $scope.visits._id,inData).success(function(response) {
      // console.log(response)
      if(response == undefined || response == 0 || response == null){
        $scope.showNotifie($scope.visits.status);
      }
      else{
        for (var i =0; i<response.length; i++) {
          $scope.errinData.push(response[i]);
        };
        $mdDialog.show({
          templateUrl: '/public/mods/visits/valFinal.html',
          scope: $scope.$new(),
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true

        })
      }

    })
  }
  $scope.sendAnchor= function(anchor,status){
    $scope.anchorman = anchor;
    $scope.privalid=false;
    $scope.dataOne=[];


    if ($scope.notifyTab== true) {
      $scope.status = status;
    }
    else{
      $scope.status = status;
      $scope.status="wip";
    }
    $scope.yes();
  }
  $scope.sendSecVman= function(secondaryVmanager,status){
    if ($scope.secTrue==false) {
      $scope.vman = null;
    }else
    $scope.vman = secondaryVmanager;
    if ($scope.notifyTab== true) {
      $scope.status = status;
    }
    else{
      $scope.status = status;
      $scope.status="wip";
    }
  }

  $scope.yes=function(anchor){
    // $scope.addSec=true;
    $scope.dataOne=[];
    $http.get('/api/v1/secure/admin/groups/vManager/users').success(function(response) {
      for (var i =0;i< response.length; i++) {
        if ($scope.anchorman== response[i]._id || anchor== response[i]._id || $scope.anchor == response[i]._id) {
        }else{
         $scope.dataOne.push({
          response: response[i]
        });
       }
     };
   });
  }
  $scope.optionsec=function(){
    $scope.secTrue=true;
    $scope.addSec=false;
  }
  $scope.removeVman=function(){
    $scope.secTrue=false;
    $scope.sendSecVman();
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.status =$scope.status;
    $scope.visits.agm = null;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.client = $scope.clientIdData;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.cscPersonnel=$scope.cscPersonnel;
    $scope.visits.createBy = $scope.createBy;
    $scope.visits.comments = $scope.commentsData;
    // $scope.dataOne=[];
    
    $http.put('/api/v1/secure/visits/' + $scope.visits._id, $scope.visits).success(function(response) {
    });
    refresh();
  }
  $scope.addSecMan=function(){
    $scope.addSec=true;
  }
  $scope.checkedBill=function(){
    $scope.checked=true;
  }
  $scope.checkednonBill=function(){
    $scope.checked=false;
  }

  $scope.vCompetitorCheck=function(){
    $scope.checked1=true;
  }

  $scope.vCompetitorUncheck = function () {
    $scope.checked1 = false;
  }

  $scope.clientEmail=function(){
    $http.get('/api/v1/secure/email/'+ $scope.visits._id+'/welcomeclient').success(function(response) {
     growl.info(parse("client invitations sent successfully"));
   })
  }
  $scope.inviteEmail=function(){
    $http.get('/api/v1/secure/email/'+ $scope.visits._id+'/inviteeAttendees').success(function(response) {
     growl.info(parse("invitees invitations sent successfully"));
   })
  }

  $scope.closeNotification=function(){
   $location.path("visits/list"); 
 }
 $scope.closeVisit=function(status){
  // console.log(status);
  $scope.status = status;
  $scope.status="complete";

  $scope.visits.anchor = $scope.anchorman;
  $scope.visits.secondaryVmanager= $scope.vman;
  $scope.visits.status =$scope.status;
  $scope.visits.agm = null;
  $scope.visits.anchor = $scope.anchorman;
  $scope.visits.secondaryVmanager= $scope.vman;
  $scope.visits.client = $scope.clientIdData;
  $scope.visits.invitees = $scope.arraydata;
  $scope.visits.feedbackTmpl = $scope.feedbackId;
  $scope.visits.sessionTmpl = $scope.sessionId;
  $scope.cscPersonnel.salesExec = $scope.salesExecId;
  $scope.cscPersonnel.accountGM= $scope.accountGMId;
  $scope.cscPersonnel.industryExec = $scope.industryExecId;
  $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
  $scope.cscPersonnel.cre= $scope.creId;
  $scope.visits.cscPersonnel=$scope.cscPersonnel;
  $scope.visits.createBy = $scope.createBy;


  var inData       = $scope.visits;
  inData.keynote = $scope.keynotes;
  inData.comments = $scope.commentsData;
  $http.put('/api/v1/secure/visits/' + $scope.visits._id, inData).success(function(response) {
    growl.info(parse("notifications stage compleated successfully"));
    $scope.nextTab($scope.visits._id);
  })

}
$scope.isDataValid=function(schedule){
  var Today = new Date();

  if(schedule === "" || schedule === undefined)
    return "Data undefined !";

  if(schedule.startDate === "" || schedule.startDate === undefined || schedule.startDate === null)
    return "Start Date not valid !";

  if(schedule.endDate === "" || schedule.endDate === undefined || schedule.endDate === null)
    return "End Date not valid !";

  if(currentDiff(schedule.startDate)<0)
    return "Start Date cannot be less than Current Date !";

  if(DateDiff(schedule.startDate,schedule.endDate)>0)
    return "End Date cannot be less than Start Date !";

  if(schedule.location === "" || schedule.location === undefined )
    return "Location not valid !";

  return "OK";
} 

// Visit schedule table
$scope.addSchedule=function(schedule){
    //$scope.schedules=[];
    var isValid = $scope.isDataValid(schedule);
    if(isValid === "OK"){
      var startDate = moment(schedule.startDate).format('YYYY-MM-DDTHH:mm:ss.SSSS');
      var endDate = moment(schedule.endDate).format('YYYY-MM-DDTHH:mm:ss.SSSS');
      $scope.subdis= false;
      $scope.schedules.push({
        startDate: startDate,
        endDate: endDate,
        location: schedule.location,
        meetingPlace: schedule.meetingPlace
      });
    }
    else {
      // console.log(isValid);
      $scope.err = isValid;
      $scope.subdis= true;
      $timeout(function () { $scope.err = ''; }, 5000);}

      schedule.startDate='';
      schedule.endDate='';
      schedule.location='';
      schedule.meetingPlace='';
    };

    $scope.removeSchedule = function(index,schedules){
      $scope.schedules.splice(index, 1);
      if (schedules.length == 0)
      {
        $scope.subdis= true;
        $scope.closeNoteTipSch=true;

      }else{
        $scope.subdis= false;}
      };

     /*$scope.editSchedule = function(index,schedule){
      $scope.editScheduleRow[index] = true;
      $scope.addScheduleRow = false;
      schedule.startDate = $filter('date')(schedule.startDate, "MM/dd/yyyy");
      schedule.endDate = $filter('date')(schedule.endDate, "MM/dd/yyyy");
     };

    $scope.cancelSchedule = function(index){
     $scope.editScheduleRow[index] = false;
    };

    $scope.updateSchedule = function(index,schedule){
      $scope.newItem=[];
      var isValid = $scope.isDataValid(schedule);
      if(isValid === "OK"){
        var startDate = moment(schedule.startDate).format('YYYY-MM-DDTHH:mm:ss.SSSS');
        var endDate = moment(schedule.endDate).format('YYYY-MM-DDTHH:mm:ss.SSSS');
        $scope.subdis= false;
        $scope.newItem = {
          startDate: startDate,
          endDate: endDate,
          location: schedule.location
        };
        $scope.schedule = [];
        $scope.schedule.splice(index, 0, $scope.newItem);
        $scope.editScheduleRow[index] = false;
      }
    };*/
// Visit schedule table end

//BOD Table

$scope.isDatevalidBOD =  function(bodDef) {
    //console.log(bodDef);
    if (bodDef === "" || bodDef === undefined || bodDef === null)
      return "Data undefined !";

    if (bodDef.tcv === "" || bodDef.tcv === undefined || bodDef.tcv === null)
      return "TCV name not valid !";

    if (bodDef.duration === "" || bodDef.duration ===  undefined || bodDef.duration ===  null)
      return "Duration not valid !";

    if (bodDef.offerings === "" || bodDef.offerings ===  undefined || bodDef.offerings === null)
      return "Offerings not valid !";

    if (bodDef.teamSize === "" || bodDef.teamSize === undefined || bodDef.teamSize === null)
      return "Team Size not valid !";

    return "OK";
  }

  $scope.addBod = function (bodDef) {
  //  console.log(bodDef.tcv);
    //console.log(bodDef);

    var isValid = $scope.isDatevalidBOD(bodDef);

    if (isValid === "OK")
    {
      $scope.bodDef = false;
      $scope.bods.push ({
        tcv: bodDef.tcv,
        duration: bodDef.duration,
        offerings: bodDef.offerings,
        teamSize: bodDef.teamSize
      });
    }
    else {
      //console.log(isValid);
      $scope.err = isValid;
      $timeout(function () { $scope.err = ''; }, 5000);}

      bodDef.tcv = '';
      bodDef.duration = '';
      bodDef.offerings = '';
      bodDef.teamSize = '';
    };

    $scope.removeBod = function (index){
      $scope.bods.splice(index, 1);
    };


    $scope.editBod = function(index,bodDef){
      $scope.showKey=true;
      // console.log(bodDef);
      $scope.bodDef= bodDef;
      $scope.bods.splice(index, 1);

    };

 // Visit keynote table
 $scope.isDataValidkey=function(keynoteDef){
  // console.log(keynoteDef);
  if(keynoteDef === "" || keynoteDef === undefined)
    return "Data undefined !";

  if(keynoteDef.noteName === "" || keynoteDef.noteName === undefined || keynoteDef.noteName === null)
    return "keynote not valid !";

  if(keynoteDef.context === "" || keynoteDef.context === undefined || keynoteDef.context === null)
    return "context not valid !";

  if(keynoteDef.order === "" || keynoteDef.order === undefined || keynoteDef.order === null)
    return "order not valid !";

  return "OK";
}

$scope.addkeynote=function(keynoteDef){
  var isValid = $scope.isDataValidkey(keynoteDef);
  if(isValid === "OK"){
    $scope.keyvalid=false;
    $scope.keynotes.push({
      note: $scope.keynoteId,
      noteName: keynoteDef.noteName, 
      context: keynoteDef.context,
      order: keynoteDef.order
    });
  }else {$scope.keyvalid=isValid;
    $timeout(function () { $scope.keyvalid = ''; }, 5000);}

    keynoteDef.noteName='';
    keynoteDef.context='';
    keynoteDef.order='';
  };

  $scope.removekeynote = function(index){
    $scope.keynotes.splice(index, 1);
  };

// $scope.editkeynote = function(index,keynoteDef){
//   $scope.showKey=true;
//   console.log(keynoteDef);
//   $scope.keynoteDef= keynoteDef;
//   $scope.keynotes.splice(index, 1);
// };
// Visit keynote table end

function toTitleCase(string)
{
      // \u00C0-\u00ff for a happy Latin-1
      return string.toLowerCase().replace(/_/g, ' ').replace(/\b([a-z\u00C0-\u00ff])/g, function (_, initial) {
        return initial.toUpperCase();
      }).replace(/(\s(?:de|a|o|e|da|do|em|ou|[\u00C0-\u00ff]))\b/ig, function (_, match) {
        return match.toLowerCase();
      });
    }

    $scope.inputChanged = function(str) {
      $scope.jobTitle = str;
    }  

    $scope.inputChanged1 = function(str) {
      $scope.dsgData = str;
      if($scope.dsgData != null || $scope.dsgData != "")
      {
        $scope.submitAddVisitor = false;
      }
      if($scope.dsgData == null || $scope.dsgData == "")
      {
        $scope.submitAddVisitor = true;
      }
    }

    $scope.inputChanged2 = function(str) {
      $scope.emailData = str;
      if($scope.emailData != null || $scope.emailData != "")
      {
        $scope.submitAddEmail = false;
      }
      if($scope.emailData == null || $scope.emailData == "")
      {
        $scope.submitAddEmail = true;
      }
    }
  //adding visitor data if not registered user
  $scope.addvisitordata = function(userdata,firstName,emailId,influencedata,avatar)
  { 
    $scope.contactNo = [];

    $scope.contactNo.push({
      contactNumber:userdata.contactNumber,
      contactType:userdata.contactType
    })

    if(avatar == '' || avatar == undefined)
    {
      userdata.avatar = '/public/assets/g/imgs/generic.png';
    }  
    if(avatar != '' || avatar !=undefined)
    {  
      userdata.avatar = avatar;
    }
    userdata.email = emailId;
    // userdata.local.email = emailId;
    userdata.name.first = firstName;
    userdata.association = 'customer';
    userdata.contactNo = $scope.contactNo;
    userdata.orgRef = $scope.visits.client._id;

    // // userdata.organization = $scope.orgName;
    // if(userdata.jobTitle!=null)
    // {
    //   userdata.jobTitle = toTitleCase(userdata.jobTitle);
    // }

    // if(userdata.jobTitle==null)
    // {
    //   userdata.jobTitle = toTitleCase($scope.designationdata);
    //   // userdata.jobTitle = toTitleCase($scope.jobTitle);
    // }
    
    $http.get('/api/v1/secure/clients/id/' + userdata.orgRef).success(function(response5) {
      $scope.orgName = response5.name;
      userdata.organization = $scope.orgName;
    // userdata.organization = $scope.orgName;
    if(userdata.jobTitle!=null)
    {
      userdata.jobTitle = toTitleCase(userdata.jobTitle);
    }

    if(userdata.jobTitle==null)
    {
      userdata.jobTitle = toTitleCase($scope.designationdata);
      // userdata.jobTitle = toTitleCase($scope.jobTitle);
    }
    console.log(userdata);  
    $http.post('/api/v1/secure/admin/users/',userdata).success(function(response){
    }).then(function() {
    // "complete" code here
    $http.get('/api/v1/secure/admin/users/email/' + userdata.email).success(function(response) {
     $scope.userId = response._id;
     $scope.showFlag = "user";
     $scope.visitors.push({
      visitor: $scope.userId,
      influence: influencedata
    });
     $scope.j.push({
      id: $scope.userId,
      role:'Client',
      feedbackElg: true
    });

     if ($scope.visitors.length == 0)
     {
       $scope.visvalid=true;
       $scope.closeNoteTipVis=true;
     }else{
       $scope.visvalid=false;

     }
   });
  });

  });  
$scope.avatar = '/public/assets/g/imgs/generic.png';
}

$scope.cancelButton = function(){
  $scope.showFlag = "noUser";
  $scope.message = "";
};

  // Visit visitor table
  // //id
  $scope.callClientId=function() {
    // console.log("im here in callClientId lucky u");
    $http.get('/api/v1/secure/clients/find?query=' + $scope.visits.client+"&subQuery="+$scope.visits.subName+"&industry="+$scope.visits.industry+"&regions="+$scope.visits.regions+"&id=").success(function(response) {
      // console.log(response);
      if (response.id!= null) {
        $scope.clientId= response.id;
        // console.log($scope.clientId);
      }

    })
  }

  $scope.addvisitor=function(visitorDef){
    $scope.submitAddVisitor = true;
    $scope.submitAddEmail = true;
    $scope.showAvatar = false;
    $scope.showFlag='';
    $scope.message='';
    $scope.emailId = '';
    $scope.firstName = '';
    var influence= visitorDef.influence;
    var emailid = visitorDef.visitorId;
    var influencedata = visitorDef.influence;
    var designationdata = visitorDef.autoDesignation;

    if(designationdata!=undefined || designationdata !=null)
    {
      designationdata = designationdata;
    }

    if(designationdata==undefined || designationdata ==null)
    {
      designationdata = $scope.dsgData;
    }

    if(emailid!=undefined || emailid !=null)
    {
      emailid = emailid;
    }

    if(emailid==undefined || emailid ==null)
    {
      emailid = $scope.emailData;
    }

    if(visitorDef.visitorId!=null)
    {
      $http.get('/api/v1/secure/admin/users/email/' + emailid.toLowerCase()).success(function(response) {
       if(response.association == 'customer' && response.orgRef == $scope.visits.client._id)
       { 
         $scope.userId = response._id;
         $scope.showFlag = "user";
         $scope.visvalid= false;
         $scope.visitors.push({
          visitor: $scope.userId,
          influence: influence
        });

         for(var i=0;i<$scope.visitors.length - 1;i++)
         {
          if($scope.userId == $scope.visitors[i].visitor)
          {
            $scope.showFlag = "noUser";
            $scope.message = "Visitor Already Exists , Add Unique Visitor";
            $timeout(function () { $scope.message = ''; }, 3000);
            $scope.visitors.splice($scope.visitors.length - 1, 1);
          }
        }
        $scope.j.push({
          id: $scope.userId,
          role:'Client',
          feedbackElg: true
        });
      }

      else if(response.groups == 'exec')
      { 
       $scope.userId = response._id;
       $scope.showFlag = "user";
       $scope.visvalid= false;
       $scope.visitors.push({
        visitor: $scope.userId,
        influence: influence
      });

       for(var i=0;i<$scope.visitors.length - 1;i++)
       {
        if($scope.userId == $scope.visitors[i].visitor)
        {
          $scope.showFlag = "noUser";
          $scope.message = "Senior Executive Already Exists , Add Unique Senior Executive";
          $timeout(function () { $scope.message = ''; }, 3000);
          $scope.visitors.splice($scope.visitors.length - 1, 1);
        }
      }
    }

    else if(response.association !='customer' || response.groups!='exec')
    {
      $scope.showFlag = "noUser";
      $scope.message = "User is not senior executive or client.";
      $timeout(function () { $scope.message = ''; }, 3000);
    }

    else if(response.orgRef != $scope.visits.client._id)
    {
      $scope.showFlag = "noUser";
      $scope.message = "User does not belongs to " + $scope.visits.client.name;
      $timeout(function () { $scope.message = ''; }, 3000);
    }
  })
}

if(visitorDef.visitorId==null)
{
  $scope.showFlag = "notRegisteredUser";
  var substring = "@";
  console.log(emailid.indexOf(substring));
  if(emailid.indexOf(substring) == -1)
  {
    $scope.firstName = emailid;
  }
  if(emailid.indexOf(substring) > -1)
  {
    $scope.emailId = emailid;
  }

  $scope.influencedata = influencedata;
  $scope.designationdata = designationdata;
  $scope.message = "Client Does Not Exist.Please Add new client for this visit.";
}  
    //if not found add visitor-post that and get id
    visitorDef.influence='';
    visitorDef.visitorId='';
    visitorDef.visitor = '';
    visitorDef.visitorUser = '';
    $scope.selectedUser = '';
    $scope.designationAuto = '';

  };
  
  $scope.removevisitor = function(visitorDef,visitors){
    var index = visitors.indexOf(visitorDef);
    $scope.visitors.splice(index, 1);
    if (visitors.length == 0)
    {
     $scope.visvalid=true;
     $scope.closeNoteTipVis=true;
   }else{
     $scope.visvalid=false;

   }
 };

 $scope.editvisitor = function(index,visitorDef){
  $scope.visitorDef = visitorDef;
  $scope.visitors.splice(index, 1);
  };// Visit visitor table end

  $scope.mySort = $scope.newestFirst = function(visitorDef) {
    return -$scope.visitors.indexOf(visitorDef);
  }
  //Feedback by Person
  $scope.feedbackbyPerson = function(visitid) {
    $scope.feedbackTitles = [];
    $http.get('/api/v1/secure/feedbacks').success(function(response1)
    { 
      $scope.feedbackDatalist = $filter('filter')(response1, { visitid: visitid, feedbackOn: "visit" });
      // console.log($scope.feedbackDatalist);
      $http.get('/api/v1/secure/feedbackDefs/id/'+$scope.feedbackDatalist[0].template).success(function(response2)
      {
        $scope.feedbackTitles.push(response2.title);
      });
    });
  }

  //Feedback By Question
  $scope.feedbackbyQuestion = function(visitid) {
   $http.get('/api/v1/secure/feedbacks').success(function(response1)
   {
    $scope.arrayQuery = [];
    $scope.arrayItem = [];
    $scope.feedbacks = $filter('filter')(response1, { visitid: visitid, feedbackOn: "visit" });
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

 $scope.haschange = function()
 {
  $scope.view ={"mode":null};
}
  //Feedback by Person
  $scope.sessionFeedbackbyPerson = function(visitId,sessionId) {
    $scope.feedbackSampleTitles = [];
    $scope.persons = [];
    $http.get('/api/v1/secure/feedbacks').success(function(response1)
    { 
      $scope.feedbackSamplelist = $filter('filter')(response1, {visitid:visitId, sessionid: sessionId, feedbackOn: "session" });
      $http.get('/api/v1/secure/feedbackDefs/id/'+$scope.feedbackSamplelist[0].template).success(function(response2)
      {
        $scope.feedbackSampleTitles.push(response2.title);
      });

    });

    $http.get('/api/v1/secure/visitSchedules/' + sessionId).success(function(response3)
    {
      $scope.owner = response3.session.owner;
      $scope.supporter = response3.session.supporter;
      $scope.locationsession = response3.session.location;
      $scope.description = response3.session.desc;
      $scope.sessiontitle = response3.session.title;

      $http.get('/api/v1/secure/admin/users/' + $scope.owner).success(function(response)
      {
        $scope.userModel = response;
      });

      $http.get('/api/v1/secure/admin/users/' + $scope.supporter).success(function(response)
      {
        $scope.userModel1 = response;
      });
    });


  }

  //Feedback By Question
  $scope.sessionFeedbackbyQuestion = function(visitId,sessionId) {

   $http.get('/api/v1/secure/feedbacks').success(function(response1)
   {
    $scope.arrayQuery = [];
    $scope.arrayItem = [];
    $scope.feedbacks = $filter('filter')(response1, {visitid:visitId, sessionid: sessionId, feedbackOn: "session" });
    var feedbackData = $scope.feedbacks;
    for(var i =0;i<feedbackData.length;i++)
    {
      for(var j=0;j<feedbackData[0].item.length;j++)
      {
        $scope.arrayItem.push(feedbackData[i].item[j]);
      }
    }
  });

   $http.get('/api/v1/secure/visitSchedules/' + sessionId).success(function(response4)
   {
    $scope.owner1 = response4.session.owner;
    $scope.supporter1 = response4.session.supporter;
    $scope.locationsession = response4.session.location;
    $scope.description = response4.session.desc;
    $scope.sessiontitle = response4.session.title;

    $http.get('/api/v1/secure/admin/users/' + $scope.owner1).success(function(response)
    {
      $scope.userModel2 = response;

    });

    $http.get('/api/v1/secure/admin/users/' + $scope.supporter1).success(function(response)
    {
      $scope.userModel3 = response;
    });
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

$scope.clearInput = function (id) {
  if (id) {
    $scope.$broadcast('angucomplete-alter:clearInput', id);
  }
  else{
    $scope.$broadcast('angucomplete-alter:clearInput');
  }
}

$scope.clearInput1 = function (id) {
  if (id) {
    $scope.$broadcast('angucomplete-alter:clearInput', id);
  }
  else{
    $scope.$broadcast('angucomplete-alter:clearInput');
  }
}


$scope.parentClientChanged = function(str) {
  $scope.parentClientString = str;
  // console.log($scope.parentClientString);
  if($scope.parentClientString!=null || $scope.parentClientString!="")
  {
    $scope.parentClient = false;
    $scope.errparentMsg = "";
  }

  if($scope.parentClientString==null || $scope.parentClientString=="")
  {
    $scope.parentClient = true;
    $scope.errparentMsg = "Parent Account Name is Mandatory field";
  }
}  

$scope.childClientChanged = function(str) {
  $scope.childClientString = str;
    // console.log($scope.childClientString);
    if($scope.childClientString!=null || $scope.childClientString!="")
    {
      $scope.childClient = false;
      $scope.errchildMsg = "";
    }

    if($scope.childClientString==null || $scope.childClientString=="")
    {
      $scope.childClient = true;
      $scope.errchildMsg = "Child Account Name is Mandatory field";
    }
  } 

  $scope.industryClientChanged = function(str) {
    $scope.industryClientString = str;
    console.log($scope.industryClientString);
    if($scope.industryClientString!=null || $scope.industryClientString!="")
    {
      $scope.industryClient = false;
      $scope.errindustryMsg = "";
    }

    if($scope.industryClientString==null || $scope.industryClientString=="")
    {
      $scope.industryClient = true;
      $scope.errindustryMsg = "Industry is Mandatory field";
    }
  } 

  $scope.regionClientChanged = function(str) {
    $scope.regionClientString = str;
  // console.log($scope.regionClientString);
  if($scope.regionClientString!=null || $scope.regionClientString!="")
  {
    $scope.regionClient = false;
    $scope.errregionMsg = "";
  }

  if($scope.regionClientString==null || $scope.regionClientString=="")
  {
    $scope.regionClient = true;
    $scope.errregionMsg = "Region is Mandatory field";
  }
} //sfdcid

$scope.sfdcidClientChanged = function(str) {
  $scope.sfdcidClientString = str;
  // console.log($scope.sfdcidClientString);
  if($scope.sfdcidClientString!=null || $scope.sfdcidClientString!="")
  {
    $scope.sfdcidClient = false;
    $scope.errsfdcidMsg = "";
  }

  if($scope.sfdcidClientString==null || $scope.sfdcidClientString=="")
  {
    $scope.sfdcidClient = true;
    $scope.errsfdcidMsg = "sfdcid is Mandatory field";
  }
} 

$scope.addClientLogo = function(ev) {
  $mdDialog.show({
    templateUrl: '/public/mods/clients/clientLogoDialog.html',
    scope: $scope.$new(),
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:true

  })
};

$scope.addlogo = function (dataUrl) {
  Upload.upload({
    url: '/api/v1/upload/visits',
    data: {
      file: Upload.dataUrltoBlob(dataUrl),
    },
  }).then(function (response) {
    $scope.userdata ='';
    $scope.result = response.data;
    var filepath = response.data.file.path;
    var imagepath = '/'+ filepath.replace(/\\/g , "/");
    $scope.avatarVisit = imagepath;
    $scope.showAvatar = true;
    $mdDialog.hide();
  });

};

$scope.hide = function() {
  $mdDialog.hide();
};
$scope.canceldialog = function() {
  $mdDialog.cancel();
  // $route.reload();
  // $scope.btn_add();
};
$scope.canceldialogvMan = function() {
  $mdDialog.cancel();
  $scope.cancelReasonNote= false;
};
$scope.answer = function(answer) {
  $mdDialog.hide(answer);
};
$scope.getLogo=function(){

  // console.log("im here")
  if($scope.parentClient ==true || $scope.childClient ==true || $scope.industryClient ==true || $scope.regionClient ==true) {
    $scope.Addlogovisit=false;
    $scope.removelogovisit=false;
    $scope.showAvatar=false;
  // console.log("im here if")

}
else{
  // console.log("im here else")
  var inDataClient={};
  if ($scope.visits.clientName!=null) 
  {
    inDataClient.name = $scope.visits.clientName;
  }
  if($scope.visits.clientName==null)  
  {
    inDataClient.name = $scope.parentClientString;
  }
        // else inDataClient.name = $scope.parentSelected;

        if ($scope.visits.subName!=null) 
        {
          inDataClient.subName =$scope.visits.subName;
        }
        if($scope.visits.subName==null)  
        {
          inDataClient.subName = $scope.childClientString;
        }
        // else inDataClient.subName = $scope.childSelected;

        if ($scope.visits.industry!=null) 
        {
          inDataClient.industry =$scope.visits.industry;
        }
        if($scope.visits.industry==null)  
        {
          inDataClient.industry = $scope.industryClientString;
        }
        // else inDataClient.industry = $scope.industrySelected;

        if ($scope.visits.regions!=null) 
        {
          inDataClient.regions =$scope.visits.regions;
        }
        if($scope.visits.regions==null)  
        {
          inDataClient.regions = $scope.regionClientString;
        }
        // else inDataClient.regions = $scope.regionsSelected;

        // sfdcidClientString
        if ($scope.visits.sfdcid!=null) 
        {
          inDataClient.sfdcid =$scope.visits.sfdcid;
        }
        if($scope.visits.sfdcid==null)  
        {
          inDataClient.sfdcid = $scope.sfdcidClientString;
        }
        // else inDataClient.sfdcid = $scope.sfdcidSelected;

        // inDataClient.sfdcid=$scope.visits.sfdcid;

        if(inDataClient.name == null)
        {
          inDataClient.name = $scope.parentSelected;
        }

        if(inDataClient.subName == null)
        {
          inDataClient.subName = $scope.childSelected;
        }

        if(inDataClient.industry == null)
        {
          inDataClient.industry = $scope.industrySelected;
        }

        if(inDataClient.regions == null)
        {
          inDataClient.regions = $scope.regionsSelected;
        }

        if(inDataClient.sfdcid == null)
        {
          inDataClient.sfdcid = $scope.sfdcidSelected;
        }
        
        $http.get('/api/v1/secure/clients/find?query=' + inDataClient.name+"&subQuery="+inDataClient.subName+"&industry="+inDataClient.industry+"&regions="+inDataClient.regions+"&id=").success(function(response) {
      // console.log(response);
  // console.log(response.logo)

  if (response.logo!= null) {
    $scope.avatarVisit=response.logo;
    $scope.showAvatar=true;
  }
  else{
        // console.log("response.logo else")
        $scope.Addlogovisit=true;
        $scope.removelogovisit=true;
        $scope.showAvatar=false;
      }
    })
      }
    }

    $scope.removeLogo=function(){
      $scope.showAvatar=false;
    }

    $scope.closeNotecscP=function(){
      $scope.closeNote= false;
    }
    $scope.closeNoteTipST=function(){
      $scope.closeNoteTipSch=false;
    }
    $scope.closeNoteTipV=function(){
      $scope.closeNoteTipVis=false;
    }
    $scope.closeNotecscPrs=function(){
      $scope.closeNote= true;
    }

    $scope.comment11 = [];
    $scope.btn_add = function(comment1) {

      if(comment1 !=''){
        $scope.comment11.push({
          comment: comment1,
          givenBy: $scope.activeUser._id
        });

        $http.post('/api/v1/secure/comments/',$scope.comment11).success(function(response) {
      // console.log(response);
      $scope.commentid = response._id;
      $scope.myData.push($scope.commentid);
    });
    // refresh1();

    $http.get('/api/v1/secure/visits/'+$scope.visitid).success(function(response)
    {
      $scope.visits = response;
      var inData = $scope.visits;
      inData.client=$scope.visits.client._id;
      inData.createBy = $scope.visits.createBy._id;
      if(inData.cscPersonnel.salesExec != null || inData.cscPersonnel.salesExec != undefined)
      {
        inData.cscPersonnel.salesExec = $scope.visits.cscPersonnel.salesExec._id;
      }

      if(inData.cscPersonnel.salesExec == null || inData.cscPersonnel.salesExec == undefined)
      {
        inData.cscPersonnel.salesExec = null;
      }

      if(inData.cscPersonnel.accountGM != null || inData.cscPersonnel.accountGM != undefined)
      {
        inData.cscPersonnel.accountGM = $scope.visits.cscPersonnel.accountGM._id;
      }

      if(inData.cscPersonnel.accountGM == null || inData.cscPersonnel.accountGM == undefined)
      {
        inData.cscPersonnel.accountGM = null;
      }

      if(inData.cscPersonnel.industryExec != null || inData.cscPersonnel.industryExec != undefined)
      {
        inData.cscPersonnel.industryExec = $scope.visits.cscPersonnel.industryExec._id;
      }

      if(inData.cscPersonnel.industryExec == null || inData.cscPersonnel.industryExec == undefined)
      {
        inData.cscPersonnel.industryExec = null;
      }

      if(inData.cscPersonnel.globalDelivery != null || inData.cscPersonnel.globalDelivery != undefined)
      {
        inData.cscPersonnel.globalDelivery = $scope.visits.cscPersonnel.globalDelivery._id;
      }

      if(inData.cscPersonnel.globalDelivery == null || inData.cscPersonnel.globalDelivery == undefined)
      {
        inData.cscPersonnel.globalDelivery = null;
      }

      if(inData.cscPersonnel.cre != null || inData.cscPersonnel.cre != undefined)
      {
        inData.cscPersonnel.cre = $scope.visits.cscPersonnel.cre._id;
      } 

      if(inData.cscPersonnel.cre == null || inData.cscPersonnel.cre == undefined)
      {
        inData.cscPersonnel.cre = null;
      }

      if(inData.anchor!=null || inData.anchor != undefined)
      {
        inData.anchor = $scope.visits.anchor._id;
      }

      if(inData.anchor==null || inData.anchor == undefined)
      {
        inData.anchor = null;
      }

      if(inData.secondaryVmanager!=null || inData.secondaryVmanager!=undefined)
      {
        inData.secondaryVmanager = $scope.visits.secondaryVmanager._id;
      }

      if(inData.secondaryVmanager==null || inData.secondaryVmanager==undefined)
      {
        inData.secondaryVmanager = null;
      }

      if(inData.feedbackTmpl!=null || inData.feedbackTmpl!=undefined)
      {
        inData.feedbackTmpl = $scope.visits.feedbackTmpl._id;
      }  

      if(inData.feedbackTmpl==null || inData.feedbackTmpl==undefined)
      {
        inData.feedbackTmpl = null;
      }  
      
      if(inData.sessionTmpl!=null || inData.sessionTmpl!=undefined)
      {
        inData.sessionTmpl = $scope.visits.sessionTmpl._id;;
      }  

      if(inData.sessionTmpl==null || inData.sessionTmpl==undefined)
      {
        inData.sessionTmpl = null;
      }  
      // console.log($scope.keynotes);
      // console.log($scope.visits.keynote);
      // inData.keynote = $scope.visits.keynote;
      inData.keynote = $scope.keynotes;
      // // console.log($scope.rejectValue);
      // if ($scope.rejectValue == true) {
      //   inData.status= "reject";
      //   growl.info(parse("Rejected the visit"));
      // }else
      // inData.status=$scope.visits.status;
      // console.log(inData.status);
      inData.comments = $scope.myData;
      $scope.commentsData = [];
      // console.log(inData);
      $http.put('/api/v1/secure/visits/'+$scope.visitid,inData).success(function(response) {

        $http.get('/api/v1/secure/visits/'+$scope.visitid).success(function(response)
        {
          $scope.comment = response.comments;
          $scope.oneData = [];
          for(var i=0;i<$scope.comment.length;i++)
          {
            $scope.oneData.push($scope.comment[i]._id);
            $scope.commentsData = $scope.oneData;
          }
        }).then(function() {
          // console.log($scope.commentsData);
        });

      });

    })

$scope.txtcomment = "";
$scope.comment11 = [];
// $route.reload();
// refresh();
}
}

// Show Profile Dialog for non-registered users
$scope.showChatBox = function(ev) {
  $mdDialog.show({
    templateUrl: '/public/mods/visits/visitsComments.html',
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

$scope.showChatBoxrejected = function(ev,rejectReason) {
  // console.log(rejectReason);
  $mdDialog.show({
    templateUrl: '/public/mods/visits/visitsReject.html',
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
$scope.showcancelVisit = function(ev) {
  // console.log(rejectReason);
  $mdDialog.show({
    templateUrl: '/public/mods/visits/cancelVisit.html',
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
$scope.cancelVisit=function(cancelReason){
 console.log(cancelReason);
 $http.get('/api/v1/secure/visits/'+$scope.visitid).success(function(response)
 {
  console.log($scope.visits);

  // if (rejectReason!= undefined) {
  //   console.log(rejectReason);
  if (cancelReason!= undefined) {
    $scope.visits = response;
    var inData = $scope.visits;
    inData.client=$scope.visits.client._id;
    inData.createBy = $scope.visits.createBy._id;
    if(inData.cscPersonnel.salesExec != null || inData.cscPersonnel.salesExec != undefined)
    {
      inData.cscPersonnel.salesExec = $scope.visits.cscPersonnel.salesExec._id;
    }
    
    if(inData.cscPersonnel.salesExec == null || inData.cscPersonnel.salesExec == undefined)
    {
      inData.cscPersonnel.salesExec = null;
    }
    
    if(inData.cscPersonnel.accountGM != null || inData.cscPersonnel.accountGM != undefined)
    {
      inData.cscPersonnel.accountGM = $scope.visits.cscPersonnel.accountGM._id;
    }
    
    if(inData.cscPersonnel.accountGM == null || inData.cscPersonnel.accountGM == undefined)
    {
      inData.cscPersonnel.accountGM = null;
    }
    
    if(inData.cscPersonnel.industryExec != null || inData.cscPersonnel.industryExec != undefined)
    {
      inData.cscPersonnel.industryExec = $scope.visits.cscPersonnel.industryExec._id;
    }
    
    if(inData.cscPersonnel.industryExec == null || inData.cscPersonnel.industryExec == undefined)
    {
      inData.cscPersonnel.industryExec = null;
    }
    
    if(inData.cscPersonnel.globalDelivery != null || inData.cscPersonnel.globalDelivery != undefined)
    {
      inData.cscPersonnel.globalDelivery = $scope.visits.cscPersonnel.globalDelivery._id;
    }
    
    if(inData.cscPersonnel.globalDelivery == null || inData.cscPersonnel.globalDelivery == undefined)
    {
      inData.cscPersonnel.globalDelivery = null;
    }
    
    if(inData.cscPersonnel.cre != null || inData.cscPersonnel.cre != undefined)
    {
      inData.cscPersonnel.cre = $scope.visits.cscPersonnel.cre._id;
    } 
    
    if(inData.cscPersonnel.cre == null || inData.cscPersonnel.cre == undefined)
    {
      inData.cscPersonnel.cre = null;
    }
    
    if(inData.anchor!=null || inData.anchor != undefined)
    {
      inData.anchor = $scope.visits.anchor._id;
    }
    
    if(inData.anchor==null || inData.anchor == undefined)
    {
      inData.anchor = null;
    }
    
    if(inData.secondaryVmanager!=null || inData.secondaryVmanager!=undefined)
    {
      inData.secondaryVmanager = $scope.visits.secondaryVmanager._id;
    }
    
    if(inData.secondaryVmanager==null || inData.secondaryVmanager==undefined)
    {
      inData.secondaryVmanager = null;
    }
    
    if(inData.feedbackTmpl!=null || inData.feedbackTmpl!=undefined)
    {
      inData.feedbackTmpl = $scope.visits.feedbackTmpl._id;
    }  
    
    if(inData.feedbackTmpl==null || inData.feedbackTmpl==undefined)
    {
      inData.feedbackTmpl = null;
    }  
    
    if(inData.sessionTmpl!=null || inData.sessionTmpl!=undefined)
    {
      inData.sessionTmpl = $scope.visits.sessionTmpl._id;;
    }  
    
    if(inData.sessionTmpl==null || inData.sessionTmpl==undefined)
    {
      inData.sessionTmpl = null;
    }  
          // console.log($scope.keynotes);
          // console.log($scope.visits.keynote);
          // inData.keynote = $scope.visits.keynote;
          inData.keynote = $scope.keynotes;
          // console.log($scope.rejectValue);
          // if ($scope.rejectValue == true) {
            // inData.status= "rejected";
            // growl.info(parse("Rejected the visit"));
          // }else
          // inData.status=$scope.visits.status;
          // console.log(inData.status);
          inData.comments = $scope.myData;
          $scope.commentsData = [];
          // console.log(rejectReason);

          // inData.rejectReason = rejectReason;
          console.log(cancelReason);
          // if ($scope.rejectValue == true) {
            // inData.status= "rejected";
            inData.status = "cancelled";
            inData.cancelReason = cancelReason;
                    // growl.info(parse("Rejected the visit"));
          // }else
          // inData.status=$scope.visits.status;
          console.log(inData);
          $http.put('/api/v1/secure/visits/'+$scope.visitid,inData).success(function(response) {
            console.log(response);
         // $scope.nextTab($scope.visitid);
            // $scope.nextTab();
            $location.path("visits/list"); 

          });
          
          growl.info(parse("Cancelled visit successfully: "+inData.title));
        }
        else
        {
          $scope.cancelReasonNote= true;
        // console.log("im here");
        $scope.errcancelReason= "Please mention reasons for canceling the visit ..!!";
      }

    })  
}
$scope.closecancelReasonNote = function(){
  $scope.cancelReasonNote= false;
}
$scope.ReSave=function(){
 // console.log(rejectReason);
 $http.get('/api/v1/secure/visits/'+$scope.visitid).success(function(response)
 {
  // console.log(rejectReason);

  // if (rejectReason!= undefined) {
  //   console.log(rejectReason);

  $scope.visits = response;
  var inData = $scope.visits;
  inData.client=$scope.visits.client._id;
  inData.createBy = $scope.visits.createBy._id;
  if(inData.cscPersonnel.salesExec != null || inData.cscPersonnel.salesExec != undefined)
  {
    inData.cscPersonnel.salesExec = $scope.visits.cscPersonnel.salesExec._id;
  }

  if(inData.cscPersonnel.salesExec == null || inData.cscPersonnel.salesExec == undefined)
  {
    inData.cscPersonnel.salesExec = null;
  }

  if(inData.cscPersonnel.accountGM != null || inData.cscPersonnel.accountGM != undefined)
  {
    inData.cscPersonnel.accountGM = $scope.visits.cscPersonnel.accountGM._id;
  }

  if(inData.cscPersonnel.accountGM == null || inData.cscPersonnel.accountGM == undefined)
  {
    inData.cscPersonnel.accountGM = null;
  }

  if(inData.cscPersonnel.industryExec != null || inData.cscPersonnel.industryExec != undefined)
  {
    inData.cscPersonnel.industryExec = $scope.visits.cscPersonnel.industryExec._id;
  }

  if(inData.cscPersonnel.industryExec == null || inData.cscPersonnel.industryExec == undefined)
  {
    inData.cscPersonnel.industryExec = null;
  }

  if(inData.cscPersonnel.globalDelivery != null || inData.cscPersonnel.globalDelivery != undefined)
  {
    inData.cscPersonnel.globalDelivery = $scope.visits.cscPersonnel.globalDelivery._id;
  }

  if(inData.cscPersonnel.globalDelivery == null || inData.cscPersonnel.globalDelivery == undefined)
  {
    inData.cscPersonnel.globalDelivery = null;
  }

  if(inData.cscPersonnel.cre != null || inData.cscPersonnel.cre != undefined)
  {
    inData.cscPersonnel.cre = $scope.visits.cscPersonnel.cre._id;
  } 

  if(inData.cscPersonnel.cre == null || inData.cscPersonnel.cre == undefined)
  {
    inData.cscPersonnel.cre = null;
  }

  if(inData.anchor!=null || inData.anchor != undefined)
  {
    inData.anchor = $scope.visits.anchor._id;
  }

  if(inData.anchor==null || inData.anchor == undefined)
  {
    inData.anchor = null;
  }

  if(inData.secondaryVmanager!=null || inData.secondaryVmanager!=undefined)
  {
    inData.secondaryVmanager = $scope.visits.secondaryVmanager._id;
  }

  if(inData.secondaryVmanager==null || inData.secondaryVmanager==undefined)
  {
    inData.secondaryVmanager = null;
  }

  if(inData.feedbackTmpl!=null || inData.feedbackTmpl!=undefined)
  {
    inData.feedbackTmpl = $scope.visits.feedbackTmpl._id;
  }  

  if(inData.feedbackTmpl==null || inData.feedbackTmpl==undefined)
  {
    inData.feedbackTmpl = null;
  }  

  if(inData.sessionTmpl!=null || inData.sessionTmpl!=undefined)
  {
    inData.sessionTmpl = $scope.visits.sessionTmpl._id;;
  }  

  if(inData.sessionTmpl==null || inData.sessionTmpl==undefined)
  {
    inData.sessionTmpl = null;
  }  
      // console.log($scope.keynotes);
      // console.log($scope.visits.keynote);
      // inData.keynote = $scope.visits.keynote;
      inData.keynote = $scope.keynotes;
      // console.log($scope.rejectValue);
      // if ($scope.rejectValue == true) {
        // inData.status= "rejected";
        // growl.info(parse("Rejected the visit"));
      // }else
      // inData.status=$scope.visits.status;
      // console.log(inData.status);
      inData.comments = $scope.myData;
      $scope.commentsData = [];
      // console.log(rejectReason);

      // inData.rejectReason = rejectReason;
            // console.log($scope.rejectValue);
      // if ($scope.rejectValue == true) {
        // inData.status= "rejected";
        inData.status = "re-submitted";
                // growl.info(parse("Rejected the visit"));
      // }else
      // inData.status=$scope.visits.status;
      console.log(inData);
      $http.put('/api/v1/secure/visits/'+$scope.visitid,inData).success(function(response) {
        console.log(response);
        $scope.nextTab($scope.visitid);
        // $scope.nextTab();
      });
      
      growl.info(parse("Rejected visit successfully: "+inData.title));
      

    })

  // $scope.rejectValue= true;
}

$scope.checkAvailability= function(ev){
  $http.get('/api/v1/secure/stats/visitstats').success(function(response) {
    // console.log(response);
    $scope.checkVisit= response;
    // console.log($scope.checkVisit);
    $mdDialog.show({
      templateUrl: '/public/mods/visits/vmanCheck.html',
      scope: $scope.$new(),
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true

    })
  })
}

$scope.saveoverallfeed=function(){
    // console.log($scope.overallfeedback);
    $http.get('/api/v1/secure/visits/'+$scope.visitid).success(function(response)
    {
      $scope.visits = response;
      var inData = $scope.visits;
      inData.client=$scope.visits.client._id;
      inData.createBy = $scope.visits.createBy._id;
      if(inData.cscPersonnel.salesExec != null || inData.cscPersonnel.salesExec != undefined)
      {
        inData.cscPersonnel.salesExec = $scope.visits.cscPersonnel.salesExec._id;
      }

      if(inData.cscPersonnel.salesExec == null || inData.cscPersonnel.salesExec == undefined)
      {
        inData.cscPersonnel.salesExec = null;
      }

      if(inData.cscPersonnel.accountGM != null || inData.cscPersonnel.accountGM != undefined)
      {
        inData.cscPersonnel.accountGM = $scope.visits.cscPersonnel.accountGM._id;
      }

      if(inData.cscPersonnel.accountGM == null || inData.cscPersonnel.accountGM == undefined)
      {
        inData.cscPersonnel.accountGM = null;
      }

      if(inData.cscPersonnel.industryExec != null || inData.cscPersonnel.industryExec != undefined)
      {
        inData.cscPersonnel.industryExec = $scope.visits.cscPersonnel.industryExec._id;
      }

      if(inData.cscPersonnel.industryExec == null || inData.cscPersonnel.industryExec == undefined)
      {
        inData.cscPersonnel.industryExec = null;
      }

      if(inData.cscPersonnel.globalDelivery != null || inData.cscPersonnel.globalDelivery != undefined)
      {
        inData.cscPersonnel.globalDelivery = $scope.visits.cscPersonnel.globalDelivery._id;
      }

      if(inData.cscPersonnel.globalDelivery == null || inData.cscPersonnel.globalDelivery == undefined)
      {
        inData.cscPersonnel.globalDelivery = null;
      }

      if(inData.cscPersonnel.cre != null || inData.cscPersonnel.cre != undefined)
      {
        inData.cscPersonnel.cre = $scope.visits.cscPersonnel.cre._id;
      } 

      if(inData.cscPersonnel.cre == null || inData.cscPersonnel.cre == undefined)
      {
        inData.cscPersonnel.cre = null;
      }

      if(inData.anchor!=null || inData.anchor != undefined)
      {
        inData.anchor = $scope.visits.anchor._id;
      }

      if(inData.anchor==null || inData.anchor == undefined)
      {
        inData.anchor = null;
      }

      if(inData.secondaryVmanager!=null || inData.secondaryVmanager!=undefined)
      {
        inData.secondaryVmanager = $scope.visits.secondaryVmanager._id;
      }

      if(inData.secondaryVmanager==null || inData.secondaryVmanager==undefined)
      {
        inData.secondaryVmanager = null;
      }

      if(inData.feedbackTmpl!=null || inData.feedbackTmpl!=undefined)
      {
        inData.feedbackTmpl = $scope.visits.feedbackTmpl._id;
      }  

      if(inData.feedbackTmpl==null || inData.feedbackTmpl==undefined)
      {
        inData.feedbackTmpl = null;
      }  

      if(inData.sessionTmpl!=null || inData.sessionTmpl!=undefined)
      {
        inData.sessionTmpl = $scope.visits.sessionTmpl._id;;
      }  

      if(inData.sessionTmpl==null || inData.sessionTmpl==undefined)
      {
        inData.sessionTmpl = null;
      }  
      // console.log($scope.keynotes);
      // console.log($scope.visits.keynote);
      // inData.status = "re-submitted";
      inData.keynote = $scope.keynotes;

      inData.comments = $scope.myData;
      $scope.commentsData = [];
      // console.log($scope.j);

      inData.overallfeedback = $scope.j;
      // console.log(inData);
      $http.put('/api/v1/secure/visits/'+$scope.visitid,inData).success(function(response) {
        // console.log(response);
      });
      
      growl.info(parse("Overall Feedback submitted successfully for visit: "+inData.title));
      $location.path("visits/list"); 
    }) 
}
$scope.closeNoteTipSTreject=function(){
  $scope.closeNoteTipReject= false;
}

$scope.reject=function(rejectReason){
  // console.log(rejectReason);
  $http.get('/api/v1/secure/visits/'+$scope.visitid).success(function(response)
  {
    // console.log(rejectReason);

    if (rejectReason!= undefined) {
      // console.log(rejectReason);

      $scope.visits = response;
      var inData = $scope.visits;
      inData.client=$scope.visits.client._id;
      inData.createBy = $scope.visits.createBy._id;
      if(inData.cscPersonnel.salesExec != null || inData.cscPersonnel.salesExec != undefined)
      {
        inData.cscPersonnel.salesExec = $scope.visits.cscPersonnel.salesExec._id;
      }

      if(inData.cscPersonnel.salesExec == null || inData.cscPersonnel.salesExec == undefined)
      {
        inData.cscPersonnel.salesExec = null;
      }

      if(inData.cscPersonnel.accountGM != null || inData.cscPersonnel.accountGM != undefined)
      {
        inData.cscPersonnel.accountGM = $scope.visits.cscPersonnel.accountGM._id;
      }

      if(inData.cscPersonnel.accountGM == null || inData.cscPersonnel.accountGM == undefined)
      {
        inData.cscPersonnel.accountGM = null;
      }

      if(inData.cscPersonnel.industryExec != null || inData.cscPersonnel.industryExec != undefined)
      {
        inData.cscPersonnel.industryExec = $scope.visits.cscPersonnel.industryExec._id;
      }

      if(inData.cscPersonnel.industryExec == null || inData.cscPersonnel.industryExec == undefined)
      {
        inData.cscPersonnel.industryExec = null;
      }

      if(inData.cscPersonnel.globalDelivery != null || inData.cscPersonnel.globalDelivery != undefined)
      {
        inData.cscPersonnel.globalDelivery = $scope.visits.cscPersonnel.globalDelivery._id;
      }

      if(inData.cscPersonnel.globalDelivery == null || inData.cscPersonnel.globalDelivery == undefined)
      {
        inData.cscPersonnel.globalDelivery = null;
      }

      if(inData.cscPersonnel.cre != null || inData.cscPersonnel.cre != undefined)
      {
        inData.cscPersonnel.cre = $scope.visits.cscPersonnel.cre._id;
      } 

      if(inData.cscPersonnel.cre == null || inData.cscPersonnel.cre == undefined)
      {
        inData.cscPersonnel.cre = null;
      }

      if(inData.anchor!=null || inData.anchor != undefined)
      {
        inData.anchor = $scope.visits.anchor._id;
      }

      if(inData.anchor==null || inData.anchor == undefined)
      {
        inData.anchor = null;
      }

      if(inData.secondaryVmanager!=null || inData.secondaryVmanager!=undefined)
      {
        inData.secondaryVmanager = $scope.visits.secondaryVmanager._id;
      }

      if(inData.secondaryVmanager==null || inData.secondaryVmanager==undefined)
      {
        inData.secondaryVmanager = null;
      }

      if(inData.feedbackTmpl!=null || inData.feedbackTmpl!=undefined)
      {
        inData.feedbackTmpl = $scope.visits.feedbackTmpl._id;
      }  

      if(inData.feedbackTmpl==null || inData.feedbackTmpl==undefined)
      {
        inData.feedbackTmpl = null;
      }  

      if(inData.sessionTmpl!=null || inData.sessionTmpl!=undefined)
      {
        inData.sessionTmpl = $scope.visits.sessionTmpl._id;;
      }  

      if(inData.sessionTmpl==null || inData.sessionTmpl==undefined)
      {
        inData.sessionTmpl = null;
      }  
      // console.log($scope.keynotes);
      // console.log($scope.visits.keynote);
      // inData.keynote = $scope.visits.keynote;
      inData.keynote = $scope.keynotes;
      // console.log($scope.rejectValue);
      // if ($scope.rejectValue == true) {
        // inData.status= "rejected";
        // growl.info(parse("Rejected the visit"));
      // }else
      // inData.status=$scope.visits.status;
      // console.log(inData.status);
      inData.comments = $scope.myData;
      $scope.commentsData = [];
      // console.log(rejectReason);

      inData.rejectReason = rejectReason;
            // console.log($scope.rejectValue);
      // if ($scope.rejectValue == true) {
        inData.status= "rejected";
        // growl.info(parse("Rejected the visit"));
      // }else
      // inData.status=$scope.visits.status;
      // console.log(inData);
      $http.put('/api/v1/secure/visits/'+$scope.visitid,inData).success(function(response) {
        // console.log(response);
      });

      $http.get('/api/v1/secure/email/'+ $scope.visitid +'/rejectvisitbyadmin').success(function(response) {
               // console.log(response);
      });
      
      growl.info(parse("Rejected visit successfully: "+inData.title));
      $location.path("visits/list"); 
    }else
    {
      $scope.closeNoteTipReject= true;
        // console.log("im here");
        $scope.err= "Please mention reasons for  rejecting the visit ..!!";
      }
    })

  // $scope.rejectValue= true;
}

$scope.checkAvailability= function(ev){
  $http.get('/api/v1/secure/stats/visitstats').success(function(response) {
    // console.log(response);
    $scope.checkVisit= response;
    // console.log($scope.checkVisit);
    $mdDialog.show({
      templateUrl: '/public/mods/visits/vmanCheck.html',
      scope: $scope.$new(),
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true

    })
  })
}

$scope.saveoverallfeed=function(){
    // console.log($scope.overallfeedback);
    $http.get('/api/v1/secure/visits/'+$scope.visitid).success(function(response)
    {
      $scope.visits = response;
      var inData = $scope.visits;
      inData.client=$scope.visits.client._id;
      inData.createBy = $scope.visits.createBy._id;
      if(inData.cscPersonnel.salesExec != null || inData.cscPersonnel.salesExec != undefined)
      {
        inData.cscPersonnel.salesExec = $scope.visits.cscPersonnel.salesExec._id;
      }

      if(inData.cscPersonnel.salesExec == null || inData.cscPersonnel.salesExec == undefined)
      {
        inData.cscPersonnel.salesExec = null;
      }

      if(inData.cscPersonnel.accountGM != null || inData.cscPersonnel.accountGM != undefined)
      {
        inData.cscPersonnel.accountGM = $scope.visits.cscPersonnel.accountGM._id;
      }

      if(inData.cscPersonnel.accountGM == null || inData.cscPersonnel.accountGM == undefined)
      {
        inData.cscPersonnel.accountGM = null;
      }

      if(inData.cscPersonnel.industryExec != null || inData.cscPersonnel.industryExec != undefined)
      {
        inData.cscPersonnel.industryExec = $scope.visits.cscPersonnel.industryExec._id;
      }

      if(inData.cscPersonnel.industryExec == null || inData.cscPersonnel.industryExec == undefined)
      {
        inData.cscPersonnel.industryExec = null;
      }

      if(inData.cscPersonnel.globalDelivery != null || inData.cscPersonnel.globalDelivery != undefined)
      {
        inData.cscPersonnel.globalDelivery = $scope.visits.cscPersonnel.globalDelivery._id;
      }

      if(inData.cscPersonnel.globalDelivery == null || inData.cscPersonnel.globalDelivery == undefined)
      {
        inData.cscPersonnel.globalDelivery = null;
      }

      if(inData.cscPersonnel.cre != null || inData.cscPersonnel.cre != undefined)
      {
        inData.cscPersonnel.cre = $scope.visits.cscPersonnel.cre._id;
      } 

      if(inData.cscPersonnel.cre == null || inData.cscPersonnel.cre == undefined)
      {
        inData.cscPersonnel.cre = null;
      }

      if(inData.anchor!=null || inData.anchor != undefined)
      {
        inData.anchor = $scope.visits.anchor._id;
      }

      if(inData.anchor==null || inData.anchor == undefined)
      {
        inData.anchor = null;
      }

      if(inData.secondaryVmanager!=null || inData.secondaryVmanager!=undefined)
      {
        inData.secondaryVmanager = $scope.visits.secondaryVmanager._id;
      }

      if(inData.secondaryVmanager==null || inData.secondaryVmanager==undefined)
      {
        inData.secondaryVmanager = null;
      }

      if(inData.feedbackTmpl!=null || inData.feedbackTmpl!=undefined)
      {
        inData.feedbackTmpl = $scope.visits.feedbackTmpl._id;
      }  

      if(inData.feedbackTmpl==null || inData.feedbackTmpl==undefined)
      {
        inData.feedbackTmpl = null;
      }  

      if(inData.sessionTmpl!=null || inData.sessionTmpl!=undefined)
      {
        inData.sessionTmpl = $scope.visits.sessionTmpl._id;;
      }  

      if(inData.sessionTmpl==null || inData.sessionTmpl==undefined)
      {
        inData.sessionTmpl = null;
      }  
      // console.log($scope.keynotes);
      // console.log($scope.visits.keynote);
      // inData.keynote = $scope.visits.keynote;
      inData.keynote = $scope.keynotes;

      inData.comments = $scope.myData;
      $scope.commentsData = [];
      // console.log($scope.j);

      inData.overallfeedback = $scope.j;
      // console.log(inData);
      $http.put('/api/v1/secure/visits/'+$scope.visitid,inData).success(function(response) {
        // console.log(response);
      });
      
      growl.info(parse("Overall Feedback submitted successfully for visit: "+inData.title));
      $location.path("visits/list"); 
    })
}
});
}])

//Autocompleate - Directive
visitsApp.directive("feedback", ["FeedbackService", "$timeout", function (FeedbackService,$timeout) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          FeedbackService.search(searchTerm.term).then(function (autocompleteResults) {
            if(autocompleteResults == undefined || autocompleteResults == ''){
              scope.autoFailfed=true;
              scope.feedbackNotFound="Feedback Template not found!!!"
              // $timeout(function () { scope.feedbackNotFound = ''; }, 5000);
            }else{
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
          scope.feedback= selectedItem.item.value;
          scope.feedbackId= selectedItem.item.id;
          scope.autoFailfed=false;
          scope.$apply();
          event.preventDefault();
        }
      });
}
};
}]);
//Autocompleate - Directive
visitsApp.directive("session", ["SessionService", "$timeout", function (SessionService,$timeout) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          SessionService.search(searchTerm.term).then(function (autocompleteResults) {
            if(autocompleteResults == undefined || autocompleteResults == ''){
              scope.autoFailsec=true;
              scope.sessionNotFound="Session Template not found!!!"
            }else{
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
          scope.session= selectedItem.item.value;
          scope.sessionId= selectedItem.item.id;
          scope.autoFailsec=false;
          scope.$apply();
          event.preventDefault();
        }
      });
    }
  };
}]);
//Autocompleate - Directive
visitsApp.directive("keynote", ["KeynoteService", "$timeout", function (KeynoteService,$timeout) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          KeynoteService.search(searchTerm.term).then(function (autocompleteResults) {
            if(autocompleteResults == undefined || autocompleteResults == ''){
              scope.autoFailkey=true;
              scope.keynoteNotFound="keynote not found!!!"
            }else{
              response($.map(autocompleteResults, function (autocompleteResult) {
                return {
                  label: autocompleteResult.title,
                  value: autocompleteResult._id,
                  id: autocompleteResult._id
                }
              }))
            }
          });
        },
        minLength: 4,
        select: function (event, selectedItem) {
          // scope.keynoteDef.note= selectedItem.item.label;
          scope.keynoteDef.noteName= selectedItem.item.label;
          scope.keynoteId= selectedItem.item.id;
          scope.autoFailkey=false;
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

// visitsApp.filter('reverse', function() {
//   return function(items) {
//     return items.slice().reverse();
//   };
// });