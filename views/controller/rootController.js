angular.module('app')
	.controller('rootController', ['$scope', '$state', function ($scope, $state) {
		$scope.goState = function (stateName, params) {
			$state.go(stateName, params);
		}

		$scope.openModal = function (id) {
			$(id).modal();
		}

	}])