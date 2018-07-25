angular.module('app')
	.controller('usermanageController', ['$scope', '$state', '$cookies', '$compile', '$timeout', 'API', 'TIP', function ($scope, $state, $cookies, $compile, $timeout, API, TIP) {

		$scope.userInfo = {
			phone: '',
			pwd: '',
			repwd: '',
			username: '',
			idcard: '',
			address: ''
		};

		$scope.search = {
			user: ''
		}

		$scope.isSearch = false;

		$scope.pageDataList = [];

		$scope.authority = -1;

		var isInit = true;

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


	  function initPage(username) {
		  var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc
				};
				if (username) {
					o.username = username;
				}
				API.fetchGet('/usercount', o)
					.then(function (data) {
						TIP.hideLoading();

						if (data.data.code == 3000) {
							if (data.data.auth == 3 || data.data.auth == 2) {
								return $state.go('login');
							}
							$scope.option.all = Math.ceil(data.data.count / everyPageData);
							var query = {
								_tVc: _tVc,
								offset: ($scope.option.curr - 1) * everyPageData, 
								limit: everyPageData
							};

							if (username) {
								query.username = username;
							}
							API.fetchGet('/lastuser', query)
							.then(function (data) {
								console.log('users data ==> ', data);
								if (data.data.code == 3000) {
									data.data.data.forEach(function (v, i) {
										v.num = i + ($scope.option.curr - 1) * everyPageData;
										v.lastLoginTime = new Date(v.lastLoginTime).formatDate('yyyy-MM-dd hh:mm:ss');
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
								console.log('出错啦');
							})

						} else if (data.data.code == 4001) {
							$state.go('login');
						}
					})
					.catch(function (err) {
						console.log('出错啦');
						TIP.hideLoading();
					})
			}
		}

		initPage();

		$scope.changeStatus = function (item) {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				API.fetchPost('/changeuserstatus', {
					id: item.id,
					phone: item.phone,
					status: item.status == 0 ? 1 : 0,
					_tVc: _tVc
				})
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
						item.status = data.data.status;
					}
				})
				.catch(function (err) {
					TIP.hideLoading();
					console.log('出错啦');
					TIP.openDialog(data.data.msg);
				})
			}
		}

		$scope.search = function () {

			$scope.search.user = $scope.search.user ? $scope.search.user : '';

			if (!$scope.search.user.trim()) {
				console.log('空');
				return;
			} else if (/[<>]+/.test($scope.search.user)) {
				TIP.openDialog('搜索用户不能含有< >符号');
			} else {
				$scope.option.curr = 1;
				document.getElementById('pagination').innerHTML = '';
				isInit = true;
				$scope.isSearch = true;
				initPage($scope.search.user);
			}
			
			

		}

		$scope.showAllData = function () {
			$scope.option.curr = 1;
			document.getElementById('pagination').innerHTML = '';
			isInit = true;
			$scope.isSearch = false;
			$scope.search.user = '';
			initPage();
		}

		$scope.selectDistributor = function (item) {
			$state.go('home.distributor', {id: item.id});
		}


		$scope.addAgent = function () {

			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc
				};
				for (var key in $scope.userInfo) {
					if (key == 'repwd') {continue;}
					o[key] = $scope.userInfo[key];
				}
				API.fetchPost('/adduser', o)
					.then(function (data) {
						$('#agent').modal('hide');
						$('#agent input').val('');
						TIP.hideLoading();
						TIP.openDialog(data.data.msg);
					})
					.catch(function (err) {
						TIP.hideLoading();
						console.log('出错啦');
						TIP.openDialog(data.data.msg);
					})
			}

			
		}
		
	}])