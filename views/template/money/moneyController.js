angular.module('app')
	.controller('moneyController', ['$scope', '$state', '$cookies', '$compile', 'API', 'TIP', function ($scope, $state, $cookies, $compile, API, TIP) {

		$scope.authority = -1;

		$scope.moneyInfo = {
			startDate: '',
			endDate: ''
		}

		$scope.isSearch = false;

		var userData = [];

		$scope.generateData = function () {

			var startDate = new Date($scope.moneyInfo.startDate);
			var startYear = startDate.getFullYear();
			var startMonth = startDate.getMonth() + 1;
			var endDate = new Date($scope.moneyInfo.endDate);
			var endYear = endDate.getFullYear();
			var endMonth = endDate.getMonth() + 1;

			//开始日期和结束日期不能超过12个月

			if (startYear > endYear) {
				TIP.openDialog('开始年份不能大于结束年份');
			} else {
				//计算月份差
				var ym = (endYear - startYear) * 12;
				var mm = endMonth - startMonth + 1;

				//查询多少个月数据
				var totalMonth = ym + mm;

				if (totalMonth > 12) {
					TIP.openDialog('不能查询超过12个月数据');
				} else {
					//开始时间始终是 yyyy-MM-01 00:00:00
					//结束时间需要符合以下规则
					//1,3,5,7,8,10,12 = yyyy-MM-31 23:59:59
					//4,6,9,11 = yyyy-MM-30 23:59:59
					//闰年2 = yyyy-MM-29 23:59:59
					//平年2 = yyyy-MM-28 23:59:59

					var bigMonth = [1,3,5,7,8,10,12];
					var smallMonth = [4,6,9,11];

					var start = startYear + '-' + (startMonth >= 10 ? startMonth : '0' + startMonth) + '-' + '01 00:00:00';

					var end = endYear + '-' + (endMonth >= 10 ? endMonth : '0' + endMonth) + '-';

					//判断闰年和平年
					var isLeapYear = (endYear % 4 == 0 && endYear % 100 != 0) || endYear % 400 == 0;

					//二月份
					if (isLeapYear) {
						if (endMonth == 2) {
							end += 29;
						}
					} else {
						if (endMonth == 2) {
							end += 28;
						}
					}

					if (bigMonth.finding(endMonth)) {
						end += 31 + ' 23:59:59';
					} else if (smallMonth.finding(endMonth)) {
						end += 30 + ' 23:59:59';
					}

					//发送查询请求
					var _tVc = $cookies.get('_tVc');
				  if (!_tVc) {
						$state.go('login');
					} else {
						var o = {
							_tVc: _tVc,
							start: start,
							end: end
						};

						userData = [];
						TIP.openLoading($scope);
						//发送请求
						API.fetchGet('/money', o)
							.then(function (data) {
								TIP.hideLoading();

								if (data.data.code == 3000) {
									if (data.data.data.length == 0) {
										TIP.openDialog('没有数据');
									} else {
										var datas = data.data.data;
										//筛选数据
										//取出用户数据
										var userIds = [];
										datas.forEach(function (v) {
											if (!userIds.finding(v.uid)) {
												userIds.push(v.uid);
												userData.push({uid: v.uid, username: v.username, phone: v.phone});
											}
										})

										//根据id = primaryRelationship | secondaryRelationship | thirdRelationship分组保存
										userIds.forEach(function (v1, i) {
											var pr = 0; //一级返利金额
											var sr = 0; //二级返利金额
											var tr = 0; //三级返利金额
											datas.forEach(function (v2) {
												//一级返利金额计算
												if (v1 == v2.primaryRelationship) {
													pr +=  v2.count * v2.firstLevel;
												} else if (v1 == v2.secondaryRelationship) {
													sr += v2.count * v2.secondLevel;
												} else if (v1 == v2.thirdRelationship) {
													tr += v2.count * v2.thirdLevel;
												}
											})

											userData[i].num = i;
											userData[i].pr = Number(pr.toFixed(2));
											userData[i].sr = Number(sr.toFixed(2));
											userData[i].tr = Number(tr.toFixed(2));
										});

										document.getElementById('pagination').innerHTML = '';

										$scope.option.curr = 1;

										$scope.isShowData = true;

										//截取数据
										$scope.pageDataList = userData.slice(($scope.option.curr - 1) * everyPageData, $scope.option.curr * everyPageData);

										//创建分页
										$scope.option.all = Math.ceil(userData.length / everyPageData);

										var pagination = $compile('<pagination page-option="option"></pagination>')($scope)[0];

										document.getElementById('pagination').appendChild(pagination);

									}
								} else if (data.data.code == 4001) {
									$state.go('login');
								} else {
									Tip.openDialog(data.data.msg);
								}
							})
							.catch(function (err) {
								TIP.hideLoading();
							})
					}

				}
			}


			
		};


		init();
		function init() {
			var _tVc = $cookies.get('_tVc');
			if (!_tVc) {
				$state.go('login');
			} else {
				TIP.openLoading($scope);
				API.fetchGet('/user', {_tVc: _tVc})
					.then(function (data) {
						TIP.hideLoading();
						if (data.data.code == 1010) {
							$scope.authority = data.data.auth;
						}
					})
					.catch(function (err) {
						TIP.hideLoading();
					})
			}
						
		}


		//分页
		$scope.isSearch = false;

		$scope.search = {
			name: ''
		}

		//分页数据数组
		$scope.pageDataList = [];

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
	      togglePagination();
	    }
	  };

	  //分页切换
	  function togglePagination() {
	  	//截取数据
			$scope.pageDataList = userData.slice(($scope.option.curr - 1) * everyPageData, $scope.option.curr * everyPageData);
	  }

	  $scope.isShowData = false;
	  $scope.clearData = function () {
	  	$scope.isShowData = false;
	  	$scope.pageDataList = [];
	  	$scope.moneyInfo.startDate = '';
	  	$scope.moneyInfo.endDate = '';
	  	document.getElementById('pagination').innerHTML = '';
	  	$scope.search.name = '';
	  	$scope.isSearch = false;
	  }

	  //保存临时总代理名称
	  var temporaryAgent = '';

	  //搜索
	  $scope.searching = function () {
	  	if (!$scope.isShowData) {
	  		return;
	  	}
	  	var name = $scope.search.name == null ? '' : $scope.search.name.trim();
	  	if (!name) {
	  		TIP.openDialog('请输入总代理名称');
	  		return;
	  	}

	  	if (temporaryAgent == name) {
	  		return;
	  	} else {
	  		temporaryAgent = name;
	  	}

	  	//过滤指定总代理名称数据数组
	  	var ud = [];
	  	userData.forEach(function (v) {
	  		if (name == v.username) {
	  			ud.push(v);
	  		}
	  	})

	  	document.getElementById('pagination').innerHTML = '';
	  	$scope.option.curr = 1;
	  	$scope.pageDataList = ud.slice(($scope.option.curr - 1) * everyPageData, $scope.option.curr * everyPageData);

	  	$scope.option.all = Math.ceil(ud.length / everyPageData);

			var pagination = $compile('<pagination page-option="option"></pagination>')($scope)[0];

			document.getElementById('pagination').appendChild(pagination);

			$scope.isSearch = true;

	  }

	  //回车搜索
	  $scope.enterSearching = function (e) {
			if (e.keyCode == 13 && $scope.isShowData) {
				$scope.searching();
			}
	  }

	  //显示所有数据
	  $scope.showAllData = function () {
	  	document.getElementById('pagination').innerHTML = '';
	  	$scope.option.curr = 1;
	  	$scope.pageDataList = userData.slice(($scope.option.curr - 1) * everyPageData, $scope.option.curr * everyPageData);

	  	$scope.option.all = Math.ceil(userData.length / everyPageData);

			var pagination = $compile('<pagination page-option="option"></pagination>')($scope)[0];

			document.getElementById('pagination').appendChild(pagination);

			$scope.isSearch = false;

			$scope.search.name = '';

			temporaryAgent = '';
	  }

	}])