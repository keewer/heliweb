angular.module('app')
	.controller('loginController', ['$scope', '$state', function ($scope, $state) {
		
		//权限
		var authority = 1;

		$scope.userInfo = {
			phone: '',
			pwd: '',
			code: ''
		};

		$scope.codeText = '10000';

		$scope.login = function () {
			console.log('login');
			var stateName = authority == 0 || authority == 1 ? 'home.usermanage' : 'home.distributor';
			$state.go(stateName);
		} 

	}])