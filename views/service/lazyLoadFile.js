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
		}
	]);