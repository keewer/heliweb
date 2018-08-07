const utils = require(__basename + '/utils/utils.js');

const api = require(__basename + '/api/api.js');

const common = require(__basename + '/common/common.js');

class RouteController {

	constructor() {}

	//token拦截
	tokenController(req, res, next) {
		req.url = req.url.indexOf('?') > -1 ? req.url.split('?')[0] : req.url;
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
							'tp',
							'primaryRelationship',
							'secondaryRelationship',
							'thirdRelationship'
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
							'tp',
							'primaryRelationship',
							'secondaryRelationship',
							'thirdRelationship'
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

		api.findOne('User', ['username', 'id', 'auth', 'status', 'primaryRelationship', 'secondaryRelationship', 'rp', 'sp'], {phone: req.phone})
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
							ro.thirdRelationship = 0;
							ro.auth = 3;
							ro.position = '总代理';
						} else if (result.dataValues.auth == 3) {
							//总代理
							ro.primaryRelationship = Number(result.dataValues.id);
							ro.secondaryRelationship = Number(result.dataValues.primaryRelationship);
							ro.thirdRelationship = Number(result.dataValues.secondaryRelationship);
							ro.rp = result.dataValues.username;
							ro.sp = result.dataValues.rp;
							ro.tp = result.dataValues.sp;
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
								res.json({msg: '添加失败，手机号已存在或者身份证号已存在', code: 5001});
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
					if (result.dataValues.status == 0) {
						return res.json(common.login.disabled);
					}

					if (result.dataValues.auth == 4) {
						return res.json({msg: '该用户是分销商，无权限登录', code: 1010, auth: result.dataValues.auth});
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

		//测试不需要身份验证
		return res.json({reason: '认证通过'});

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

		api.findOne('Product', ['productNo', 'name'], {productNo: req.body.productNo})
			.then(result => {
				if (result && result.dataValues) {
					res.json({msg: `该商品编号已存在，${result.dataValues.productNo}：${result.dataValues.name}`, code: 3000});
				} else {
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
							res.json(common.add.success);
						} else {
							res.json(common.add.fail);
						}
						
					})
					.catch(err => {
						res.json(common.server.error);
					})
				}
			})
			.catch(err => {
				res.json(common.server.error);
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
			api.findOne('User', ['id', 'auth', 'status'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						if (result.dataValues.auth == 3) {
							//查找该总代理是否存在该分销商
							api.findOne('User', ['id', 'status', 'primaryRelationship', 'secondaryRelationship', 'thirdRelationship'], {
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
										let thirdRelationship = result.dataValues.thirdRelationship;
										let id = result.dataValues.id;

										//查询商品信息
										api.findOne('Product', ['productNo', 'name', 'price', 'status', 'firstLevel', 'secondLevel', 'thirdLevel'], {productNo: req.body.productNo})
											.then(result => {
												if (result && result.dataValues) {
													if (result.dataValues.status == 0) {
														res.json({msg: '该商品已被禁用，无法下单', code: 3002});
													} else {
														if (Number(result.dataValues.price) == Number(req.body.price)) {

															let productNo = result.dataValues.productNo;
															let name = result.dataValues.name;
															let price = result.dataValues.price;
															let firstLevel = result.dataValues.firstLevel;
															let secondLevel = result.dataValues.secondLevel;
															let thirdLevel = result.dataValues.thirdLevel

															//加入订单
															api.max('Order', 'id')
																.then(max => {
																	let year = new Date().getFullYear();
																	let orderNo = config.orderNoOptions.flag + year;
																	if (!max) {
																		//如果订单号不存在
																		orderNo += '0000000001';
																		api.create('Order', {
																			orderNo,
																			productNo,
																			name,
																			price,
																			count: req.body.count,
																			uid: id,
																			address: req.body.address,
																			status: 0,
																			primaryRelationship,
																			secondaryRelationship,
																			thirdRelationship,
																			auth: 4,
																			firstLevel,
																			secondLevel,
																			thirdLevel
																		})
																			.then(result => {
																				res.json({msg: '创建订单成功', code: 9000});
																			})
																			.catch(err => {
																				res.json(common.server.error);
																			})
																	} else {
																		//如果订单号存在
																		api.findOne('Order', ['orderNo'], {id: max})
																			.then(result => {
																				if (result && result.dataValues) {
																					let no = (+result.dataValues.orderNo.slice(orderNo.length) + 1).toString();
																					let strNO = no;
																					for (let i = 0; i < config.orderNoOptions.length - no.length; i++) {
																						strNO = '0' + strNO;
																					}
																					orderNo += strNO;
																					api.create('Order', {
																						orderNo,
																						productNo,
																						name,
																						price,
																						count: req.body.count,
																						uid: id,
																						address: req.body.address,
																						status: 0,
																						primaryRelationship,
																						secondaryRelationship,
																						thirdRelationship,
																						auth: 4,
																						firstLevel,
																						secondLevel,
																						thirdLevel
																					})
																						.then(result => {
																							res.json({msg: '创建订单成功', code: 9000});
																						})
																						.catch(err => {
																							res.json(common.server.error);
																						})
																	
																				} else {
																					res.json(common.server.error);
																				}
																			})
																			.catch(err => {
																				res.json(common.server.error);
																			})
																	}
																})
																.catch(err => {
																	res.json(common.server.error);
																})


														} else {
															res.json({msg: '该商品单价有改变，请刷新重新下单', code: 3003});
														}
													}
												} else {
													res.json({msg: '不能存在该商品', code: 3001});
												}
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

	//查询订单数目
	findOrderCountController(req, res) {
		api.findOne('User', ['id', 'status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						let currentId = result.dataValues.id;
						let auth = result.dataValues.auth;
						let id = -1;
						if (auth == 3) {
							//总代理查询名下订单数目
							id = result.dataValues.id
						} else {
							//先查询指定总代理id
							id = req.query.id;
						}

						let o = {
							primaryRelationship: id
						};

						if (req.query.orderNo) {
							o.orderNo = req.query.orderNo;
						}

						api.count('Order', o)
							.then(result => {
								res.json({msg: '查询成功', code: 3000, auth: auth, count: result, currentId});
							})
							.catch(err => {
								console.log('findOrderCountController出错啦');
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

	//查询分销商订单
	findOrderController(req, res) {
		api.findOne('User', ['id', 'username', 'status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {

					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						let currentId = result.dataValues.id;
						let id = -1;
						if (result.dataValues.auth == 3) {
							id = result.dataValues.id
						} else {
							//总经理, 营销总监, 客服
							//查询总代理id所有订单分页
							id = Number(req.query.id);
						}

						let username = result.dataValues.username;
						let auth = result.dataValues.auth;
						let sql = '';
						let o = {
							primaryRelationship: id,
							offseting: Number(req.query.offset),
							limiting: Number(req.query.limit)
						};
						if (req.query.orderNo) {
							sql = "SELECT `u`.`username`, `u`.`rp`, `u`.`phone`, `o`.* FROM `heli_user` AS `u` INNER JOIN `heli_order` AS `o` ON `u`.`id` = `o`.`uid` AND `o`.`primaryRelationship` = :primaryRelationship AND `o`.`orderNo` = :orderNo ORDER BY `o`.`id` DESC LIMIT :offseting, :limiting";
							o.orderNo = req.query.orderNo;
						} else {
							sql = "SELECT `u`.`username`, `u`.`rp`, `u`.`phone`, `o`.* FROM `heli_user` AS `u` INNER JOIN `heli_order` AS `o` ON `u`.`id` = `o`.`uid` AND `o`.`primaryRelationship` = :primaryRelationship ORDER BY `o`.`id` DESC LIMIT :offseting, :limiting";
						}
						//查询该总代理所有订单分页
						//联表查询分销商姓名和手机号

						api.query(sql, o)
							.then(result => {
								
								res.json({msg: '查询成功', code: 3000, auth, data: result, currentId});
							})
							.catch(err => {
								res.json(common.auth.fail);
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

	//查询总代理订单数量
	findAgentOrderCountController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						if (result.dataValues.auth == 3) {
							res.json(common.auth.fail);
						} else {
							let auth = result.dataValues.auth;
							let sql = "SELECT COUNT(`o`.`orderNo`) AS `count`, `u`.`id` AS `uid`, `u`.`username`, `u`.`phone`, `u`.`auth` FROM `heli_order` AS `o` INNER JOIN `heli_user` AS `u` ON `o`.`primaryRelationship` = `u`.`id` GROUP BY `o`.`primaryRelationship`";

							api.query(sql)
								.then(result => {
									if (result && Array.isArray(result)) {
										res.json({msg: '查询成功', code: 3000, count: result.length, auth});
									} else {
										res.json({msg: '没有数据', code: 3001, auth});
									}
								})
								.catch(err => {
									res.json(common.server.error);
								})
						}
					}
				} else {
					res.json(common.auth.fail);
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	//分页查询总代理订单汇总
	findAgentOrderController (req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						if (result.dataValues.auth == 3) {
							res.json(common.auth.fail);
						} else {
							let auth = result.dataValues.auth;
							let sql = '';
							let o = {
								offseting: Number(req.query.offset),
								limiting: Number(req.query.limit)
							};
							if (req.query.name) {
								o.username = req.query.name;
								sql = "SELECT COUNT(`o`.`orderNo`) AS `count`, `u`.`id` AS `uid`, `u`.`username`, `u`.`phone`, `u`.`auth` FROM `heli_order` AS `o` INNER JOIN `heli_user` AS `u` ON `o`.`primaryRelationship` = `u`.`id` AND `u`.`username` = :username GROUP BY `o`.`primaryRelationship` LIMIT :offseting, :limiting"
							} else {
								sql = "SELECT COUNT(`o`.`orderNo`) AS `count`, `u`.`id` AS `uid`, `u`.`username`, `u`.`phone`, `u`.`auth` FROM `heli_order` AS `o` INNER JOIN `heli_user` AS `u` ON `o`.`primaryRelationship` = `u`.`id` GROUP BY `o`.`primaryRelationship` LIMIT :offseting, :limiting"
							}

							api.query(sql, o)
								.then(result => {
									if (result && Array.isArray(result)) {
										res.json({msg: '查询成功', code: 3000, data: result, auth});
									} else {
										res.json({msg: '没有数据', code: 3001, auth});
									}
								})
								.catch(err => {
									res.json(common.server.error);
								})
						}
					}
				} else {
					res.json(common.auth.fail);
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	//付款订单
	payController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {

						//只有总代理才可以付款
						if (result.dataValues.auth == 3) {
							let payTime = utils.formatDate(new Date());
							//更新状态为待发货
							api.update('Order', {
								status: 1,
								payTime,
								money: req.body.money
							}, {
								id: req.body.id,
								orderNo: req.body.orderNo
							})
							.then(result => {
								if (result && Array.isArray(result)) {
									res.json({msg: '付款成功', code: 10000, data: result, status: 1});
								} else {
									res.json({msg: '付款失败', code: 10001, data: result, status: 0});
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
				res.json(common.server.error);
			})
	}

	//删除订单
	removeOrderController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {

						//只有总代理才可以删除
						if (result.dataValues.auth == 3) {

							//删除订单
							api.destroy('Order', {
								id: req.body.id,
								orderNo: req.body.orderNo,
								status: 0
							})
							.then(result => {
								console.log(result);
								res.json({msg: '删除成功', code: 9000, data: result, status: 4});
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
				res.json(common.server.error);
			})
	}

	//发货订单
	sendOrderController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {

						//只有客服才可以发货
						if (result.dataValues.auth == 2) {
							let sendTime = utils.formatDate(new Date());
							//更新状态为待收货2
							api.update('Order', {
								status: 2,
								sendTime
							}, {
								id: req.body.id,
								orderNo: req.body.orderNo
							})
							.then(result => {
								if (result && Array.isArray(result)) {
									res.json({msg: '发货成功', code: 10010, data: result, status: 2});
								} else {
									res.json({msg: '发货失败', code: 10011, data: result, status: 1});
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
				res.json(common.server.error);
			})
	}

	//收货
	receiveOrderController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {

						//只有总代理才可以收货
						if (result.dataValues.auth == 3) {
							let receiveTime = utils.formatDate(new Date());
							//更新状态为已收货3
							api.update('Order', {
								status: 3,
								receiveTime
							}, {
								id: req.body.id,
								orderNo: req.body.orderNo
							})
							.then(result => {
								if (result && Array.isArray(result)) {
									res.json({msg: '收货成功', code: 10020, data: result, status: 3});
								} else {
									res.json({msg: '收货失败', code: 10021, data: result, status: 2});
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
				res.json(common.server.error);
			})
	}

	//收货时, 确认分销商是否能够升级总代理
	promoteAgentController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						//查询升级总代理商品数量条件
						//只有总代理才可以查询
						if (result.dataValues.auth == 3) {

							api.findOne('Promote', ['promoteCount'], {id: 1})
								.then(result => {
									if (result && result.dataValues) {
										//统计当前分销商所有订单状态为3的数量
										let promoteCount = result.dataValues.promoteCount
										api.sum('Order', 'count', {
											uid: req.body.uid,
											status: 3
										})
										.then(result => {
											let resulting = result;
											//查找分销商是否升级为总代理, 如果升级则不需要不执行事务处理
											api.findOne('User', ['username', 'phone', 'auth'], {id: req.body.uid})
												.then(result => {
													if (result && result.dataValues) {
														if (result.dataValues.auth == 4) {
															if (resulting >= promoteCount) {
																let username = result.dataValues.username;
																let phone = result.dataValues.phone;
																//升级为总代理, 修改职位为总代理, 初始化密码, 权限 = 3, 修改订单表的权限值
																//开启事务处理
																let pwd = utils.addCrypto(config.initPwdOptions.pwd);
																api.transaction(t => {
																	//事务处理
																	return api.update('User', {pwd, auth: 3, position: '总代理'}, {id: req.body.uid}, {transaction: t})
																		.then(() => {
																			return api.update('Order', {auth: 3}, {uid: req.body.uid}, {transaction: t})
																		})
																})
																.then(result => {
																	res.json({msg: '查询成功', code: 3000, promoteCount, count: resulting, data: result, promote: true});
																	//短信通知用户升级为总代理
																	// utils.systemMessage({
																	// 	username,
																	// 	phone,
																	// 	password: config.initPwdOptions.pwd
																	// })
																	// 	.then(sys => {
																	// 		let {Code} = sys;
																	// 		if (Code == 'OK') {
																	// 			console.log('系统已发送短信通知用户升级为总代理');
																	// 		} else {
																	// 			console.log('系统发送短息失败');
																	// 		}
																	// 	})
																	// 	.catch(err => {
																	// 		console.log('系统发短信通知出现错误');
																	// 	})

																	
																})
																.catch(err => {
																	res.json(common.server.error);
																})

															} else {
																res.json({msg: '查询成功', code: 3000, promoteCount, count: result});
															}
														} else {
															res.json({msg: '收货成功', code: 10020});
														}
													} else {
														res.json(common.auth.fail)
													}
												})
												.catch(err => {
													res.json(common.server.error);
												})

											
										})
										.catch(err => {
											res.json(common.server.error);
										})
										
									} else {
										res.json({msg: '系统升级总代理商品数量条件未设置', code: 5000});
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
				res.json(common.server.error);
			})
	}

	//查询分销商升级为总代理条件数目
	promoteCountController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						//只有总经理才可以设置
						if (result.dataValues.auth == 0) {
							api.findOne('Promote', ['promoteCount'], {id: 1})
								.then(result => {
									if (result && result.dataValues) {
										res.json({msg: '查询成功', code: 3000, data: result.dataValues});
									} else {
										res.json({msg: '尚未设置', code: 3001, data: result});
									}
								})
								.catch(err => {
									res.json(common.server.error);
								})
						}
					}
				} else {
					res.json(common.auth.fail);
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	//设置分销商升级为总代理条件数目
	promoteController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						//只有总经理才可以设置
						if (result.dataValues.auth == 0) {
							api.create('Promote', {promoteCount: req.body.promoteCount})
								.then(result => {
									if (result) {
										res.json({msg: '添加成功', code: 3000, data: result});
									} else {
										res.json({msg: '添加失败', code: 3001});
									}
									
								})
								.catch(err => {
									res.json(common.server.error);
								})
						}
					}
				} else {
					res.json(common.auth.fail);
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	//修改分销商升级为总代理条件数目
	updatePromoteController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						//只有总经理才可以设置
						if (result.dataValues.auth == 0) {
							api.update('Promote', {promoteCount: req.body.promoteCount}, {id: 1})
								.then(result => {

									if (result) {
										res.json({msg: '修改成功', code: 3000, data: req.body.promoteCount});
									} else {
										res.json({msg: '修改失败', code: 3001});
									}
									
								})
								.catch(err => {
									res.json(common.server.error);
								})
						}
					}
				} else {
					res.json(common.auth.fail);
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	//添加订单反馈
	addCommentController(req, res) {
		api.findOne('User', ['id', 'username', 'status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						//根据订单id和订单编号查询订单信息
						//开启事务
						let id = result.dataValues.id;
						let username = result.dataValues.username;
						let auth = result.dataValues.auth;
						api.transaction(t => {
							//查询订单信息
							return api.findOne('Order', ['id', 'uid', 'orderNo', 'productNo', 'name', 'price', 'count', 'address', 'primaryRelationship'], {id: req.body.id, orderNo: req.body.orderNo, status: 3}, t)
								.then(order => {
									
									//查询该订单的总代理
									return api.findOne('User', ['username'], {id: order.dataValues.primaryRelationship}, t)
										.then(user => {

											//查询该订单分销商
											return api.findOne('User', ['username', 'phone'], {id: order.dataValues.uid}, t)
												.then(u => {

													//执行插入记录
													let o = {
														orderNo: order.dataValues.orderNo,
														oid: order.dataValues.id,
														agent: user.dataValues.username,
														distributor: u.dataValues.username,
														phone: u.dataValues.phone,
														content: req.body.content,
														username,
														uid: id
													};

													if (auth == 0) {
														o.zoreAuth = 0;
														o.oneAuth = 1;
														o.twoAuth = 1;
														o.threeAuth = 1;
													} else if (auth == 1) {
														o.zoreAuth = 1;
														o.oneAuth = 0;
														o.twoAuth = 1;
														o.threeAuth = 1;
													} else if (auth == 2) {
														o.zoreAuth = 1;
														o.oneAuth = 1;
														o.twoAuth = 0;
														o.threeAuth = 1;
													} else if (auth == 3) {
														o.zoreAuth = 1;
														o.oneAuth = 1;
														o.twoAuth = 1;
														o.threeAuth = 0;
													}
													return api.create('Comment', o, {transaction: t})
														.then(c => {
															return c;
														})

												})
											
										})
								})
						})
							.then(result => {
								res.json({data: result, code: 1});
							})
							.catch(err => {
								res.json(common.auth.fail);
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

	//查询订单反馈内容
	findCommentController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						let auth = result.dataValues.auth;
						let authKey = '';
						if (auth == 0) {
							authKey = 'zoreAuth';
						} else if (auth == 1) {
							authKey = 'oneAuth';
						} else if (auth == 2) {
							authKey = 'twoAuth';
						} else if (auth == 3) {
							authKey = 'threeAuth';
						}
						//启动事务
						api.transaction(t => {
							//查询该订单的反馈
							return api.findAlling('Comment', ['orderNo', 'oid', 'username', 'content', 'create_time'], {oid: req.query.id, orderNo: req.query.orderNo}, t)
									.then(c => {
										let o = {
											contents: []
										};
										if (c && Array.isArray(c)) {
											c.forEach(v => {
												o.contents.push(v.dataValues);
											})
										}
										return api.update('Comment', {[authKey]: 0}, {oid: req.query.id, orderNo: req.query.orderNo}, {transaction: t})
											.then(uc => {
												return o;
											})
									})
							})
						.then(result => {
							res.json({data: result});
						})
						.catch(err => {
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

	//查询反馈订单信息
	findOrderDataController(req, res) {
			api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						//启动事务
						api.transaction(t => {
							return api.findOne('Order', ['id', 'uid', 'orderNo', 'productNo', 'name', 'price', 'count', 'address', 'primaryRelationship', 'create_time'], {id: req.query.id, orderNo: req.query.orderNo}, t)
								.then(order => {
									
									return api.findOne('User', ['username'], {id: order.dataValues.primaryRelationship}, t)
										.then(user => {
											order.dataValues.agent = user.dataValues.username;

											return api.findOne('User', ['username', 'phone'], {id: order.dataValues.uid}, t)
												.then(u => {
													order.dataValues.username = u.dataValues.username;
													order.dataValues.phone = u.dataValues.phone;

													return order;
												})
										})

								})
						})
							.then(result => {
								res.json({data: result});
							})
							.catch(err => {
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

	//数据统计
	dataStatisticsController(req, res) {
		api.findOne('User', ['id', 'status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						let auth = result.dataValues.auth;
						let attrs = ['id', 'orderNo', 'productNo', 'name', 'price', 'count', 'money', 'receiveTime'];;
						let o = {
							productNo: req.query.productNo, 
							$and: [
								{receiveTime: {$gte: req.query.start}},
								{receiveTime: {$lte: req.query.end}}
							],
							status: 3
						};
						if (auth == 3) {
							//总代理
							o.primaryRelationship = result.dataValues.id;
							
						} else if (auth == 2) {
							//其他
							return res.json(ommon.auth.fail);
						}

						//013查询
						api.findAlling('Order', attrs, o)
							.then(result => {
								let data = [];
								if (result && Array.isArray(result)) {
									result.forEach(v => {
										data.push(v.dataValues);
									})
								}
								res.json({msg: '查询成功', code: 3000, data});
							})
							.catch(err => {
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

	//查询订单反馈是否浏览信息
	findCommentOfOrderNosController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						api.findAlling('Comment', ['id', 'orderNo', 'zoreAuth', 'oneAuth', 'twoAuth', 'threeAuth'], {
							orderNo: {
								$in: req.query.orderNos.split(',')
							}
						})
							.then(result => {
								let data = [];
								if (result && Array.isArray(result)) {
									result.forEach(v => {
										data.push(v.dataValues);
									})
								}
								res.json({msg: '查询成功', code: 3000, data});
							})
							.catch(err => {
								res.json(common.auth.fail);
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

	//获取手机验证码
	phoneCodeController(req, res) {
		api.findOne('User', ['phone', 'status', 'auth'], {phone: req.query.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else if (result.dataValues.auth == 4) {
						res.json({msg: '该手机用户为分销商，无权限修改', code: 3002});

					} else {
						//获取手机验证码
						let phoneCode = Math.random().toString().slice(-4);

						//测试拦截发送验证码
						return res.json({msg: '手机验证码已发至 ' + result.dataValues.phone, code: 3000, phoneCode});

						utils.sendMessage({phone: result.dataValues.phone, code: phoneCode})
							.then(sms => {
								 let {Code} = sms;
								  if (Code === 'OK') {
						        res.json({msg: '手机验证码已发至 ' + result.dataValues.phone, code: 3000, phoneCode});
    							} else {
    								res.json({msg: '手机验证码获取失败', code: 3003});
    							}
							})
							.catch(err => {
								res.json(common.server.error);
							})
						
					}
				} else {
					res.json({msg: '不存在该手机用户', code: 3001});
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	//重置密码
	forgotController(req, res) {
		api.findOne('User', ['phone', 'status', 'auth'], {phone: req.body.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else if (result.dataValues.auth == 4) {
						res.json({msg: '该手机用户为分销商，无权限修改', code: 3002});

					} else {
						//加密密码
						let pwd = utils.addCrypto(req.body.pwd);
						api.update('User', {pwd}, {phone: result.dataValues.phone})
							.then(result => {
								res.json({msg: '更新成功', code: 1});
							})
							.catch(err => {
								res.json(common.server.error);
							})
					}
				} else {
					res.json({msg: '不存在该手机用户', code: 3001})
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

	//查询
	moneyController(req, res) {
		api.findOne('User', ['status', 'auth'], {phone: req.phone})
			.then(result => {
				if (result && result.dataValues) {
					if (result.dataValues.status == 0) {
						//禁用
						res.json(common.auth.fail);
					} else {
						if (result.dataValues.auth == 3) {
							//如果当前用户是总代理, 仅查询当前用户订单信息
							

						} else if (result.dataValues.auth == 0 || result.dataValues.auth == 1) {
							//如果当前用户是总经理或者营销总监, 查询所有用户订单信息
							let sql = "SELECT `u`.`id` AS `uid`, `u`.`username`, `u`.`phone`, `o`.`id` AS `oid`, `o`.`orderNo`, `o`.`price`, `o`.`count`, `o`.`money`, `o`.`status`, `o`.`primaryRelationship`, `o`.`secondaryRelationship`, `o`.`thirdRelationship`, `o`.`firstLevel`, `o`.`secondLevel`, `o`.`thirdLevel`, `o`.`receiveTime` FROM `heli_user` AS `u` INNER JOIN `heli_order` AS `o` ON `u`.`id` = `o`.`primaryRelationship` AND `o`.`status` = 3 AND `o`.`receiveTime` >= :start AND `o`.`receiveTime` <= :end";
							 
							api.query(sql, {
								start: req.query.start, 
								end: req.query.end 
							})
								.then(result => {
									res.json({msg: '查询成功', code: 3000, data: result});
								})
								.catch(err => {
									res.json(common.server.error);
								})
						} else {
							//其他无权限查询
							res.json(common.auth.fail);
						}

					}
				} else {
					res.json({msg: '不存在该手机用户', code: 3001});
				}
			})
			.catch(err => {
				res.json(common.server.error);
			})
	}

}

module.exports = new RouteController();