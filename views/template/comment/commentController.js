angular.module('app')
	.controller('commentController', ['$scope', '$cookies', '$stateParams', 'API', 'TIP', function ($scope, $cookies, $stateParams, API, TIP) {

		$scope.isComment = false;

		$scope.commentInfo = {
			content: ''
		}

		$scope.comment = function () {
			$scope.isComment = true;
		}

		$scope.cancelComement = function () {
			$scope.isComment = false;
			$scope.commentInfo.content = '';
		}

		$scope.commitComment = function () {
			$scope.commentInfo.content = $scope.commentInfo.content == null ? '' : $scope.commentInfo.content.trim();
			if (!$scope.commentInfo.content) {
				TIP.openDialog('请输入反馈内容');
				return;
			} else if (/[<>]/.test($scope.commentInfo.content)) {
				TIP.openDialog('反馈内容不能含有< >符号');
				return;
			}

			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				var o = {
					_tVc: _tVc,
					id: $stateParams.id,
					orderNo: $stateParams.orderNo,
					content: $scope.commentInfo.content
				};

				TIP.openLoading($scope);
				API.fetchPut('/addcomment', o)
					.then(function (data) {
						if (data.data.code == 1) {
							$scope.comments.contents.push(data.data.data);
						}
						TIP.hideLoading();
						$scope.isComment = false;
						$scope.commentInfo.content = '';
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}

		$scope.comments = {
			order: {},
			contents: []
		};

		init();

		function init() {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				var o = {
					_tVc: _tVc,
					id: $stateParams.id,
					orderNo: $stateParams.orderNo,
				};

				TIP.openLoading($scope);
				API.fetchGet('/findcomment', o)
					.then(function (data) {
						TIP.hideLoading();
						$scope.comments.contents = data.data.data.contents;
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}

		}

		getOrderData();

		function getOrderData() {
			var _tVc = $cookies.get('_tVc');
		  if (!_tVc) {
				$state.go('login');
			} else {
				var o = {
					_tVc: _tVc,
					id: $stateParams.id,
					orderNo: $stateParams.orderNo,
				};

				TIP.openLoading($scope);
				API.fetchGet('/findorderdata', o)
					.then(function (data) {
						TIP.hideLoading();
						$scope.comments.order = data.data.data;
					})
					.catch(function (err) {
						TIP.hideLoading();
						TIP.openDialog('服务器报错');
					})
			}
		}

	}])