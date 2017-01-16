'use strict';

var clientsApp = angular.module('clients');

clientsApp.controller('clientsControllerMain', ['$scope','appUserService', '$http', '$routeParams', '$location', 'growl','$mdDialog', '$mdMedia', '$timeout','Upload','$rootScope','appInfoService','PagerService',
  function($scope ,appUserService, $http, $routeParams, $location, growl,$mdDialog,$mdMedia,$timeout,Upload,$rootScope, appInfoService, PagerService) {
    appInfoService.appInfo().then(function(info){
      appUserService.activeUser().then(function(user){
    //console.log("thsis"+user._id);
    $scope.activeUser = user;

    var id = $routeParams.id;
  // AUtomatically swap between the edit and new mode to reuse the same frontend form
  $scope.mode=(id==null? 'add': 'edit');
  $scope.hideFilter = true;

  $scope.clientModule=true;
  $scope.showAvatar =false;
  $scope.parentClient = true;
  $scope.childClient = true;
  $scope.industryClient = true;
  $scope.regionDataClient = true;
  $scope.err="";
  $scope.closeNoteTipSch= false;
  $scope.adminShow= false; 
  $scope.closeNoteTipNote= true;

  // $scope.regionClient = true;
  //regions - Http get for drop-down
  $http.get('/api/v1/secure/lov/regions').success(function(response) {
    $scope.regions=response.values;
  });
  $http.get('/api/v1/secure/lov/vertical').success(function(response) {
    $scope.vertical = response.values;
  });

  $scope.isSaving=false;

  $scope.groupMember = $scope.activeUser.groups;
  if ($scope.activeUser.groups.includes("admin") === true ) {
    $scope.adminShow= true; 
    $scope.isSaving= false; 
  }
  else if ($scope.activeUser.groups.includes("vManager") === true) {
    $scope.isSaving= true; 
  }



  var refresh = function(start) {
    var clientListUrl = '/api/v1/secure/clients';
    clientListUrl += "?start=" + start + '&size='+info.UI.pagination.size;
    
    $http.get(clientListUrl).success(function(response) {

      $scope.clientsList = response;
      $scope.clients = "";

      switch($scope.mode)    {
       case "add":
       $scope.clients = "";
       break;

       case "edit":
       $scope.parentClient = false;
       $scope.childClient = false;
       $scope.industryClient = false;
       // $scope.regionClient = false;
       $scope.clients = $http.get('/api/v1/secure/clients/id/' + id).success(function(response){
        $scope.clients = response;
        $scope.parentSelected= $scope.clients.name;
        $scope.childSelected= $scope.clients.subName;
        
        if($scope.clients.sfdcid == "null"|| $scope.clients.sfdcid == null ) {
          $scope.clients.sfdcid = "";
        }
        // $scope.industrySelected= $scope.clients.industry;
        // $scope.regionsSelected= $scope.clients.regions;

        // $scope.selected-object= $scope.clients.name;

        // $scope.selectedClient= $scope.clients.name;
        // console.log($scope.clients)
        if (response.logo!=undefined) {
          $scope.showAvatar = true
          $scope.avatar= response.logo;
        }
        else $scope.showAvatar = false;

        if (response.cscPersonnel!=undefined) {
          $scope.cscPersonnel=response.cscPersonnel;

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

    // reformat date fields to avoid type compability issues with <input type=date on ng-model
    $scope.clients.startDate = new Date($scope.clients.createdOn);
  });

      } // switch scope.mode ends
    }); // get client call back ends
  }; // refresh method ends

  refresh($scope.start);


      $scope.listOfClientCount = function(page) 
      {
        $http.get('/api/v1/secure/clients/find/count').success(function(data) {
          $scope.clientCount = data.totalCount;
          if (data != null) {
                // var $scope = this;

                $scope.dummyItems = _.range(0, $scope.clientCount); // dummy array of items to be paged
                $scope.pager = {};
                $scope.setPage = setPage;

                if (page == undefined) {
                  initController();

                  function initController() {
                        // initialize to page 1
                        $scope.setPage(1);
                      }
                    }

                    if (page != undefined) {
                      $scope.setPage(page);
                    }

                    function setPage(page) {
                      if (page < 1 || page > $scope.pager.totalPages) {
                        return;
                      }

                    // get pager object from service
                    $scope.pager = PagerService.GetPager($scope.dummyItems.length, page,info.UI.pagination.size);
                    $scope.vmPager = $scope.pager;

                    $scope.start = ($scope.pager.currentPage - 1);
                    $scope.startPage = $scope.start * info.UI.pagination.size;
                    $scope.clientSize = $scope.startPage + info.UI.pagination.size;
                    // get current page of items
                    $scope.items = $scope.dummyItems.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
                    $scope.$scopeItems = $scope.items;
                    refresh($scope.start);
                  }
                }
              }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                  growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
              }
            });
      }

      $scope.listOfClientCount();



  $scope.closeNoteTipST=function(){
    $scope.closeNoteTipSch= false;
  }
  $scope.closeNoteTipNotefun=function(){
    $scope.closeNoteTipNote= false;
  }

  $scope.save = function(){
    var inDataClient = $scope.clients;
    if(inDataClient.name!=null)
    {
      inDataClient.name = $scope.clients.name;
    }

    if(inDataClient.name==null)
    {
      inDataClient.name = $scope.parentClientString;
    }

    if(inDataClient.subName!=null)
    {
      inDataClient.subName = $scope.clients.subName;
    }

    if(inDataClient.subName==null)
    {
      inDataClient.subName = $scope.childClientString;
    }

    if(inDataClient.regions!=null)
    {
      inDataClient.regions = $scope.clients.regions;
    }

    $http.get('/api/v1/secure/clients/find?query=' +inDataClient.name +"&subQuery="+inDataClient.subName+"&regions="+inDataClient.regions+"&id=").success(function(response) {
      console.log(response.id);
      $scope.responseId=response.id;
      if ($scope.responseId != null) {
        console.log($scope.responseId);
        $scope.closeNoteTipSch= true;
        console.log("im here");
        $scope.err= "This client already exists..!!";
      }
      else{
        console.log("im here yop in else no id so save");
        console.log($scope.responseId);

        switch($scope.mode){
          case "add":
          $scope.create();
          break;

          case "edit":
          $scope.update();
          break;
            } // end of switch scope.mode ends
            $location.path("clients/list");
          }

        })
    // console.log($scope.clients);
    // $location.path("clients/list");
  // }

  } // end of save method

  $scope.create = function() {
    var inData  = $scope.clients;
    if(inData.name!=null)
    {
      inData.name = $scope.clients.name;
    }

    if(inData.name==null)
    {
      inData.name = $scope.parentClientString;
    }

    if(inData.subName!=null)
    {
      inData.subName = $scope.clients.subName;
    }

    if(inData.subName==null)
    {
      inData.subName = $scope.childClientString;
    }

    if(inData.industry!=null)
    {
      inData.industry = $scope.clients.industry;
    }

    if(inData.industry==null)
    {
      inData.industry = $scope.industryClientString;
    }

    if(inData.regions!=null)
    {
      inData.regions = $scope.clients.regions;
    }

    if(inData.regions==null)
    {
      inData.regions = $scope.regionClientString;
    }

    if(inData.sfdcid != null)
    {
      inData.sfdcid = $scope.clients.sfdcid;
    }

    if(inData.sfdcid == null)
    {
      inData.sfdcid = "null";
    }
    if ($rootScope.user.groups.indexOf("admin") > -1 ) {
      inData.status="final";
    }else 
    inData.status="draft";

    if ($scope.avatar!=undefined) {
      inData.logo=$scope.avatar;}
      console.log(inData)
      var name = inData.name
      $http.post('/api/v1/secure/clients', inData).success(function(response) {
        refresh($scope.start);
        growl.info(parse("New client has been added – [%s]", htmlToPlaintext(name)));
      })
      .error(function(data, status){
        growl.error("Error adding client");
    }); // http post keynoges ends
  }; // create method ends

  function htmlToPlaintext(text) {
    console.log(text);
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }
  $scope.delete = function(clients) {
    var name = clients.name;
    $http.delete('/api/v1/secure/clients/' + clients._id).success(function(response) {
      refresh($scope.start);
      growl.info(parse("clients [%s]<br/>Deleted successfully", name));
    })
    .error(function(data, status){
      growl.error("Error deleting client");
    }); // http delete keynoges ends
  }; // delete method ends

  $scope.update = function() {
    // console.log($scope.cscPersonnel);
    if ($scope.cscPersonnel!=undefined) {
      $scope.cscPersonnel.salesExec = $scope.salesExecId;
      $scope.cscPersonnel.accountGM= $scope.accountGMId;
      $scope.cscPersonnel.industryExec = $scope.industryExecId;
      $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
      $scope.cscPersonnel.cre= $scope.creId;
      $scope.clients.cscPersonnel=$scope.cscPersonnel;
    }
    console.log($scope.clients);
    var inData  = $scope.clients;

    inData.logo=$scope.avatar;

    // if ($scope.parentClientString==null) 
    // {
    //   inData.name =$scope.clients.name;
    // }
    // else if ($scope.parentClientString!=null)  
    // {
    //   inData.name = $scope.parentClientString;
    // }
    // else inData.name = $scope.parentSelected;

    // if ($scope.childClientString==null) 
    // {
    //   inData.subName =$scope.clients.subName;
    // }
    // else if ($scope.childClientString!=null)  
    // {
    //   inData.subName = $scope.childClientString;
    // }
    // else inData.subName = $scope.childSelected;

    // if ($scope.indusrtyClientString==null) 
    // {
    //   inData.industry =$scope.clients.industry;
    // }
    // else if ($scope.industryClientString!=null)  
    // {
    //   inData.industry = $scope.industryClientString;
    // }
    // else inData.industry = $scope.industrySelected;

    if ($scope.clients.name!=null) 
    {
     inData.name = $scope.clients.name;
   }
   if ($scope.clients.name==null)  
   {
     inData.name = $scope.parentClientString;
   }
    // else client.name = $scope.parentSelected;

    if ($scope.clients.subName!=null) 
    {
      inData.subName =$scope.clients.subName;
    }
    if ($scope.clients.subName==null)  
    {
      inData.subName = $scope.childClientString;
    }
    // else client.subName = $scope.childSelected;

    if ($scope.clients.industry!=null) 
    {
      inData.industry =$scope.clients.industry;
    }
    if ($scope.clients.industry==null)  
    {
      inData.industry = $scope.industryClientString;
    }
    // else client.industry = $scope.industrySelected;

    if(inData.name == null)
    {
      inData.name = $scope.parentSelected;
    }

    if(inData.subName == null)
    {
      inData.subName = $scope.childSelected;
    }

    if(inData.industry == null)
    {
      inData.industry = $scope.industrySelected;
    }
    // if ($scope.clients.industry!=undefined) 
    //   {inData.industry =$scope.clients.industry;}
    // else inData.industry = $scope.industrySelected;

    // if ($scope.clients.regions!=undefined) 
    //   { inData.regions =$scope.clients.regions;}
    // else inData.regions = $scope.regionsSelected;

    console.log(inData);

    // console.log($scope.parentSelected+" "+$scope.childSelected+" "+$scope.industrySelected+" "+$scope.regionsSelected);
    
    // console.log(inData.cscPersonnel);
    $http.put('/api/v1/secure/clients/id/' + $scope.clients._id, inData).success(function(response) {
      refresh($scope.start);
      console.log($scope.clients.name);
      console.log($scope.parentSelected);
      if ($scope.parentClientString==null) 
      {
        growl.info(parse("client [%s]<br/>Edited successfully", $scope.parentSelected));
      }
      else if ($scope.parentClientString!=null)  
      {
        growl.info(parse("client [%s]<br/>Edited successfully", $scope.parentClientString));
      }
      else
        growl.info(parse("client [%s]<br/>Edited successfully", $scope.parentSelected));

    })
    .error(function(data, status){
      growl.error("Error updating client");
    }); // http put keynoges ends
  }; // update method ends

  $scope.cancel = function() {

    $scope.clients="";
    $location.path("clients/list");
  }

  $scope.addClientLogo = function(ev) {
    $mdDialog.show({
      templateUrl: '/public/mods/clients/clientLogoDialog.html',
      scope: $scope.$new(),
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true

    })
    // .then(function(answer) {
    //   $scope.status = 'You said the information was "' + answer + '".';
    // }, function() {
    //   $scope.status = 'You cancelled the dialog.';
    // });

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

$scope.parentClientChanged = function(str) {
  $scope.parentClientString = str;

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
  $scope.industry = str;
  console.log($scope.industry)
  if($scope.industry!=null || $scope.industry!="")
  {
    $scope.industryClient = false;
    $scope.errindustryMsg = "";
  }

  if($scope.industry==null || $scope.industry=="" || $scope.industry == undefined)
  {
    $scope.industryClient = true;
    $scope.errindustryMsg = "Industry is Mandatory field";
  }
} 

  // $scope.regionClientChanged = function(str) {
  //   $scope.regions = str;
  //   console.log($scope.regions)

  //   if($scope.regions!=null || $scope.regions!="")
  //   {
  //     $scope.regionClient = false;
  //     $scope.errregionMsg = "";
  //   }

  //   if($scope.regions==null || $scope.regions=="" || $scope.regions == undefined)
  //   {
  //     $scope.regionClient = true;
  //     $scope.errregionMsg = "Region is Mandatory field";
  //   }
  // } 
});
});
}]);﻿ // controller ends


//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
clientsApp.filter('startFrom', function() {
    return function(input, start) {
      if(input!=undefined)
      {
        start = +start; //parse to int
        return input.slice(start);
      }
    }
}); 