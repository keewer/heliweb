angular.module('app')
	.controller('dataController', ['$scope', '$state', '$cookies', 'API', 'TIP', 'chart', function ($scope, $state, $cookies, API, TIP, chart) {

		var chartInstance = null;

		$scope.authority = -1;

		$scope.isShowData = false;

		$scope.dataInfo = {
			productNo: '',
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
							productNo: $scope.dataInfo.productNo,
							start: start,
							end: end
						};

						TIP.openLoading($scope);
						//发送请求
						API.fetchGet('/datastatistics', o)
							.then(function (data) {
								TIP.hideLoading($scope);
								if (data.data.code == 3000) {
									var datas = data.data.data;
									if (datas.length == 0) {
										TIP.openDialog('没有数据');
										return;
									}
									//生成该时间年月数组
									var monthData = [];
									for (var i = 0; i < totalMonth; i++) {
										var d = startMonth + i;
										if (d > 12) {
											d = startMonth + i - 12;
											monthData.push(startYear + 1 + '-' + (d >= 10 ? d : '0' + d));
										} else {
											monthData.push(startYear + '-' + (d >= 10 ? d : '0' + d));
										}
									}

									//统计后台返回数据, 将相同年份月份数据求和
									var allData = [];
									var allCount = 0;
									var allMoney = 0
									for (var j = 0; j < monthData.length; j++) {
										var count = 0;
										for (var k = 0; k < datas.length; k++) {
											if (datas[k].receiveTime.indexOf(monthData[j]) > -1) {
												count += datas[k].count;
											}

											if (j == 0) {
												allMoney += datas[k].money;
											}
										}

										//累加总量
										allCount += count;

										//加入allData
										allData.push(count);
									}

									//展示统计数据
									chartInstance = chart.generateChart('chart', datas[0].productNo + '：' + datas[0].name +'销量总量 ' + allCount + '   销售总额 ' + allMoney, monthData, allData);

									$scope.isShowData = true;

								}
							})
							.catch(function (err) {
								TIP.hideLoading($scope);
							})
					}

				}
			}


			
		};

		$scope.clearChart = function () {
			chart.clearChart(chartInstance);
			$scope.isShowData = false;
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
						console.log(data);
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