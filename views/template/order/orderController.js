angular.module('app')
	.controller('orderController', ['$scope', '$state', '$cookies', '$timeout', 'API', 'TIP', function ($scope, $state, $cookies, $timeout, API, TIP) {

		//权限
		$scope.authority = -1;

		$scope.orderInfo = {
			id: '',
			name: '',
			price: '',
			count: '',
			receive: '',
			address: '',
			phone: '',
			productNo: '',
			orderNo: '',
			productName: ''
		}

		$scope.addOrder = function () {
			
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o  = {
					_tVc: _tVc
				};
				for (var key in $scope.orderInfo) {
					o[key] = $scope.orderInfo[key];
				}
				API.fetchPut('/addorder', o)
					.then(function (data) {
						TIP.hideLoading();
						if (data.data.code == 8002 || data.data.code == 8001 || data.data.code == 5000) {
							TIP.openDialog(data.data.msg);
						} else if (data.data.code == 4001) {
							TIP.openDialog(data.data.msg);
							$timeout(function () {
								$cookies.remove('_tVc');
								$state.go('login');
							}, 2000)
						} else {
							$('#newOrder').modal('hide');
							$('#newOrder input').val('');
						}
					})
					.catch(function (err) {
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
						if (data.data.code == 3000) {
							if (data.data.auth != 3) {
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
						$scope.orderInfo.id = id;
						$scope.orderInfo.price = $scope.productList[i].price;
						$scope.orderInfo.productNo = $scope.productList[i].productNo
						$scope.orderInfo.productName = $scope.productList[i].name;
						return;
					}
				}
			}
		}
	
		/**
		* 0: 待付款, 1: 待发货, 2: 已发货, 3: 已收货, 4: 删除
		**/
		//分页
		$scope.isSearch = false;

		$scope.pageDataList = [];

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
				API.fetchGet('/findordercount', o)
					.then(function (data) {
						
						if (data.data.code == 3000) {
							if (data.data.auth == 2) {
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

							API.fetchGet('/findorder', query)
							.then(function (data) {
								TIP.hideLoading();
								if (data.data.code == 3000) {
									data.data.data.forEach(function (v, i) {
										v.num = i + ($scope.option.curr - 1) * everyPageData;
										v.create_time = new Date(v.create_time).formatDate('yyyy-MM-dd hh:mm:ss');
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



	}]);