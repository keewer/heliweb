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
	'/login'
];