angular.module('app')
	.provider('TIP', {
		$get: ['ngDialog', '$compile', function (ngDialog, $compile) {

			return {
				openDialog: function (msg) {
					ngDialog.open({
		    		template: 'template/tip/tip.html',
		    		controller: ['$scope', function ($scope) {
		    			$scope.tipMsg = msg;
		    		}]
					});
				},

				openLoading: function (scope) {
					var loading = $compile('<loading></loading>')(scope)[0];
					document.body.appendChild(loading);
				},

				hideLoading: function () {
					var loading = document.getElementById('loading');
					if (loading) {
						document.body.removeChild(loading);
					}
				}
			}

		}]
	})