angular.module('app')
	.controller('homeController', ['$scope', '$state', '$location', function ($scope, $state, $location) {
		
		//权限
		var authority = 1;

		var path = $location.path().slice(1);

		var activeItem = null;

		$scope.list = [
			{
				name: '用户管理',
				iconcls: 'fa-users',
				licls: {'active-bg': false},
				state: authority == 0 || authority == 1 ? 'home.usermanage' : 'home.distributor',
				url: 'usermanage@distributor'
			},
			{
				name: '订单管理',
				iconcls: 'fa-server',
				licls: {'active-bg': false},
				state: authority == 0 || authority == 1 ? 'home.agentorder' : 'home.order',
				url: 'agentorder@order'
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
			if ($scope.list[i].url.indexOf(path) > -1) {
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

	}])