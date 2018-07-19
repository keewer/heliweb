angular.module('app')
	.constant('lazyLoadFile', [
		{
			name: 'login',
			files: [
				'template/login/login.css',
				'template/login/loginController.js'
			]
		},
		{
			name: 'forgot',
			files: [
				'template/forgot/forgot.css',
				'template/forgot/forgotController.js'
			]
		},
		{
			name: 'home',
			files: [
				'template/home/home.css',
				'template/home/homeController.js'
			]
		},
		{
			name: 'usermanage',
			files: [
				'template/usermanage/usermanage.css',
				'template/usermanage/usermanageController.js'
			]
		}
	]);