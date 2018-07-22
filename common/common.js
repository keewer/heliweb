module.exports = {
	register: {
		sucesss: {
			msg: '注册成功',
			code: 1000
		},

		warning: {
			msg: '用户已存在',
			code: 1001
		},

		fail:{
			msg: '注册失败',
			code: 1002
		}
	},

	login: {
		sucesss: {
			msg: '登录成功',
			code: 1010
		},

		warning: {
			msg: '用户不存在',
			code: 1011
		},

		fail:{
			msg: '登录失败',
			code: 1012
		},

		info: {
			msg: '密码错误',
			code: 1013
		}
	},

	auth: {
		success: {
			msg: '身份校验成功',
			code: 4000
		},
		fail: {
			msg: '尚未登录',
			code: 4001
		}
	},

	server: {
		error: {
			msg: '服务器报错',
			code: 5000
		}
	}

}