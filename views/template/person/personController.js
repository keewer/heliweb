angular.module('app')
	.controller('personController', ['$scope', '$cookies', '$state', 'API', 'TIP', function ($scope, $cookies, $state, API, TIP) {
		
		//权限
		$scope.authority = -1;

		var temporary = '';

		$scope.userInfo = {
			username: '',
			position: '',
			phone: '',
			idcard: '',
			address: ''
		};

		$scope.pwdInfo = {
			oldpwd: '',
			newpwd: '',
			renewpwd: ''
		};

		$scope.isModifyAddress = false;

		init();

		function init() {
			var _tVc = $cookies.get('_tVc');
			if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				API.fetchGet('/user', {_tVc: _tVc})
					.then(function (data) {
						TIP.hideLoading($scope);
						$scope.userInfo.username = data.data.username;
						$scope.userInfo.position = data.data.position;
						$scope.userInfo.phone = data.data.phone;
						$scope.userInfo.idcard = data.data.idcard;
						$scope.userInfo.address = data.data.address;
					})
					.catch(function (err) {
						TIP.hideLoading($scope);
						TIP.openDialog('服务器报错');
					})
			}
		}


		$scope.modifyAddress = function () {
			$scope.isModifyAddress = true;
			temporary = $scope.userInfo.address;
		}

		$scope.cancelModifyAddress = function () {
			$scope.isModifyAddress = false;
			$scope.userForm.address.$pristine = true;
			$scope.userInfo.address = temporary;
			temporary = '';
		}

		$scope.commitModifyAddress = function () {

			var _tVc = $cookies.get('_tVc');
			if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				API.fetchPost('/modifyaddress', {_tVc: _tVc, address: $scope.userInfo.address})
					.then(function (data) {
						TIP.hideLoading();
						if (data.data.code == 4001) {
							TIP.openDialog(data.data.msg);
							$timeout(function () {
								$state.go('login');
							}, 2000);
						} else if (data.data.code == 5000) {
							TIP.openDialog(data.data.msg);
						} else {
							$scope.isModifyAddress = false;
							temporary = '';
						}
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}

		$scope.modifyPwd = function () {
			var _tVc = $cookies.get('_tVc');
			if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				API.fetchPost('/modifypwd', {
					_tVc: _tVc,
					oldpwd: $scope.pwdInfo.oldpwd,
					newpwd: $scope.pwdInfo.newpwd
				})
				.then(function (data) {
					TIP.hideLoading($scope);
					if (data.data.code == 4001) {
						TIP.openDialog(data.data.msg);
						$timeout(function () {
							$state.go('login');
						}, 2000);
					} else if (data.data.code == 5000) {
						TIP.openDialog(data.data.msg);
					} else if (data.data.code == 1013) {
						TIP.openDialog(data.data.msg);
					} else {
						$('#modifyPwd').modal('hide');
						$('#modifyPwd input').val('');
						$(".modal-backdrop").remove();
						$cookies.remove('_tVc');
						$state.go('login');
					}
				})
				.catch(function (err) {
					TIP.hideLoading($scope);
					TIP.openDialog('服务器报错');
				})
			}
		}

	}])