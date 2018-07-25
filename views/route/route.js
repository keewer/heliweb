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
			.state('home.distributor', {
				url: '/distributor/:id',
				templateUrl: 'template/distributor/distributor.html',
				controller: 'distributorController',
				resolve: {
					des: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('distributor');
					}]
				}
			})
			.state('home.order', {
				url: '/order',
				templateUrl: 'template/order/order.html',
				controller: 'orderController',
				resolve: {
					des: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('order');
					}]
				}
			})
			.state('home.data', {
				url: '/data',
				templateUrl: 'template/data/data.html',
				controller: 'dataController',
				resolve: {
					des: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('data');
					}]
				}
			})
			.state('home.person', {
				url: '/person',
				templateUrl: 'template/person/person.html',
				controller: 'personController',
				resolve: {
					des: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('person');
					}]
				}
			})
			.state('home.agentorder', {
				url: '/agentorder',
				templateUrl: 'template/agentorder/agentorder.html',
				controller: 'agentorderController',
				resolve: {
					des: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('agentorder');
					}]
				}
			})
			.state('home.product', {
				url: '/product',
				templateUrl: 'template/product/product.html',
				controller: 'productController',
				resolve: {
					des: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('product');
					}]
				}
			})

	}])