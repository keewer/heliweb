angular.module('app')
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/login');

		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'template/login/login.html',
				controller: 'loginController',
				resolve: {
					des: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('login');
					}]
				}
			})
			.state('forgot', {
				url: '/forgot',
				templateUrl: 'template/forgot/forgot.html',
				controller: 'forgotController',
				resolve: {
					des: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('forgot');
					}]
				}
			})

	}])