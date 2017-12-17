var holidayPack = angular.module('holidayPack', []);

function mainController($scope, $http) {

    // $http.get('/api/getallDeal')
    //     .success(function(data) {
    //         console.log('Get data from data base', data.data);
    //         // var sampleData=[{"title":"AA"},{"title":"BB"},{"title":"CC"},{"title":"DD"},{"title":"EE"}];
    //         $scope.dealData = data.data;
    //     })
    //     .error(function(data) {
    //         console.log('Error: ' + data.message);
    //     });
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
    $scope.destination = [{ destination: "A" }, { destination: "B" }, { destination: "C" }];

    // $http.get('api/getDestination')
    //     .success(function(data) {
    //         console.log('getDestination', data.data);
    //         $scope.destination = data.data;
    //     })
    //     .error(function(data) {
    //         console.log(data.message);
    //     })

    $scope.submit = function(data) {
        console.log('city', $scope.city);
        console.log('dest', $scope.dest);
        console.log("seaarch data", data);
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

}