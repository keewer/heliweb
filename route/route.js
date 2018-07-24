const routeController = require(__basename + '/route_controller/route_controller.js');

module.exports = function (app) {

	//token拦截
	app.use(routeController.tokenController);

	//根
	app.get('/', routeController.indexController);

	//查询当前用户信息
	app.get('/user', routeController.userController);

	//查询次于查询者权限以下用户数量
	app.get('/usercount', routeController.userCountController);

	//查询次于查询者权限以下最新用户
	app.get('/lastuser', routeController.lastUserController);

	//切换用户状态, 正常和禁用
	app.post('/changeuserstatus', routeController.changeUserStatusController);

	app.get('/searchuser', routeController.searchUserController);

	//用户管理/总代理
	app.get('/userlist1', routeController.userlist1Controller);

	app.post('/validcode', routeController.getValidCodeController);

	app.post('/register', routeController.registerController);

	app.get('/imgcode', routeController.getImgCodeController);

	app.post('/login', routeController.loginController);

	app.post('/nav', routeController.navController);

}