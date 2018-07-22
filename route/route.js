const routeController = require(__basename + '/route_controller/route_controller.js');

module.exports = function (app) {

	//根
	app.get('/', routeController.indexController);

	//token拦截
	app.use(routeController.tokenController);

	//用户管理/总代理
	app.get('/userlist1', routeController.userlist1Controller)

	app.post('/validcode', routeController.getValidCodeController);

	app.post('/register', routeController.registerController);

	app.get('/imgcode', routeController.getImgCodeController);

	app.post('/login', routeController.loginController);

	app.post('/nav', routeController.navController);

}