angular.module('app')
	.controller('moneyDetailController', ['$scope', '$state', '$stateParams', '$cookies', '$compile', 'API', 'TIP', function ($scope, $state, $stateParams, $cookies, $compile, API, TIP) {
	
		var params = $stateParams.p.split('-');
		var moneyDetailInfo = {
			uid: params[0],
			startDate: new Date(+params[1]),
			endDate: new Date(+params[2])
		};

		var userData = [];

		//分页

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
		
		function init() {
			var startDate = new Date(moneyDetailInfo.startDate);
			var startYear = startDate.getFullYear();
			var startMonth = startDate.getMonth() + 1;
			var endDate = new Date(moneyDetailInfo.endDate);
			var endYear = endDate.getFullYear();
			var endMonth = endDate.getMonth() + 1;

			//开始时间始终是 yyyy-MM-01 00:00:00
			//结束时间需要符合以下规则
			//1,3,5,7,8,10,12 = yyyy-MM-31 23:59:59
			//4,6,9,11 = yyyy-MM-30 23:59:59
			//闰年2 = yyyy-MM-29 23:59:59
			//平年2 = yyyy-MM-28 23:59:59

			var bigMonth = [1, 3, 5, 7, 8, 10, 12];
			var smallMonth = [4, 6, 9, 11];

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
					end: end,
					uid: moneyDetailInfo.uid
				};

				TIP.openLoading($scope);
				API.fetchGet('/moneydetail', o)
					.then(function (data) {
						TIP.hideLoading();
						if (data.data.code == 3000) {
							//处理数据
							userData = data.data.data;
							var userId = data.data.id;
							userData.forEach(function (v, i) {
								var totalMoney = 0; //返利金额
								var moneyType = '';
								if (userId == v.primaryRelationship) {
									//一级返利
									totalMoney += v.count * v.firstLevel;
									moneyType = '一级返利';
								} else if (userId == v.secondaryRelationship) {
									//二级返利
									totalMoney += v.count * v.secondLevel;
									moneyType = '二级返利';
								} else if (userId == v.thirdRelationship) {
									//三级返利
									totalMoney += v.count * v.thirdLevel;
									moneyType = '三级返利';
								}

								v.totalMoney = Number(totalMoney.toFixed(2));
								v.moneyType = moneyType;
								v.num = i;
							})

							$scope.option.curr = 1;

							//截取数据
							$scope.pageDataList = userData.slice(($scope.option.curr - 1) * everyPageData, $scope.option.curr * everyPageData);

							//创建分页
							$scope.option.all = Math.ceil(userData.length / everyPageData);

							var pagination = $compile('<pagination page-option="option"></pagination>')($scope)[0];

							document.getElementById('pagination').appendChild(pagination);


						} else if (data.data.code == 4001) {
							$state.go('login');
						} else {
							TIP.openDialog(data.data.msg);
						}
					})
					.catch(function (err) {
						TIP.hideLoading();
					})


			}

		}

		init();

		 //分页切换
	  function togglePagination() {
	  	//截取数据
			$scope.pageDataList = userData.slice(($scope.option.curr - 1) * everyPageData, $scope.option.curr * everyPageData);
	  }

	}])