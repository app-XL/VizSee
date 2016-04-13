var app =angular.module("locator", []);
var app= angular.module("locator");


app.directive("locationPicker", ["$log", "location", "reverseGeocoder", function(e, o, t) {
    return {
        restrict: "E",
        require: "?ngModel",
        scope: {},
        templateUrl: "location-picker/location-picker.html",
        link: function(n, a, r, i) {
            n.limitTo = n.$eval(r.limitTo) || 15, o.ready(function() {
                t.geocode(o.current).then(function(e) {
                    n.options = e
                }, e.error)
            }), n.pickLocation = function(e) {
                var e = {
                    latitude: o.current.latitude,
                    longitude: o.current.longitude,
                    name: e.address_components[0].short_name,
                    description: e.formatted_address
                };
                i.$setViewValue(e)
            }
        }
    }
}]), angular.module("locator").factory("location", [function() {
    var e = {
            isReady: !1,
            gpsAvailable: !0
        },
        o = [];
    return e.get = function(o, t) {
        navigator.geolocation.getCurrentPosition(function(t) {
            e.gpsAvailable = !0, e.current = {
                latitude: t.coords.latitude,
                longitude: t.coords.longitude
            }, e.isReady = !0, e.onReadyTasks(), o()
        }, function(o) {
            e.gpsAvailable = !1, console.log("code: " + o.code + " message: " + o.message), t()
        })
    }, e.onReadyTasks = function() {
        for (var e = o.length - 1; e >= 0; e--) o[e]()
    }, e.ready = function(t) {
        e.isReady ? t() : o.push(t)
    }, e
}]), angular.module("locator").factory("reverseGeocoder", ["$document", "$q", function(e, o) {
    var t = {};
    return e.ready(function() {
        t.geocoder = new google.maps.Geocoder
    }), t.geocode = function(e) {
        var n = o.defer();
        if (e) var a = new google.maps.LatLng(e.latitude, e.longitude);
        else n.reject("You need to provide LatLng");
        return t.geocoder.geocode({
            latLng: a
        }, function(e, o) {
            return o !== google.maps.GeocoderStatus.OK ? (n.reject("No locations found"), void 0) : (n.resolve(e), void 0)
        }), n.promise
    }, t
}]);
