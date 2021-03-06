angular.module('app')
	.controller('orderController', ['$scope', '$state', '$cookies', '$timeout', '$compile', '$stateParams', 'API', 'TIP', function ($scope, $state, $cookies, $timeout, $compile, $stateParams, API, TIP) {

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
						if (data.data.code == 9000) {
							$('#newOrder').modal('hide');
							$('#newOrder input').val('');
							$scope.isSearch = true;
							for (var key in $scope.orderInfo) {
								$scope.orderInfo[key] = '';
							}
						} else if (data.data.code == 4001) {
							TIP.openDialog(data.data.msg);
							$timeout(function () {
								$cookies.remove('_tVc');
								$state.go('login');
							}, 2000)
						} else {
							TIP.openDialog(data.data.msg);
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
				API.fetchGet('/findproductcount', {
					_tVc: _tVc
				})
					.then(function (data) {
						TIP.hideLoading();
						if (data.data.code == 3000) {
							$scope.authority = data.data.auth;
							$scope.productList = data.data.data;
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
		* 0: 待付款, 1: 待发货, 2: 已发货, 3: 已收货
		**/
		//分页
		$scope.isSearch = false;

		$scope.pageDataList = [];

		var isInit = true;

		$scope.search = {
			orderNo: ''
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

	  function initPage(orderNo) {
		  var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc,
					id: $stateParams.id
				};
				if (orderNo) {
					o.orderNo = orderNo;
				}

				API.fetchGet('/findordercount', o)
					.then(function (data) {
						TIP.hideLoading($scope);
						if (data.data.code == 3000) {
							if (data.data.auth == 3 && $stateParams.id != '') {
								return $state.go('login');
							}

							$scope.option.all = Math.ceil(data.data.count / everyPageData);
							
							var query = {
								_tVc: _tVc,
								offset: ($scope.option.curr - 1) * everyPageData, 
								limit: everyPageData,
								id: $stateParams.id
							};

							if (orderNo) {
								query.orderNo = orderNo;
							}

							API.fetchGet('/findorder', query)
							.then(function (data) {
								if (data.data.code == 3000) {
									var orderData = data.data.data;
									//取出所有单号
									var orderNos = [];
									orderData.forEach(function (v, i) {
										v.num = i + ($scope.option.curr - 1) * everyPageData;
										v.create_time = new Date(v.create_time).formatDate('yyyy-MM-dd hh:mm:ss');
										orderNos.push(v.orderNo);
									})

									//查询订单反馈状态信息, 有反馈并且未浏览的反馈显示小红点
									API.fetchGet('/findcommentofordernos', {
										orderNos: orderNos.join(','),
										_tVc: _tVc
									})
										.then(function (data) {
											
											TIP.hideLoading();
											//根据订单号获取id最大数据
											if (data.data.code == 3000) {
												var resultData = data.data.data;
												var d = [];
												for (var i = 0; i < orderNos.length; i++) {
													var a = [];
													for (var j = 0; j < resultData.length; j++) {
														if (orderNos[i] == resultData[j].orderNo) {

															if (a[0] && a[0].id < resultData[j].id) {
																a.pop();
															}

															if (a.length == 0) {
																a.push(resultData[j]);
															}
														}
													}

													if (a.length > 0) {
														d.push(a[0]);
													}
												}

												//将订单标识加入orderData中
												for (var m = 0; m < d.length; m++) {
													for (var n = 0; n < orderData.length; n++) {
														if (d[m].orderNo == orderData[n].orderNo) {
															orderData[n].zoreAuth = d[m].zoreAuth;
															orderData[n].oneAuth = d[m].oneAuth;
															orderData[n].twoAuth = d[m].twoAuth;
															orderData[n].threeAuth = d[m].threeAuth;
															break;
														}
													}
												}
											}
											
										})
										.catch(function (err) {
											TIP.hideLoading();
										})


									$scope.pageDataList = orderData;
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
			$scope.search.orderNo = '';
			initPage();
		}

		$scope.searching = function () {

			$scope.search.orderNo = $scope.search.orderNo ? $scope.search.orderNo : '';

			if (!$scope.search.orderNo.trim()) {
				console.log('空');
				return;
			} else if (/[<>]+/.test($scope.search.orderNo)) {
				TIP.openDialog('搜索用户不能含有< >符号');
			} else {
				$scope.option.curr = 1;
				document.getElementById('pagination').innerHTML = '';
				isInit = true;
				$scope.isSearch = true;
				initPage($scope.search.orderNo);
			}
			
		}

		$scope.enterSearching = function (e) {
			if (e.keyCode == 13) {
				$scope.searching();
			}
		}

		//付款
		$scope.pay = function (item) {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc,
					id: item.id,
					orderNo: item.orderNo,
					money: item.price * item.count
				};

				API.fetchPost('/pay', o)
					.then(function (data) {
						TIP.hideLoading();
						TIP.openDialog(data.data.msg);
						if (data.data.code === 10000) {
							item.status = data.data.status;
						}
						
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}


		//移除订单
		$scope.removeOrder = function (item, index) {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc,
					id: item.id,
					orderNo: item.orderNo
				};

				API.fetchPost('/removeorder', o)
					.then(function (data) {
						TIP.hideLoading();
						TIP.openDialog(data.data.msg);
						if (data.data.code == 9000) {
							item.status = data.data.status;
							$scope.pageDataList.splice(index, 1);
						}
						
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}

		//客服发货
		$scope.sendOrder = function (item) {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc,
					id: item.id,
					orderNo: item.orderNo
				};

				API.fetchPost('/sendorder', o)
					.then(function (data) {
						TIP.hideLoading();
						TIP.openDialog(data.data.msg);
						if (data.data.code == 10010) {
							item.status = data.data.status;
						}
						
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}

		//总代理收货
		$scope.receiveOrder = function (item) {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc,
					id: item.id,
					orderNo: item.orderNo
				};

				API.fetchPost('/receiveorder', o)
					.then(function (data) {
						// TIP.hideLoading();
						TIP.openDialog(data.data.msg);
						if (data.data.code == 10020) {
							item.status = data.data.status;

							//查询当前分销商是否可以升级为总代理
							o.uid = item.uid;
							API.fetchPost('/promoteagent', o)
								.then(function (data) {
									
									TIP.hideLoading();
								})
								.catch(function (err) {
									TIP.hideLoading();
									TIP.openDialog('服务器查询升级总代理过程出现错误');
								})
						}
						
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}

		//查看订单反馈
		$scope.comment = function (item) {
			$state.go('home.comment', {id: item.id, orderNo: item.orderNo});
		}

	}]);