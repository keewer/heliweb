angular.module('app')
	.controller('usermanageController', ['$scope', '$state', '$cookies', 'API', 'TIP', function ($scope, $state, $cookies, API, TIP) {

		$scope.userInfo = {
			phone: '',
			pwd: '',
			repwd: '',
			username: '',
			idcard: '',
			address: ''
		};

		function pagination () {

			var isInit = true;

			//每一页最多显示几条数据
			var everyPageDate = 10;

			//分页
			//最多显示页码标签
			var pageCode = 10;

			//当前激活页码
			var activeCode = 1;

			//数据集合
			var userList = [];

			//分页数
			$scope.pageCounts = 1;

			//激活页码
			var activePage = null;

			//每一页显示数组数据
			$scope.pageDataList = [];

			//显示分页页码数组数据
			$scope.pageData = [];

			//所有分页页码数组数据
			var pageDatas = [];
			

			//权限
			$scope.authority = -1;

			//分页请求数据
			function getPageData(activeCode) {

				var _tVc = $cookies.get('_tVc');
				if (!_tVc) {
					$state.go('login');
				} else {
					TIP.openLoading($scope);
					API.fetchGet('/userlist1', {_tVc: _tVc, offset: (activeCode - 1) * everyPageDate, limit: everyPageDate})
						.then(function (data) {
							TIP.hideLoading();
							if (data.data.code == 3000) {
								data.data.data.forEach(function (v, i) {
									v.num = i;
									v.lastLoginTime = new Date(v.lastLoginTime).formatDate('yyyy-MM-dd hh:mm:ss');
								})
								$scope.pageCounts = Math.ceil(data.data.count / everyPageDate);
								$scope.pageDataList = data.data.data;
								$scope.authority = data.data.auth;
								if (isInit) {
									initPagination();
									isInit = false;
								}
								
							} else {
								TIP.openDialog(data.data.msg);
							}
							
						})
						.catch(function (err) {
							TIP.hideLoading();
							console.log('错误啦');
						})
				}

			}

			getPageData(activeCode);

			

			//初始化分页
			function initPagination() {

				generatePageCode();
			
				//生成页码数组数据
				function generatePageCode() {
					var initPageCode = $scope.pageCounts > pageCode ? pageCode : $scope.pageCounts;
					for (var i = 1; i <= initPageCode; i++) {
						var o = {};
						o.count = i;
		  			o.cls = {active: i === 1};
						$scope.pageData.push(o);
					}

					for (var j = 0; j < $scope.pageCounts; j++) {
						var obj = {};
						obj.count = j + 1;
		  			obj.cls = {active: j + 1 === 1};
						pageDatas.push(obj);
					}

					activePage = $scope.pageData[0];
					
				}

				//点击激活页码
				$scope.togglePage = function (item, index) {
					if (item.cls.active) {
						return;
					}
					activePage.cls.active = false;
					item.cls.active = true;
					activePage = item;

					//设置当前激活页码
					activeCode = item.count;

					getPageData(activeCode);
				
					controlPage(index);

				}

				//控制分页显示和切换
			  /*
				 *如果最大分页数量小于或者等于10, 则无需控制, 只需要设置激活当前分页
				 *如果点击当前分页数量的第7个或者7以上的页码, 将当前点击的页面推到第6个位置, 前面移除, 后面添加
			  */

			  function controlPage(index) {
			  	//index: 当前li的下标

			  	if ($scope.pageCounts <= pageCode) {
			  		return;
			  	}

			  	index = index + 1;

			  	if (index >= 7) {
				  	//移动几个
			  		var moveStep = index - 6;

			  		//获取当前显示最大页码
		  			var len = $scope.pageData.length - 1;

		  			var maxIndex = $scope.pageData[len].count;

		  			//计算全部页数与当前最大页码之差
		  			var page = $scope.pageCounts - maxIndex;

		  			//最多隐藏前面4个, 最多显示后面4个
		  			var newPages;

		  			if (page >= moveStep) {
			  			//则移动moveStep个数

			  			newPages = pageDatas.slice(maxIndex, maxIndex + moveStep);

			  			$scope.pageData.splice(0, moveStep);

			  		} else {
			  			//则移动page个数
			  			newPages = pageDatas.slice(maxIndex, maxIndex + page);

			  			$scope.pageData.splice(0, page);

			  		}

			  		newPages.forEach(function (v) {
			  				$scope.pageData.push(v);
			  		})
		  		}

			  }

		  	//上一页
		  	$scope.previousPage = function() {

			    if (activePage.count === 1) {
			      return;
			    }

			    activeCode = activePage.count - 1;

			    getPageData(activeCode);
			    
			    //如果当前页码不是1并且最后一页是最大分页数, 则显示页码上一页码, 隐藏后面一个
			    if ($scope.pageData[0].cls.active && $scope.pageData[0].count !== 1) {
			      $scope.pageData.splice($scope.pageData.length - 1, 1);
			      $scope.pageData.unshift(pageDatas.slice($scope.pageData[0].count - 2, $scope.pageData[0].count - 1)[0]);
			    }

			    for (var i = 1; i < $scope.pageData.length; i++) {
			      if ($scope.pageData[i].cls.active) {
			        $scope.pageData[i].cls.active = false;
			        $scope.pageData[i - 1].cls.active = true;
			        activePage = $scope.pageData[i - 1];
			        break;
			      }
			    }

		  	}

		  	//下一页
		  	$scope.nextPage = function() {
			    if (activePage.count === $scope.pageCounts) {
			      return;
			    }

			    activeCode = activePage.count + 1;

			    getPageData(activeCode);

			    // 如果当前页码是最后一页并且最后一页不是最大分页数, 则显示下一页页码, 第一个页码
			    if ($scope.pageData[$scope.pageData.length - 1].cls.active && $scope.pageData[$scope.pageData.length - 1].count !== $scope.pageCounts) {
			      $scope.pageData.splice(0, 1);
			      var l = $scope.pageData[$scope.pageData.length - 1].count;
			      $scope.pageData.push(pageDatas.slice(l, l + 1)[0])
			    }

			    for (var i = 0; i < $scope.pageData.length; i++) {
			      if ($scope.pageData[i].cls.active) {
			        $scope.pageData[i].cls.active = false;
			        $scope.pageData[i + 1].cls.active = true;
			        activePage = $scope.pageData[i + 1];
			        break;
			      }
			    }
			  }

	  	}

  	}

  	pagination();


	}])