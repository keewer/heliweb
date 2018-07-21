angular.module('app')
	.directive('loading', [function () {
		return {

			restrict: 'E',
			replace: true,
			templateUrl: 'directive/loading/loading.html'

		};
	}])