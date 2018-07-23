const utils = require(__basename + '/utils/utils.js');

const api = require(__basename + '/api/api.js');

const common = require(__basename + '/common/common.js');

class RouteController {

	constructor() {}

	//token拦截
	tokenController(req, res, next) {

		if (req.url == '/' || req.url == '/imgcode' || req.url == '/login') {
			return next();
		}
		var token = req.body._tVc || req.query._tVc;
		if (!token) {
			res.json(common.auth.fail);
		} else {
			//解析token
			utils.verifyToken(token, function (err, decode) {
				if (err) {
					res.json(common.auth.fail);
				} else {
					console.log(decode);
					req.phone = decode.name;
					next();
				}
			})
		}
	}

	//根
	indexController(req, res) {

		res.status(200).render('index');
	}

	userController(req, res) {
		api.findOne('User', ['username', 'auth', 'status'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.login.disabled);
					} else {
						result.dataValues.code = 1010;
						res.json(result.dataValues);
					}
				}
			})
			.catch(err => {
				console.log('userController出错了');
				res.json(common.server.error);
			})
	}

	//用户管理/总代理
	userlist1Controller(req, res) {
		api.findOne('User', ['phone', 'auth', 'status'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						var o = {};
						var auth = result.dataValues.auth;
						if (auth == 0) {
							o.auth = {
								$in: [1,2,3]
							}
						} else if (auth == 1) {
							o.auth = {
								$in: [2,3]
							}
						}
						var attrs = [
							'id',
							'username',
							'phone',
							'auth',
							'lastLoginTime',
							'loginCount',
							'address',
							'status',
							'position',
							'primaryRelationship',
							'secondaryRelationship'
						];
						api.findAndCountAll('User', attrs, o, Number(req.query.offset), Number(req.query.limit))
							.then(result => {
								res.json({count: result.count, data: result.rows, msg: '查询成功', code: 3000, auth: auth});
							})
							.catch(err => {
								console.log('userlist1Controller出错啦');
								res.json(common.server.error);
							})
					}
				} else {
					res.json(common.auth.fail);
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	getValidCodeController(req, res) {

		let validCode = utils.generateValidCode();

		return res.json({msg: `验证码已发至${req.body.email}邮箱`, validCode});
		
		let options = {
			from: config.emailOptions.auth.user,
			to: req.body.email,
			subject: '验证码',
			text: `您的验证码为: ${validCode}, 5分钟后过期`
		};

		utils.sendMail(options, (err, info) => {
			if (err) {
				res.json({msg: '验证码获取失败'});
			} else {
				res.json({msg: `验证码已发至${req.body.email}邮箱`, validCode});
			}
		})
	}

	registerController(req, res) {

		req.body.pwd = utils.addCrypto(req.body.pwd);

		api.register(req.body)
			.then(result => {
				res.json(common.register.sucesss);
			})
			.catch(err => {
				if (err.name === 'SequelizeUniqueConstraintError') {
					res.json(common.register.warning);
				} else {
					res.json(common.register.fail);
				}
				
			})

		
	}

	getImgCodeController(req, res) {
		let captcha = utils.generateImgCode();
		res.json({img: captcha.data, text: captcha.text.toLowerCase()});
	}

	loginController(req, res) {
		console.log(req.body);
		api.login('User', ['username','phone', 'pwd', 'auth', 'status', 'loginCount'], {phone: req.body.phone})
			.then(result => {
				if (result && result.dataValues) {

					//被禁用者不可登录
					if (result.dataValues.status === 0) {
						return res.json(common.login.disabled);
					}

					let pwd = utils.addCrypto(req.body.pwd);
					if (pwd === result.dataValues.pwd) {
						let token = utils.generateToken(req.body.phone);
						common.login.sucesss._tVc = token;
						common.login.sucesss.auth = result.dataValues.auth;
						common.login.sucesss.status = result.dataValues.status;
						common.login.sucesss.username = result.dataValues.username;

						//更新登录次数和最后登录时间
						let lastLoginTime = utils.formatDate(new Date());

						let loginCount = result.dataValues.loginCount + 1;
						let attrs = {
							lastLoginTime,
							loginCount
						};
						api.update('User', attrs, {
							phone: result.dataValues.phone
						})
						.then(result => {

							res.json(common.login.sucesss);
						})
						.catch(err => {
							console.log('loginController出错了');
							res.json(common.login.fail);
						})

						
					} else {
						res.json(common.login.info);
					}
					
				} else {
					res.json(common.login.warning);
				}
				
			})
			.catch(err => {
				console.log('loginController出错了');
				res.json(common.login.fail);
			})
	}


	navController(req, res) {
		console.log(req.body);

		//验证token合法性
		utils.verifyToken(req.body._tVc, function (err, decoded) {
			if (!err) {
				api.login('User', ['email', 'auth', 'vip'], {email: decoded.name})
					.then(result => {
						if (result && result.dataValues) {
							result.dataValues.isLogin = true;
							res.json(result.dataValues);
						}
					})
					.catch(err => {
						res.json({isLogin: false});
					})

			} else {
				res.json({isLogin: false});
			}
		})

		
	}

}

module.exports = new RouteController();