const utils = require(__basename + '/utils/utils.js');

let p = utils.addCrypto('123456');
console.log('p ==> ', p);

const api = require(__basename + '/api/api.js');

const common = require(__basename + '/common/common.js');

class RouteController {

	constructor() {}

	//token拦截
	tokenController(req, res, next) {
		var token = req.body._tVc;
		if (!token) {
			res.json({msg: '尚未登录', code: 4001});
		} else {
			//解析token
			utils.verifyToken(token, function (err, decode) {
				if (err) {
					res.json({msg: '尚未登录', code: 4001});
				} else {
					console.log(decode);
					res.json({msg: '身份验证成功', code: 4000});
				}
			})
		}
	}

	//根
	indexController(req, res) {

		res.status(200).render('index');
	}

	//用户管理/总代理
	userlist1Controller(req, res) {
		res.json({msg: 'success'});
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
		api.login('User', ['phone', 'pwd', 'auth', 'status'], {phone: req.body.phone})
			.then(result => {
				if (result && result.dataValues) {
					let pwd = utils.addCrypto(req.body.pwd);

					if (pwd === result.dataValues.pwd) {
						let token = utils.generateToken(req.body.phone);
						common.login.sucesss._tVc = token;
						common.login.sucesss.auth = result.dataValues.auth;
						common.login.sucesss.status = result.dataValues.status;
						res.json(common.login.sucesss);
					} else {
						res.json(common.login.info);
					}
					
				} else {
					res.json(common.login.warning);
				}
				
			})
			.catch(err => {
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