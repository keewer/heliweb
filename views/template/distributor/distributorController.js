angular.module('app')
	.controller('distributorController', ['$scope', '$stateParams', '$state', '$cookies', '$compile', '$timeout', 'API', 'TIP', function ($scope, $stateParams, $state, $cookies, $compile, $timeout, API, TIP) {

		console.log('$stateParams ==> ', $stateParams);

		$scope.authority = $stateParams.auth;

		$scope.userInfo = {
			phone: '',
			pwd: '',
			repwd: '',
			username: '',
			idcard: '',
			address: ''
		};

		$scope.search = {
			user: ''
		}

		$scope.isSearch = false;

		

		$scope.pageDataList = [];

		
	}])