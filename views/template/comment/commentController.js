angular.module('app')
	.controller('commentController', ['$scope', '$stateParams', function ($scope, $stateParams) {
		console.log($stateParams);
	}])