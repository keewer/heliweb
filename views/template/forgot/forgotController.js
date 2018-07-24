angular.module('app')
	.controller('forgotController', ['$scope', 'API', function ($scope, API) {
		$scope.userInfo = {
			phone: '',
			pwd: '',
			repwd: '',
			code: ''
		};

		$scope.codeText = '10000';

	}])