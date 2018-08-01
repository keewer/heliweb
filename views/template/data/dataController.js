angular.module('app')
	.controller('dataController', ['$scope', '$state', '$cookies', 'API', 'TIP', 'chart', function ($scope, $state, $cookies, API, TIP, chart) {

		var chartInstance = null;

		$scope.authority = -1;

		$scope.isShowData = false;

		$scope.dataInfo = {
			id: '',
			startDate: '',
			endDate: ''
		}
		
		$scope.generateChart = function () {
			var startDate = new Date($scope.dataInfo.startDate);
			var startYear = startDate.getFullYear();
			var startMonth = startDate.getMonth() + 1;
			var endDate = new Date($scope.dataInfo.endDate);
			var endYear = endDate.getFullYear();
			var endMonth = endDate.getMonth() + 1;

			//开始日期和结束日期不能超过12个月

			if (startYear > endYear) {
				TIP.openDialog('开始年份不能大于结束年份');
			} else {
				//计算月份时间差
				var ym = (endYear - startYear) * 12;
				var mm = endMonth - startMonth + 1;

				if ((ym + mm) > 12) {
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

					console.log('start ==> ', start);
					console.log('end ==> ', end);

				}
			}


			return;
			chartInstance = chart.generateChart('chart', '天香鸡销量', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'], [120, 200, 150, 80, 70, 110, 130, 160, 174, 198, 208, 307]);
		};

		$scope.clearChart = function () {
			chart.clearChart(chartInstance);
		}

		$scope.selectProduct = function (productId) {
			console.log(productId);
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
							if (data.data.auth == 2) {
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
        
	}])