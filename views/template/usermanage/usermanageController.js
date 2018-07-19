angular.module('app')
	.controller('usermanageController', ['$scope', function ($scope) {
		console.log('manageController');

		$scope.userList = [];

		for (var i = 0; i < 10; i++) {
			var o = {
				name: '刘亦菲' + (i + 1),
				phone: '1321121221',
				status: '正常',
				address: '广州市',
				loginCount: 19,
				lastLoginTime: '2018-12-11 23:43:32'
			};

			$scope.userList.push(o);

		}


	}])