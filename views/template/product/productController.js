angular.module('app')
	.controller('productController', ['$scope', '$cookies', 'API', 'TIP', function ($scope, $cookies, API, TIP) {
		console.log('productController');

		$scope.authority = 1;

		$scope.product = {
			code: '',
			name: ''
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
					productNo: $scope.product.code
				}
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



	}])