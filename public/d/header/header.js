angular.module('header', []).directive("header", function() {
  return {
     scope: {
     
      showprofile:'@',
      icon:'@',
      title1:'@',
      title2:'@',
      query:'='
          },
          restrict:'EA',
     transclude: true,
    templateUrl: "/public/d/header/header.html",

     link : function(scope,element,attrs,ctrl,transclude)
    {
      transclude(scope.$parent, function(clone,scope) { 
      if(attrs.query!='query')       
        scope.query=attrs.query;
      });
      scope.getTemplate = function(){
      var showprofile= scope.showprofile.toLowerCase();

       if(showprofile === "true")
       {
        return "/public/d/header/profile.html";
      }
    else{
        return "/public/d/header/title.html";
      }
     

  }  
  }

  };


});