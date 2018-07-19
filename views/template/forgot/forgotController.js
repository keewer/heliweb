angular.module('app')
	.controller('forgotController', ['$scope', function ($scope) {
		$scope.userInfo = {
			phone: '',
			pwd: '',
			repwd: '',
			code: ''
		};

		$scope.codeText = '10000';
	}])