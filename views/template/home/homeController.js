angular.module('app')
	.controller('homeController', ['$scope', '$state', '$location',  '$cookies', '$timeout', 'API', 'TIP', function ($scope, $state, $location, $cookies, $timeout, API, TIP) {
		
		$scope.loginUserInfo = {
			username: '',
			auth: '',
			position: ''
		};

		var _tVc = $cookies.get('_tVc');
		if (!_tVc) {
			$state.go('login');
		} else {
			TIP.openLoading($scope);
			API.fetchGet('/user', {_tVc: _tVc})
				.then(function (data) {
					TIP.hideLoading();
					if (data.data.code == 1010) {
						$scope.loginUserInfo.username = data.data.username;
						$scope.loginUserInfo.auth = data.data.auth;
						$scope.loginUserInfo.position = data.data.position;
					} else {
						TIP.openDialog(data.data.msg);
						$setTimeout(function () {
							$state.go('login');
						}, 2000);
					}
				})
				.catch(function (err) {
					TIP.hideLoading();
					console.log('出错啦');
				})
		}

		var path = $location.path().slice(1);

		var activeItem = null;

		$scope.list = [
			{
				name: '用户管理',
				iconcls: 'fa-users',
				licls: {'active-bg': false},
				state: $scope.loginUserInfo.auth == 0 || $scope.loginUserInfo.auth == 1 ? 'home.usermanage' : 'home.distributor',
				url: 'usermanage@distributor'
			},
			{
				name: '订单管理',
				iconcls: 'fa-server',
				licls: {'active-bg': false},
				state: $scope.loginUserInfo.auth == 0 || $scope.loginUserInfo.auth == 1 ? 'home.agentorder' : 'home.order',
				url: 'agentorder@order'
			},
			{
				name: '商品管理',
				iconcls: 'fa-cube',
				licls: {'active-bg': false},
				state: 'home.product',
				url: 'product'
			},
			{
				name: '数据统计',
				iconcls: 'fa-bar-chart',
				licls: {'active-bg': false},
				state: 'home.data',
				url: 'data'
			},
			{
				name: '个人中心',
				iconcls: 'fa-user',
				licls: {'active-bg': false},
				state: 'home.person',
				url: 'person'
			}
		];

		for (var i = 0; i < $scope.list.length; i++) {
			if ($scope.list[i].url.indexOf(path.split('/')[0]) > -1) {
				$scope.list[i].licls['active-bg'] = true;
				activeItem = $scope.list[i];
				break;
			}
		}

		$scope.toggleList = function (item) {
			if (item.licls['active-bg']) {
				return;
			}
			activeItem.licls['active-bg'] = false;
			item.licls['active-bg'] = true;
			activeItem = item;

			$state.go(item.state);
		}

		$scope.logout = function () {
			$state.go('login');
		}

	}])