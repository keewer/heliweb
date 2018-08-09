angular.module('app')
	.controller('homeController', ['$scope', '$state', '$location',  '$cookies', '$timeout', 'API', 'TIP', function ($scope, $state, $location, $cookies, $timeout, API, TIP) {
		
		$scope.loginUserInfo = {
			username: '',
			auth: '',
			position: '',
			id: ''
		};

		function gernerateList() {
			return [
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
				state: $scope.loginUserInfo.auth == 0 || $scope.loginUserInfo.auth == 1 || $scope.loginUserInfo.auth == 2 ? 'home.agentorder' : 'home.order',
				url: 'agentorder@order@comment'
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
				name: '返利汇总',
				iconcls: 'fa-money',
				licls: {'active-bg': false},
				state: 'home.money',
				url: 'money@moneydetail'
			},
			{
				name: '个人中心',
				iconcls: 'fa-user',
				licls: {'active-bg': false},
				state: 'home.person',
				url: 'person'
			}
			];
		}

		$scope.list = [];

		var activeItem = null;

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
						$scope.loginUserInfo.id = data.data.id;
						var list = gernerateList();
						if (data.data.auth == 2) {
							//客服
							$scope.list.push(list[1]);
							$scope.list.push(list[5]);
						} else if (data.data.auth == 3) {
							$scope.list.push(list[0]);
							$scope.list.push(list[1]);
							$scope.list.push(list[3]);
							$scope.list.push(list[4]);
							$scope.list.push(list[5]);
						} else if (data.data.auth == 1) {
							$scope.list.push(list[0]);
							$scope.list.push(list[1]);
							$scope.list.push(list[3]);
							$scope.list.push(list[5]);
						} else if (data.data.auth == 0) {
							$scope.list = list;
						}
						var path = $location.path().slice(1);
						for (var i = 0; i < $scope.list.length; i++) {
							if ($scope.list[i].url.indexOf(path.split('/')[0]) > -1) {
								$scope.list[i].licls['active-bg'] = true;
								activeItem = $scope.list[i];
								break;
							}
						}
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

		
		

		$scope.toggleList = function (item) {
			if (item.licls['active-bg']) {
				return;
			}
			activeItem.licls['active-bg'] = false;
			item.licls['active-bg'] = true;
			activeItem = item;

			if (item.state == 'home.distributor') {
				$state.go(item.state, {id: $scope.loginUserInfo.id});
			} else {
				$state.go(item.state);
			}

			
		}

		$scope.logout = function () {
			$cookies.remove('_tVc');
			$state.go('login');
		}

	}])