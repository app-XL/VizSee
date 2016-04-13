<div class="row" ng-controller="profileControllerMain">
<div><h1>Select Profile Photo</h1></div>
<hr style="height:1px;border:blue;background-color:#999999">
    <div>
        <div style="margin-left:2cm" ngf-drop ng-model="picFile" ngf-pattern="image/*" class="cropArea">
            <img-crop  image="picFile  | ngfDataUrl"                 
            result-image="croppedDataUrl" ng-init="croppedDataUrl=''">
            </img-crop>
        </div>   
        <br> 
        <button class="btn btn-info" style="margin-left:8.5cm" ngf-select ng-model="picFile" accept="image/*">Select a photo from your computer</button>
        <div>
            <br>
            <hr style="height:1px;border:blue;background-color:#999999">
        </div>
        <button class="btn btn-primary" ng-click="send(croppedDataUrl) && closeAll()" >Set as profile photo</button>
        <button class="btn btn-danger" ng-click="cancel()" >Cancel</button>
</div>          