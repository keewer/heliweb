angular.module('app')
	.controller('orderController', ['$scope', '$state', '$cookies', '$timeout', 'API', 'TIP', function ($scope, $state, $cookies, $timeout, API, TIP) {

		//权限
		$scope.authority = -1;

		$scope.orderInfo = {
			id: '',
			name: '',
			price: '',
			count: '',
			receive: '',
			address: '',
			phone: '',
			productNo: '',
			orderNo: '',
			productName: ''
		}

		$scope.addOrder = function () {
			// $('#newOrder').modal('hide');
			// $('#newOrder input').val('');
			// $('.modal-backdrop').remove();
			// $state.go('home.editorder');

			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o  = {
					_tVc: _tVc
				};
				for (var key in $scope.orderInfo) {
					o[key] = $scope.orderInfo[key];
				}
				API.fetchPut('/addorder', o)
					.then(function (data) {
						console.log('data ==> ', data);
						TIP.hideLoading();
						if (data.data.code == 8002 || data.data.code == 8001) {
							TIP.openDialog(data.data.msg);
						} else if (data.data.code == 4001) {
							TIP.openDialog(data.data.msg);
							$timeout(function () {
								$cookies.remove('_tVc');
								$state.go('login');
							}, 2000)
						} else {

						}
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}

		}

		

				//获取产品信息
		function init() {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {

				TIP.openLoading($scope);
				API.fetchGet('/findproductcount', {_tVc: _tVc})
					.then(function (data) {
						TIP.hideLoading();
						if (data.data.code == 3000) {
							if (data.data.auth != 3) {
								$state.go('login');
							} else {
								$scope.authority = data.data.auth;
								$scope.productList = data.data.data;
							}
						} else if (data.data.code == 4001) {
							TIP.openDialog(data.data.msg);
							$state.go('login');
						}
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}

		init();

		$scope.selectProduct = function (id) {
			for (var i = 0; i < $scope.productList.length; i++) {
				for (var key in $scope.productList[i]) {
					if (id == $scope.productList[i].id) {
						$scope.orderInfo.id = id;
						$scope.orderInfo.price = $scope.productList[i].price;
						$scope.orderInfo.productNo = $scope.productList[i].productNo
						$scope.orderInfo.productName = $scope.productList[i].name;
						return;
					}
				}
			}
		}
	
		/**
		* 0: 待付款, 1: 待发货, 2: 已发货, 3: 已收货, 4: 删除
		**/

		$scope.pageDataList = [];

	}]);