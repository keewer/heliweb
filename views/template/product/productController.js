angular.module('app')
	.controller('productController', ['$scope', '$cookies', 'API', 'TIP', function ($scope, $cookies, API, TIP) {

		$scope.authority = -1;

		$scope.product = {
			code: '',
			name: '',
			price: '',
			firstlevel: '',
			secondlevel: '',
			thirdlevel: ''
		};

		$scope.setProduct = {
			name: '',
			price: '',
			firstlevel: '',
			secondlevel: '',
			thirdlevel: ''
		};

		var productList = [];

		$scope.addProduct = function () {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);

				var o = {
					_tVc: _tVc,
					name: $scope.product.name,
					productNo: $scope.product.code,
					price: +$scope.product.price,
					firstlevel: +$scope.product.firstlevel,
					secondlevel: +$scope.product.secondlevel,
					thirdlevel: +$scope.product.thirdlevel
				};

				API.fetchPut('/addproduct', o)
					.then(function (data) {
						$('#addProduct').modal('hide');
						$('#addProduct input').val('');
						TIP.hideLoading();
						TIP.openDialog(data.data.msg);
					})
					.catch(function () {
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
						console.log(data);
						if (data.data.code == 3000) {
							if (data.data.auth != 0) {
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
						$scope.setProduct.price = $scope.productList[i].price;
						$scope.setProduct.firstlevel = $scope.productList[i].firstLevel;
						$scope.setProduct.secondlevel = $scope.productList[i].secondLevel;
						$scope.setProduct.thirdlevel = $scope.productList[i].thirdLevel;
						return;
					}
				}
			}
		}

	}])