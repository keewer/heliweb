angular.module('app')
	.controller('orderController', ['$scope', '$state', function ($scope, $state) {

		//权限
		$scope.authority = 3;

		$scope.price = 100;

		$scope.userInfo = {
			phone: '',
			count: '',
			receive: '',
			address: ''
		};

		$scope.showModal = function () {
			$('#newOrder').modal();
		}

		$scope.confirmOrder = function () {
			$('#newOrder').modal('hide');
			$('#newOrder input').val('');
			$('.modal-backdrop').remove();
			$state.go('home.editorder');
		}
	
		/**
		* 0: 待付款, 1: 待发货, 2: 已发货, 3: 已收货, 4: 删除
		**/

		$scope.pageDataList = [];

	}]);