
var holidayPack = angular.module('holidayPack', []);

function mainController($scope, $http) {
    // $scope.formData = {};
    // var sampleData=[{"title":"AA"},{"title":"BB"},{"title":"CC"},{"title":"DD"},{"title":"EE"}];
    //         $scope.dealData = sampleData;
    $http.get('/api/getallDeal')
    	.success(function(data) {
            console.log('Get data from data base',data.data);
            // var sampleData=[{"title":"AA"},{"title":"BB"},{"title":"CC"},{"title":"DD"},{"title":"EE"}];
            $scope.dealData = data.data;
    	})
    	.error(function(data) {
    		console.log('Error: ' + data.message);
    	});

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