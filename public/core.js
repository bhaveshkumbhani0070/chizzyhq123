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
holidayPack.controller('homeClt', function($scope, $http) {


})
holidayPack.controller('mainController', function($scope, $http) {
    //   $scope.dealData = [{ title: 'a' }, { title: 'a' }, { title: 'a' }, { title: 'a' }, { title: 'a' }, { title: 'a' }];
    $http.get('/api/getDeparture')
        .success(function(data) {
            console.log('getDeparture', data.data);
            $scope.departure = data.data;
        })
        .error(function(data) {
            console.log(data.message);
        })

    $http.get('api/getDestination')
        .success(function(data) {
            console.log('getDestination', data.data);
            $scope.destination = data.data;
        })
        .error(function(data) {
            console.log(data.message);
        })

    $scope.GetSearch = function(data) {
        console.log("seaarch data", data);
        var searchData = {
            date: data.date,
            departure: data.depselect,
            destination: data.desselect
        }

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

    // Footer
    $scope.currentYear = new Date().getFullYear();
});