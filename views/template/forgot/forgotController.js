angular.module('app')
	.controller('forgotController', ['$scope', '$state', '$interval', '$cookies', 'API', 'TIP', function ($scope, $state, $interval, $cookies, API, TIP) {

		$scope.userInfo = {
			phone: '',
			pwd: '',
			repwd: '',
			code: ''
		};

		$scope.codeText = '0000';

		//临时保存手机号码, 用于提交验证
		var temporaryPhone = '';
		var isGetCode = false;
		$scope.getPhoneCode = function (e) {
			//手机合法性
			if ($scope.userForm.phone.$invalid) {
				TIP.openDialog('手机号码错误');
				return;
			}

			if (isGetCode) {
				return;
			}
			temporaryPhone = $scope.userInfo.phone;
			var helic = +$cookies.get('helic');
			var t = new Date().getTime() + 600000;
			t = new Date(t);
			if(helic) {
				if (helic >= 3) {
					TIP.openDialog('操作过于频繁');
					return;
				} else {
					$cookies.put('helic', helic + 1, {expires: t});
				}
				
			} else {
				
				$cookies.put('helic', 1, {expires: t});
			}
			isGetCode = true;
			var time = 60;
			e.target.textContent = '(' + time + 's)重新获取';
			var timer = $interval(function () {
				if (time <= 0) {
					$interval.cancel(timer);
					time = 60;
					e.target.textContent = '获取验证码';
					isGetCode = false;
				} else {
					time--;
					e.target.textContent = '(' + time + 's)重新获取';
				}
				
			}, 1000);

			//发送请求
			TIP.openLoading($scope);
			API.fetchGet('/phonecode', {
				phone: $scope.userInfo.phone
			})
				.then(function (data) {
					//测试使用
					console.log('phonecode data ==> ', data);
					TIP.hideLoading();
					TIP.openDialog(data.data.msg);
					if (data.data.code == 3000) {
						$cookies.put('helipc', data.data.phoneCode + '' + new Date().getTime(), {expires: t});
						$scope.codeText = data.data.phoneCode;
					}
				})
				.catch(function (err) {
					TIP.hideLoading();
				})
		}


		//修改密码
		$scope.commit = function () {
			if ($scope.userForm.$valid && temporaryPhone == $scope.userInfo.phone) {

				var helipc = $cookies.get('helipc');
				if (helipc) {
					helipc = helipc.slice(0, 4);
					if (helipc == $scope.codeText) {
						//发送请求
						TIP.openLoading($scope);
						API.fetchPost('/forgot', {
							phone: $scope.userInfo.phone,
							pwd: $scope.userInfo.pwd
						})
							.then(function (data) {
								TIP.hideLoading();
								if (data.data.code == 1) {
									$state.go('login');
								} else {
									TIP.openDialog(data.data.msg);
								}
							})
							.catch(function (err) {
								TIP.hideLoading();
							})
					} else {
						TIP.openDialog('验证码错误');
					}
				} else {
					TIP.openDialog('验证码已过期');
				}
			} else {
				TIP.openDialog('填写信息错误');
			}
		}

	}])