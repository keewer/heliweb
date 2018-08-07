angular.module('app')
	.controller('agentorderController', ['$scope', '$cookies', '$state', '$compile', 'API', 'TIP', function ($scope, $cookies, $state, $compile, API, TIP) {

		/**
		* 0: 待付款, 1: 待发货, 2: 已发货, 3: 已收货
		**/
		$scope.authority = -1;

		//分页
		$scope.isSearch = false;

		$scope.pageDataList = [];

		var isInit = true;

		$scope.search = {
			name: ''
		}

		//每一页显示数据数量
		var everyPageData = 10;

		//设置分页的参数
	  $scope.option = {
	    curr: 1,  //当前页数
	    all: 1,  //总页数
	    count: 10,  //最多显示的页数，默认为10

	    //点击页数的回调函数，参数page为点击的页数
	    click: function (page) {
	      $scope.option.curr = page;
	      initPage();
	    }
	  };

	  initPage();

	  function initPage(name) {
		  var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc
				};
				if (name) {
					o.name = name;
				}
				API.fetchGet('/findagentordercount', o)
					.then(function (data) {

						TIP.hideLoading();
						if (data.data.code == 3000) {
							if (data.data.auth == 3) {
								return $state.go('login');
							}
							$scope.option.all = Math.ceil(data.data.count / everyPageData);
							var query = {
								_tVc: _tVc,
								offset: ($scope.option.curr - 1) * everyPageData, 
								limit: everyPageData
							};

							if (name) {
								query.name = name;
							}

							API.fetchGet('/findagentorder', query)
							.then(function (data) {

								TIP.hideLoading();
								if (data.data.code == 3000) {
									data.data.data.forEach(function (v, i) {
										v.num = i + ($scope.option.curr - 1) * everyPageData;
									})
									$scope.pageDataList = data.data.data;
									$scope.authority = data.data.auth;
									if (isInit){
										var pagination = $compile('<pagination page-option="option"></pagination>')($scope)[0];

										document.getElementById('pagination').appendChild(pagination);

										isInit = false;
									}
								} else {
									TIP.openDialog(data.data.msg);
								}
							})
							.catch(function (err) {
								TIP.hideLoading();
								console.log('出错啦');
							})

						} else if (data.data.code == 4001) {
							$state.go('login');
						}
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}

		$scope.showAllData = function () {
			$scope.option.curr = 1;
			document.getElementById('pagination').innerHTML = '';
			isInit = true;
			$scope.isSearch = false;
			$scope.search.name = '';
			initPage();
		}

		$scope.searching = function () {

			$scope.search.name = $scope.search.name ? $scope.search.name : '';

			if (!$scope.search.name.trim()) {
				console.log('空');
				return;
			} else if (/[<>]+/.test($scope.search.name)) {
				TIP.openDialog('搜索用户不能含有< >符号');
			} else {
				$scope.option.curr = 1;
				document.getElementById('pagination').innerHTML = '';
				isInit = true;
				$scope.isSearch = true;
				initPage($scope.search.name);
			}
			
		}

		$scope.enterSearching = function (e) {
			if (e.keyCode == 13) {
				$scope.searching();
			}
		}

	}])