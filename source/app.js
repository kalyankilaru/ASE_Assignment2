/**
 * Created by USER on 28-01-2017.
 */

var webApp = angular.module('webApp', ['ngRoute']);

webApp.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: 'Login.html',
            controller: 'loginCtrl'
        })
        .when("/Register", {
            templateUrl: 'Register.html',
            controller: 'registerCtrl'
        })
        .when("/Home", {
            templateUrl: 'Home.html',
            controller: 'googlemapoutput'
        });

});

webApp.controller('loginCtrl', function ($scope, $location) {

    $scope.validate = function (username, password) {

        if (typeof(Storage) !== "undefined") {


            if (username == localStorage.getItem("username")) {
                if (password == localStorage.getItem("password")) {

                    $location.path("/Home");
                }
                else {
                    $scope.loginerror = "Invalid Username or Password";
                }
            }
            else {

                if (username == null || password == null) {
                    $scope.loginerror = "Please enter the credentials";
                }
                else {
                    $scope.loginerror = "Invalid Username or password";
                }
            }
        } else {
            // Sorry! No Web Storage support..
        }
    }

    $scope.clicked = function () {

        $location.path("/Register");
    }

});


webApp.controller('registerCtrl', function ($scope,$location) {
    $scope.saveCredentials = function (username, password) {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        $location.path("/Home");
    }

});




webApp.controller('googlemapoutput', function ($scope) {

    var map;
    var mapOptions;
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
    });
    var directionsService = new google.maps.DirectionsService();

    $scope.initialize = function () {
        var pos = new google.maps.LatLng(0, 0);
        var mapOptions = {
            zoom: 3,
            center: pos
        };

        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    };
    $scope.calcRoute = function () {
        var end = document.getElementById('endlocation').value;
        var start = document.getElementById('startlocation').value;

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                console.log(status);
            }

        });
    };

    google.maps.event.addDomListener(window, 'load', $scope.initialize());


});

webApp.directive('googlePlace', directiveFunction);

directiveFunction.$inject = ['$rootScope'];

function directiveFunction($rootScope) {
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            details: '=?'
        },
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    scope.details = scope.gPlace.getPlace();
                    model.$setViewValue(element.val());
                    $rootScope.$broadcast('place_changed', scope.details);
                });
            });
        }
    };
}
