var holidayPack = angular.module('holidayPack', ['ngRoute']);

holidayPack.config(function($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "/public/home.html"
                // controller: "homeClt"
        })
        .when("/blue", {
            templateUrl: "blue.htm"
        });
});
// holidayPack.directive('jque', function() {
//     console.log('Called directive');
//     return {
//         restrict: 'A',
//         link: "js/vendor/modernizr-2.8.3.min.js"
//     };
// });
holidayPack.controller('homeClt', function($scope, $http) {


})
holidayPack.controller('mainController', function($scope, $http) {
    //   $scope.dealData = [{ title: 'a' }, { title: 'a' }, { title: 'a' }, { title: 'a' }, { title: 'a' }, { title: 'a' }];
    // $http.get('/api/getDeparture')
    //     .success(function(data) {
    //         console.log('getDeparture', data.data);
    //         $scope.departure = data.data;
    //     })
    //     .error(function(data) {
    //         console.log(data.message);
    //     })



    $scope.GetSearch = function(data) {
        var searchData = {
            date: data.date ? data.date : "",
            departure: data.depselect ? data.depselect.departure : "",
            destination: data.desselect ? data.desselect.destination : ""
        }
        console.log("seaarch data", data);
        console.log("searchData", searchData);

        $http.post('/api/getallDeal', searchData)
            .success(function(data) {
                console.log('data', data);
                if (data.status) {
                    console.log('ok display me');
                    $scope.dealData = data.data;
                } else {
                    console.log('Something gone wrong!', data.message);
                }
            })
            .error(function(data) {
                console.log('Error: ' + data.message);
            });
    };
    $scope.getDesti = function(data) {
        console.log('getDesti', data);
        var departure = data.departure;
        $scope.departureName = departure;
        $http.get('api/getDestination/' + data.departure)
            .success(function(data) {
                console.log('getDestination', data.data);
                $scope.destination = data.data;
            })
            .error(function(data) {
                console.log(data.message);
            })
    }
    $scope.GetallHolidayDeal = function(data) {
        var searchData = {
            date: data.date ? data.date : "",
            departure: data.depselect ? data.depselect.departure : "",
            destination: data.desselect ? data.desselect.destination : "",
            withCity: false
        }
        $http.post('/api/getallHolidayDeal', searchData)
            .success(function(data) {
                console.log('data', data);
                if (data.status) {
                    console.log('ok display me');
                    $scope.dealData = data.data;
                } else {
                    console.log('Something gone wrong!', data.message);
                }
            })
            .error(function(data) {
                console.log('Error: ' + data.message);
            });
    }
    var searchData = {
        departure: "Sydney",
        withCity: true
    }
    $http.post('/api/getallHolidayDeal', searchData)
        .success(function(data) {
            console.log('getallHolidayDeal', data);
            if (data.status) {
                console.log('ok display me');
                $scope.departure = data.city;
                $scope.dealData = data.data;
            } else {
                console.log('Something gone wrong!', data.message);
            }
        })
        .error(function(data) {
            console.log('Error: ' + data.message);
        });
    // Footer
    $scope.currentYear = new Date().getFullYear();
});