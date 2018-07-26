angular.module('app')
	.controller('personController', ['$scope', 'API', function ($scope, API) {
		
		//权限
		$scope.authority = 1;

		$scope.userInfo = {
			username: '阿里扎',
			position: '总经理',
			phone: '18889209751',
			idcard: '440883199703239087',
			address: '广州市海珠区'
		};

		$scope.pwdInfo = {
			oldpwd: '',
			newpwd: '',
			renewpwd: ''
		};

	}])