exports.server = {
	host: '127.0.0.1',
	port: 5000,
	SSLport: 5001
}

exports.cert = {
	certName: 'www.jiulingnian.com'
}

exports.mysqlOptions = {
	database: 'helidb',
	host: '127.0.0.1',
	user: 'root',
	password: 'love you',
	dialect: 'mysql',
	pool: {
		max: 10,
		min: 0,
		idel: 10000
	}
}

exports.emailOptions = {
	host: 'smtp.126.com',
	port: 465,
	secure: true,
	auth: {
	   user: 'jiulingnian@126.com',
	   pass: 'action2008'  
	}
}

exports.saltOptions = {
	salt: 'ileh'
}

exports.imgCodeOptions = {
	size: 5,
	ignoreChars: '0o1i',
	noise: 3,
	height: 50
};

exports.ignoreUrls = [
	'/',
	'/imgcode',
	'/login',
	'/forgot',
	'/phonecode'
];

exports.verifyIdcardOptions = {
	key: '89bad502fae3daf21e1bb919c60bd1da',
	hostname: 'v.apistore.cn',
	path: '/api/a1',
	port: 80,
	method: 'POST',
	headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  information: 1
}

exports.orderNoOptions = {
	flag: 'HLTX',
	length: 10
}

exports.initPwdOptions = {
	pwd: 'heli123'
}

exports.tokenOptions = {
	expiresIn: '1d'
}

exports.SMSClientOptions = {
	accessKeyId: 'LTAIrj5vR5JT836y',
	secretAccessKey: 'NyW02ef4CNJ75AGvZoVIMOlnaepi6V',
	signName: '粤企APP',
	templateCode: 'SMS_109055010'
}