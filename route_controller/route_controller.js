const utils = require(__basename + '/utils/utils.js');

const api = require(__basename + '/api/api.js');

const common = require(__basename + '/common/common.js');

console.log(utils.addCrypto('440883199012032614'));

class RouteController {

	constructor() {}

	//token拦截
	tokenController(req, res, next) {

		if (config.ignoreUrls.includes(req.url)) {
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

	//查询次于查询者权限以下用户数量
	userCountController(req, res) {
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
						if (req.query.username) {
							o.username = req.query.username;
						}

						api.count('User', o)
							.then(result => {
								res.json({msg: '查询成功', code: 3000, auth: auth, count: result});
							})
							.catch(err => {
								console.log('userCountController出错啦');
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

	//查询分销商
	distributorConutController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						let auth = result.dataValues.auth;
						let o = {
							auth: 4,
							primaryRelationship: req.query.id
						};

						api.count('User', o)
							.then(result => {
								res.json({msg: '查询成功', code: 3000, id: req.query.id, auth: auth, count: result});
							})
							.catch(err => {
								console.log('distributorConutController出错啦');
								res.json(common.server.error);
							})

					}
				}	else {
					res.json(common.auth.fail);
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	//查询总代理名下分销商
	selectDistributorOfAgentConutController(req, res) {
		api.findOne('User', ['id', 'status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						let auth = result.dataValues.auth;
						let id = result.dataValues.id;
						let o = {
							auth: 4,
							primaryRelationship: req.query.id
						};
						
						let attrs = [
							'id',
							'username',
							'phone',
							'auth',
							'lastLoginTime',
							'loginCount',
							'address',
							'status',
							'position',
							'rp',
							'sp',
							'primaryRelationship',
							'secondaryRelationship'
						];

						if (req.query.username) {
							o.username = req.query.username;
						}
						api.findAll('User', attrs, o, Number(req.query.offset), Number(req.query.limit), [['id', 'DESC']])
							.then(result => {
								if (result && Array.isArray(result)) {
									let data = [];
									result.forEach(v => {
										data.push(v);
									})
									res.json({msg: '查询成功', code: 3000, id, auth, data});
								} else {
									res.json({msg: '没有数据', code: 3001});
								}
								
							})
							.catch(err => {
								console.log('userCountController出错啦');
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

	//查询次于查询者权限以下最新用户
	lastUserController(req, res) {
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
							'rp',
							'sp',
							'primaryRelationship',
							'secondaryRelationship'
						];

						if (req.query.username) {
							o.username = req.query.username;
						}
						api.findAll('User', attrs, o, Number(req.query.offset), Number(req.query.limit), [['id', 'DESC']])
							.then(result => {
								if (result && Array.isArray(result)) {
									let data = [];
									result.forEach(v => {
										data.push(v);
									})
									res.json({msg: '查询成功', code: 3000, auth, data});
								} else {
									res.json({msg: '没有数据', code: 3001, auth: auth});
								}
								
							})
							.catch(err => {
								console.log('userCountController出错啦');
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

	//查询当前用户信息
	userController(req, res) {
		api.findOne('User', ['id', 'username', 'phone', 'auth', 'status', 'idcard', 'position', 'address'], {phone: req.phone})
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

	//切换用户状态
	changeUserStatusController(req, res) {
		api.findOne('User', ['status'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						api.update('User', {
							status: Number(req.body.status)
						}, {id: Number(req.body.id), phone: req.body.phone})
						.then(result => {
							console.log(result);
							res.json({msg: '更新成功', code: 6000, status: req.body.status});
						})
						.catch(err => {
							console.log('changeUserStatusController出错了');
							res.json(common.server.error);
						})
					}
				} else {
					res.json(common.auth.fail);
				}
				
			})
			.catch(err => {
				console.log('changeUserStatusController出错了');
				res.json(common.server.error);
			})
		
	}

	//添加用户
	addUserController(req, res) {

		api.findOne('User', ['username', 'id', 'auth', 'status', 'primaryRelationship', 'rp'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {

						req.body.pwd = utils.addCrypto(req.body.pwd);

						let ro = {};
						for (let key in req.body) {
							ro[key] = req.body[key];
						}

						if (result.dataValues.auth == 1) {
							//营销总监
							ro.primaryRelationship = 0;
							ro.secondaryRelationship = 0;
							ro.auth = 3;
							ro.position = '总代理';
						} else if (result.dataValues.auth == 3) {
							//总代理
							ro.primaryRelationship = Number(result.dataValues.id);
							ro.secondaryRelationship = Number(result.dataValues.primaryRelationship);
							ro.rp = result.dataValues.username;
							ro.sp = result.dataValues.rp;
							ro.auth = 4;
							ro.position = '分销商';
						}

						api.create('User', ro)
							.then(result => {
								if (result) {
									res.json(common.add.success);
								} else {
									res.json(common.add.fail);
								}
							})
							.catch(err => {
								console.log('addUserController出错了');
								res.json(common.server.error);
							})


					}
				}	else {
					res.json(common.auth.fail);
				}
			})
			.catch(err => {
				console.log('addUserController出错了');
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

	getImgCodeController(req, res) {
		let captcha = utils.generateImgCode();
		res.json({img: captcha.data, text: captcha.text.toLowerCase()});
	}

	loginController(req, res) {

		api.login('User', ['id', 'username', 'phone', 'pwd', 'auth', 'status', 'loginCount'], {phone: req.body.phone})
			.then(result => {
				if (result && result.dataValues) {

					//被禁用者不可登录
					if (result.dataValues.status === 0) {
						return res.json(common.login.disabled);
					}

					let pwd = utils.addCrypto(req.body.pwd);
					if (pwd === result.dataValues.pwd) {
						let token = utils.generateToken(result.dataValues.phone);
						common.login.sucesss._tVc = token;
						common.login.sucesss.auth = result.dataValues.auth;
						common.login.sucesss.status = result.dataValues.status;
						common.login.sucesss.username = result.dataValues.username;
						common.login.sucesss.id = result.dataValues.id;

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

	verifyIdcardController(req, res) {

		let params = {
			key: config.verifyIdcardOptions.key,
			cardNo: req.body.cardNo,
			realName: req.body.realName,
			information: config.verifyIdcardOptions.information
		};

		utils.verifyIdcard(params, result => {
			res.send(result);
		})
	}

	addProductController(req, res) {
		api.create('Product', {
			productNo: req.body.productNo,
			name: req.body.name,
			price: req.body.price,
			firstLevel: req.body.firstlevel,
			secondLevel: req.body.secondlevel,
			thirdLevel: req.body.thirdlevel,
		})
		.then(result => {
			if (result && result.dataValues) {
				res.send(common.add.success);
			} else {
				res.send(common.add.fail);
			}
			
		})
		.catch(err => {
			res.json(common.add.fail);
		})
	}

	updateProductController(req, res) {
		api.update('Product', {
			price: req.body.price,
			firstLevel: req.body.firstlevel,
			secondLevel: req.body.secondlevel,
			thridLevel: req.body.thridlevel
		}, {id: Number(req.body.id)})
		.then(result => {
			console.log(result);
			res.json({msg: '更新成功', code: 3000});
		})
		.catch(err => {
			res.json(common.server.error);
		})
	}

	//查询商品数量和所有产品
	findProductCountController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						let auth = result.dataValues.auth;

						api.findAndCountAll('Product', ['id', 'productNo', 'name', 'price', 'firstLevel', 'secondLevel', 'thirdLevel'], {status: 1})
							.then(result => {

								res.json({msg: '查询成功', code: 3000, auth, count: result.count, data: result.rows});
							})
							.catch(err => {
								console.log('findProductCountController出错啦');
								res.json(common.server.error);
							})
					}
				}	else {
					res.json(common.auth.fail);
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	//查询商品数量
	findProductNumsController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						let auth = result.dataValues.auth;
						api.count('Product')
							.then(result => {
								res.json({msg: '查询成功', code: 3000, auth: auth, count: result});
							})
							.catch(err => {
								console.log('findProductNumsController出错啦');
								res.json(common.server.error);
							})
					}
				}	else {
					res.json(common.auth.fail);
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	//查询商品
	findProductController(req, res) {
		api.findOne('User', ['auth', 'status'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						var o = {
							id: {
								$ne: 0
							}
						};
						var auth = result.dataValues.auth;
						var attrs = [
							'id',
							'productNo',
							'name',
							'price',
							'status',
							'firstLevel',
							'secondLevel',
							'thirdLevel',
							'create_time'
						];

						if (req.query.name) {
							o.name = req.query.name;
						}
						api.findAll('Product', attrs, o, Number(req.query.offset), Number(req.query.limit), [['id', 'DESC']])
							.then(result => {
								if (result && Array.isArray(result)) {
									let data = [];
									result.forEach(v => {
										data.push(v);
									})
									res.json({msg: '查询成功', code: 3000, auth, data});
								} else {
									res.json({msg: '没有数据', code: 3001, auth: auth});
								}
								
							})
							.catch(err => {
								console.log('findProductController出错啦');
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

	//切换商品状态
	changeProductStatusController(req, res) {
		api.findOne('User', ['auth', 'status'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						let auth = result.dataValues.auth;
						api.update('Product', {
							status: Number(req.body.status)
						}, {id: Number(req.body.id)})
						.then(result => {
							res.json({msg: '更新成功', code: 6000, auth, status: req.body.status});
						})
						.catch(err => {
							console.log('changeProductStatusController出错了');
							res.json(common.server.error);
						})
					}
				} else {
					res.json(common.auth.fail);
				}
				
			})
			.catch(err => {
				console.log('changeProductStatusController出错了');
				res.json(common.server.error);
			})
		
	}

	//修改地址
	modifyAddressController(req, res) {
		api.findOne('User', ['id', 'status'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						api.update('User', {
							address: req.body.address
						}, {id: Number(result.dataValues.id)})
						.then(result => {
							res.json({msg: '更新成功', code: 6000});
						})
						.catch(err => {
							console.log('modifyAddressController出错了');
							res.json(common.server.error);
						})
					}
				} else {
					res.json(common.auth.fail);
				}
				
			})
			.catch(err => {
				console.log('modifyAddressController出错了');
				res.json(common.server.error);
			})
	}

	//修改密码
	modifyPwdController(req, res) {
		api.findOne('User', ['id', 'pwd', 'status'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						let pwd = utils.addCrypto(req.body.oldpwd);
						if (pwd != result.dataValues.pwd) {
							res.json(common.login.info);
						} else {
							let newpwd = utils.addCrypto(req.body.newpwd);
							api.update('User', {
								pwd: newpwd
							}, {id: Number(result.dataValues.id)})
							.then(result => {
								res.json({msg: '更新成功', code: 6000});
							})
							.catch(err => {
								console.log('modifyPwdController出错了');
								res.json(common.server.error);
							})
						}
					}
				} else {
					res.json(common.auth.fail);
				}
				
			})
			.catch(err => {
				console.log('modifyPwdController出错了');
				res.json(common.server.error);
			})
	}

	//加入订单
	addOrderController(req, res) {
			api.findOne('User', ['id', 'username', 'phone', 'auth', 'status', 'primaryRelationship', 'secondaryRelationship'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						if (result.dataValues.auth == 3) {
							//查找该总代理是否存在该分销商
							api.findOne('User', ['id', 'username', 'phone', 'primaryRelationship', 'secondaryRelationship'], {
								phone: req.body.phone,
								username: req.body.receive,
								primaryRelationship: result.dataValues.id,
								auth: 4
							})
							.then(result => {
								if (result && result.dataValues) {

									if (result.dataValues.status == 0) {
										res.json({msg: '该分销商已被禁用，无法下单', code: 8001});
									} else {
										let primaryRelationship = result.dataValues.primaryRelationship;
										let secondaryRelationship = result.dataValues.secondaryRelationship;
										let id = result.dataValues.id;
										api.max('Order', 'orderNo')
											.then(max => {
												let year = new Date().getFullYear();
												let orderNo = config.orderNoOptions.flag + year;
												if (!max) {
													//如果订单号不存在
													orderNo += '0000000001';
												} else {
													//如果订单号存在
													let no = (+max.slice(orderNo.length) + 1).toString();
													let strNO = no;
													for (let i = 0; i < config.orderNoOptions.length - no.length; i++) {
														strNO = '0' + strNO;
													}
													orderNo += strNO;
												}

												api.create('Order', {
													orderNo,
													productNo: req.body.productNo,
													name: req.body.productName,
													price: req.body.price,
													count: req.body.count,
													uid: id,
													address: req.body.address,
													status: 0,
													primaryRelationship,
													secondaryRelationship
												})
													.then(result => {
														res.json({msg: '创建订单成功', code: 9000});
													})
													.catch(err => {
														res.json(common.server.error);
													})
												
											})
											.catch(err => {
												res.json(common.server.error);
											})
									}

								} else {
									res.json({msg: '不存在该分销商，请核对分销商姓名和手机号', code: 8002});
								}
							})
							.catch(err => {
								res.json(common.server.error);
							})
						} else {
							res.json(common.auth.fail);
						}
					}
				} else {
					res.json(common.auth.fail);
				}
				
			})
			.catch(err => {
				console.log('modifyPwdController出错了');
				res.json(common.server.error);
			})
	}

}

module.exports = new RouteController();