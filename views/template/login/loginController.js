angular.module('app')
	.controller('loginController', ['$scope', '$state', function ($scope, $state) {
		
		$scope.userInfo = {
			phone: '',
			pwd: '',
			code: ''
		};

		$scope.codeText = '10000';

		$scope.login = function () {
			console.log('login');
			$state.go('home.usermanage');
		} 

	}])