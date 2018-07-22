exports.server = {
	host: '127.0.0.1',
	port: 8001,
	SSLport: 8002
}

exports.cert = {
	certName: 'www.jiulingnian.com'
}

exports.mysqlOptions = {
	database: 'jiulingnian',
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
	salt: 'nlj'
}