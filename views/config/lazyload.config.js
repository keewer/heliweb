(function () {
var app = angular.module('app');

//配置懒加载信息
app.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider", function ($provide, $compileProvider, $controllerProvider, $filterProvider) {
 app.controller = $controllerProvider.register;
 app.directive = $compileProvider.directive;
 app.filter = $filterProvider.register;
 app.factory = $provide.factory;
 app.service = $provide.service;
 app.constant = $provide.constant;
}])
	.config(["$ocLazyLoadProvider", "lazyLoadFile", function ($ocLazyLoadProvider, lazyLoadFile) {
		$ocLazyLoadProvider.config({
	 		debug: false, //是否开启调试模式
	 		events: false, //是否启动广播
	 		modules: lazyLoadFile
 		});
	}]);
	
})();