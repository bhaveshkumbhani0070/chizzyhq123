var holidayPack = angular.module('holidayPack', []);

function mainController($scope, $http) {
    $scope.storageResult = {
        "storageAccount": "Enable",
        "user": "sdcard",
        "pass": "sdcard",
        "wifiIP": "0",
        "ipAddr": "0",
        "accessMode": [
            { "name": "Local Storage", "status": "0" },
            { "name": "WiFi Storage", "status": "1" },
            { "name": "Internet Storage", "status": "0" }
        ]
    }

    //get Departure
    $http.get('/api/getDeparture')
        .success(function(data) {
            console.log('getDeparture', data.data);
            $scope.departure = data.data;
        })
        .error(function(data) {
            console.log(data.message);
        })
        ///api/getDestination

    $http.get('api/getDestination')
        .success(function(data) {
            console.log('getDestination', data.data);
            $scope.destination = data.data;
        })
        .error(function(data) {
            console.log(data.message);
        })

    $scope.submit = function(data) {
        console.log("seaarch data", data);
        var searchData = {
            date: data.date,
            departure: "Sydney",
            destination: "Port Douglas, Australia"
        }
        $http.post('/api/getallDeal', { data: searchData })
            .success(function(data) {
                //	$scope.formData = {}; // clear the form so our user is ready to enter another
                //	$scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}

// // when submitting the add form, send the text to the node API
// $scope.createTodo = function() {
// 	$http.post('/api/todos', $scope.formData)
// 		.success(function(data) {
// 			$scope.formData = {}; // clear the form so our user is ready to enter another
// 			$scope.todos = data;
// 			console.log(data);
// 		})
// 		.error(function(data) {
// 			console.log('Error: ' + data);
// 		});
// };

// // delete a todo after checking it
// $scope.deleteTodo = function(id) {
// 	$http.delete('/api/todos/' + id)
// 		.success(function(data) {
// 			$scope.todos = data;
// 		})
// 		.error(function(data) {
// 			console.log('Error: ' + data);
// 		});
// };