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
		},
		{
			name: 'distributor',
			files: [
				'template/distributor/distributor.css',
				'template/distributor/distributorController.js'
			]
		},
		{
			name: 'order',
			files: [
				'template/order/order.css',
				'template/order/orderController.js'
			]
		},
		{
			name: 'data',
			files: [
				'template/data/data.css',
				'template/data/dataController.js'
			]
		},
		{
			name: 'person',
			files: [
				'template/person/person.css',
				'template/person/personController.js'
			]
		},
		{
			name: 'agentorder',
			files: [
				'template/agentorder/agentorder.css',
				'template/agentorder/agentorderController.js'
			]
		},
		{
			name: 'product',
			files: [
				'template/product/product.css',
				'template/product/productController.js'
			]
		},
		{
			name: 'comment',
			files: [
				'template/comment/comment.css',
				'template/comment/commentController.js'
			]
		}
	]);