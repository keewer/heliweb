angular.module('app')
	.controller('loginController', ['$scope', '$state', '$cookies', 'API', 'TIP', function ($scope, $state, $cookies, API, TIP) {

		$scope.code = {
			img: '',
			text: ''
		}

		function getImgCode() {
			TIP.openLoading($scope);
			API.fetchGet('/imgcode')
				.then(function (data) {
					if (data.status == 200) {
						$scope.code.img = data.data.img;
						$scope.code.text = data.data.text;
					}
					TIP.hideLoading();
				})
				.catch(function (err) {
					console.log('出错啦');
					TIP.hideLoading();
				})
		}

		getImgCode();

		$scope.toggleImgCode = function () {
			getImgCode();
		}

		$scope.userInfo = {
			phone: '',
			pwd: '',
			code: ''
		};

		$scope.login = function () {
			var o = {
				phone: $scope.userInfo.phone,
				pwd: $scope.userInfo.pwd
			};
			TIP.openLoading($scope);
			API.fetchPost('/login', o)
				.then(function (data) {

					TIP.hideLoading();
					if (data.data.code == 1010) {
						var time = new Date().getTime() + 86400000;
						time = new Date(time);
						$cookies.put('_tVc', data.data._tVc, {expires: time});
						$(document).unbind();
						if (data.data.auth == 0 || data.data.auth == 1) {
							$state.go('home.usermanage');
						} else if (data.data.auth == 2) {
							$state.go('home.order');
						} else if (data.data.auth == 3) {
							$state.go('home.distributor', {id: data.data.id});
						}
						
					} else{
						TIP.openDialog(data.data.msg);
					}
					
				})
				.catch(function (err) {
					TIP.hideLoading();
					TIP.openDialog('服务器报错');
				})
		}

		$(document).on('keydown', function (e) {
			if (e.keyCode == 13 && $scope.userForm.$valid) {
				$scope.login();
			}
		})

	}])