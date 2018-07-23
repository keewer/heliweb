angular.module('app')
	.controller('usermanageController', ['$scope', '$state', '$cookies', '$compile', 'API', 'TIP', function ($scope, $state, $cookies, $compile, API, TIP) {

		$scope.userInfo = {
			phone: '',
			pwd: '',
			repwd: '',
			username: '',
			idcard: '',
			address: ''
		};

		$scope.pageDataList = [];

		$scope.authority = -1;

		var isInit = true;

		//设置分页的参数
	  $scope.option = {
	    curr: 1,  //当前页数
	    all: 1,  //总页数
	    count: 10,  //最多显示的页数，默认为10

	    //点击页数的回调函数，参数page为点击的页数
	    click: function (page) {
	      $scope.option.curr = page;
	      initPagination();
	    }
	  };

		function initPagination() {
			var _tVc = $cookies.get('_tVc');
				if (!_tVc) {
					$state.go('login');
				} else {
					TIP.openLoading($scope);
					API.fetchGet('/userlist1', {_tVc: _tVc, offset: ($scope.option.curr - 1) * $scope.option.count, limit: $scope.option.count})
						.then(function (data) {
							console.log('data ==> ', data);
							TIP.hideLoading();
							if (data.data.code == 3000) {
								data.data.data.forEach(function (v, i) {
									v.num = i + ($scope.option.curr - 1) * $scope.option.count;
									v.lastLoginTime = new Date(v.lastLoginTime).formatDate('yyyy-MM-dd hh:mm:ss');
								})
								$scope.pageDataList = data.data.data;
								$scope.authority = data.data.auth;
								$scope.option.all = Math.ceil(data.data.count / $scope.option.count);
								
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
							console.log('错误啦');
						})
				}
		}

		initPagination();
		
	}])