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
			.state('home', {
				url: '',
				abstract: true,
				templateUrl: 'template/home/home.html',
				controller: 'homeController',
				resolve: {
					des: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('home');
					}]
				}
			})
			.state('home.usermanage', {
				url: '/usermanage',
				templateUrl: 'template/usermanage/usermanage.html',
				controller: 'usermanageController',
				resolve: {
					des: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('usermanage');
					}]
				}
			})

	}])