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

	app.post('/adduser', routeController.addUserController);

	//查询当前总代理名下的分销商数量
	app.get('/distributorconut', routeController.distributorConutController);

	//查询当前总代理名下的分销商
	app.get('/selectdistributorofagent', routeController.selectDistributorOfAgentConutController);

	app.post('/validcode', routeController.getValidCodeController);

	app.get('/imgcode', routeController.getImgCodeController);

	app.post('/login', routeController.loginController);

	app.post('/verifyidcard', routeController.verifyIdcardController);

	app.get('/findproductcount', routeController.findProductCountController);

	app.put('/addproduct', routeController.addProductController);

	app.post('/updateproduct', routeController.updateProductController);

	app.get('/findproductnums', routeController.findProductNumsController);

	app.get('/findproduct', routeController.findProductController);

	app.post('/changeproductstatus', routeController.changeProductStatusController);

	app.post('/modifyaddress', routeController.modifyAddressController);

	app.post('/modifypwd', routeController.modifyPwdController);

	app.put('/addorder', routeController.addOrderController);

	app.get('/findordercount', routeController.findOrderCountController);

	app.get('/findorder', routeController.findOrderController);

	app.get('/findagentordercount', routeController.findAgentOrderCountController);

	app.get('/findagentorder', routeController.findAgentOrderController);

	app.post('/pay', routeController.payController);

	app.post('/removeorder', routeController.removeOrderController);

	app.post('/sendorder', routeController.sendOrderController);

	app.post('/receiveorder', routeController.receiveOrderController);

	app.get('/promotecount', routeController.promoteCountController);

	app.post('/promote', routeController.promoteController);

	app.post('/updatepromote', routeController.updatePromoteController);

	app.post('/promoteagent', routeController.promoteAgentController);

	app.put('/addcomment', routeController.addCommentController);

	app.get('/findcomment', routeController.findCommentController);

	app.get('/findorderdata', routeController.findOrderDataController);

	app.get('/datastatistics', routeController.dataStatisticsController);

	app.get('/findcommentofordernos', routeController.findCommentOfOrderNosController);

	app.get('/phonecode', routeController.phoneCodeController);

	app.post('/forgot', routeController.forgotController);

	app.get('/money', routeController.moneyController);

	app.get('/moneydetail', routeController.moneyDetailController);

}