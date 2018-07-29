angular.module('app')
	.controller('productController', ['$scope', '$cookies', '$compile', '$timeout', '$state', 'API', 'TIP', function ($scope, $cookies, $compile, $timeout, $state, API, TIP) {

		$scope.authority = -1;

		$scope.product = {
			code: '',
			name: '',
			price: '',
			firstlevel: '',
			secondlevel: '',
			thirdlevel: ''
		};

		$scope.promote = {
			count: ''
		}

		$scope.setProduct = {
			id: '',
			name: '',
			price: '',
			firstlevel: '',
			secondlevel: '',
			thirdlevel: ''
		};

		$scope.addProduct = function () {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);

				var o = {
					_tVc: _tVc,
					name: $scope.product.name,
					productNo: $scope.product.code,
					price: +$scope.product.price,
					firstlevel: +$scope.product.firstlevel,
					secondlevel: +$scope.product.secondlevel,
					thirdlevel: +$scope.product.thirdlevel
				};

				API.fetchPut('/addproduct', o)
					.then(function (data) {
						TIP.hideLoading();
						if (data.data.code == 7000) {
							$('#addProduct').modal('hide');
							$('#addProduct input').val('');
							refresh();
						} else if (data.data.code == 3000) {
							TIP.openDialog(data.data.msg);
						} else {
							TIP.openDialog('录入商品失败');
						}
					})
					.catch(function () {
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
							if (data.data.auth != 0) {
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

		function refresh() {
			for (var key in $scope.setProduct) {
				$scope.setProduct[key] = '';
			}
			$scope.isSearch = true;
			init();
		}


		$scope.selectProduct = function (id) {
			for (var i = 0; i < $scope.productList.length; i++) {
				for (var key in $scope.productList[i]) {
					if (id == $scope.productList[i].id) {
						$scope.setProduct.id = id;
						$scope.setProduct.price = $scope.productList[i].price;
						$scope.setProduct.firstlevel = $scope.productList[i].firstLevel;
						$scope.setProduct.secondlevel = $scope.productList[i].secondLevel;
						$scope.setProduct.thirdlevel = $scope.productList[i].thirdLevel;
						return;
					}
				}
			}
		}

		$scope.updateProduct = function () {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);

				var o = {
					_tVc: _tVc,
					id: $scope.setProduct.id,
					price: +$scope.setProduct.price,
					firstlevel: +$scope.setProduct.firstlevel,
					secondlevel: +$scope.setProduct.secondlevel,
					thirdlevel: +$scope.setProduct.thirdlevel
				};

				API.fetchPost('/updateproduct', o)
					.then(function (data) {
						TIP.hideLoading();
						
						if (data.data.code == 3000) {
							refresh();
						} else {
							TIP.openDialog('更改失败');
						}
					})
					.catch(function () {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}

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
				API.fetchGet('/findproductnums', o)
					.then(function (data) {
						
						if (data.data.code == 3000) {
							if (data.data.auth != 0) {
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

							API.fetchGet('/findproduct', query)
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

		$scope.search = {
			name: ''
		};

		$scope.searching = function () {

			$scope.search.name = $scope.search.name ? $scope.search.name : '';

			if (!$scope.search.name.trim()) {
				TIP.openDialog('请输入商品名称');
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

		$scope.showAllData = function () {
			$scope.option.curr = 1;
			document.getElementById('pagination').innerHTML = '';
			isInit = true;
			$scope.isSearch = false;
			$scope.search.name = '';
			initPage();
		}

		$scope.enterSearching = function (e) {
			if (e.keyCode == 13) {
				$scope.searching();
			}
			
		}

		$scope.changeStatus = function (item) {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				API.fetchPost('/changeproductstatus', {
					id: item.id,
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
						init();
					}
				})
				.catch(function (err) {
					TIP.hideLoading();
					TIP.openDialog('服务器报错');
				})
			}
		}

		//查询分销商升级为总代理条件数目
		function selectCount() {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc
				};

				API.fetchGet('/promotecount', o)
					.then(function (data) {
						TIP.hideLoading();
						if (data.data.code == 3000) {
							$scope.promoteCount = data.data.data.promoteCount;
						} else if (data.data.code == 3001) {
							$scope.promoteCount = data.data.msg;
						}
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}

		selectCount();

		//设置分销商升级为总代理条件数目
		$scope.setPromoteCount = function () {
				var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc,
					promoteCount: $scope.promote.count
				};

				API.fetchPost('/promote', o)
					.then(function (data) {
						TIP.hideLoading();
						console.log(data);
						if (data.data.code == 3000) {
							$scope.promoteCount = data.data.data.promoteCount;
							$scope.promote.count = '';
						} else if (data.data.code == 3001) {
							TIP.openDialog(data.data.msg);
						}
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}


		//修改分销商升级为总代理条件数目
		$scope.modifyPromoteCount = function () {
				var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				var o = {
					_tVc: _tVc,
					promoteCount: $scope.promote.count
				};

				API.fetchPost('/updatepromote', o)
					.then(function (data) {
						TIP.hideLoading();
						if (data.data.code == 3000) {
							$scope.promoteCount = data.data.data;
							$scope.promote.count = '';
						} else if (data.data.code == 3001) {
							TIP.openDialog(data.data.msg);
						}
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}


	}])