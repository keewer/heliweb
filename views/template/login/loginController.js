angular.module('app')
	.controller('loginController', ['$scope', function ($scope) {
		
		$scope.userInfo = {
			phone: '',
			pwd: '',
			code: ''
		};

		$scope.codeText = '10000';

	}])