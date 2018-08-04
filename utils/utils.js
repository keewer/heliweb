const nodemailer = require('nodemailer');

const crypto = require('crypto');

const svgCaptcha = require('svg-captcha');

const jwt = require('jsonwebtoken');

const moment = require('moment');

const SMSClient = require('@alicloud/sms-sdk');

let transporter = nodemailer.createTransport({
	host: config.emailOptions.host,
	port: config.emailOptions.port,
	auth: config.emailOptions.auth,
	secure: config.emailOptions.secure
});

class Utils {

	generateValidCode() {
		return Math.random().toString().slice(-6);
	}

	sendMail(options, fn) {
		transporter.sendMail(options, fn)
	}

	addCrypto(value) {
		value += config.saltOptions.salt;
		let md5 = crypto.createHash('md5');
		md5.update(value);
		return md5.digest('hex');
	}

	generateImgCode() {
		return svgCaptcha.create(config.imgCodeOptions);
	}

	generateToken(tokenId) {
		let token = jwt.sign(
			{
				name: tokenId
			}, 
			config.saltOptions.salt,
			{
				expiresIn: config.tokenOptions.expiresIn
			}
		);

		return token;
	}

	verifyToken(token, fn) {
		jwt.verify(token, config.saltOptions.salt, fn);
	}

	formatDate(date) {
		return moment(date).format('YYYY-MM-DD HH:mm:ss');
	}

	verifyIdcard(params, fn) {
		const http = require('http');
		const querystring = require('querystring');

		const content = querystring.stringify(params);//url编码参数

		let options = {
			hostname: config.verifyIdcardOptions.hostname,
			port: config.verifyIdcardOptions.port,
			path: config.verifyIdcardOptions.path,
			method: config.verifyIdcardOptions.method,
			headers: config.verifyIdcardOptions.headers
		};

		let req = http.request(options, res => {
			res.setEncoding('utf8');
      res.on('data', fn);
		});

		req.write(content);//POST方法传输数据
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
	}


	sendMessage(o) {
		let smsClient = new SMSClient({
			accessKeyId: config.SMSClientOptions.accessKeyId,
			secretAccessKey: config.SMSClientOptions.secretAccessKey
		});

		//发送短信, smsClient.sendSMS返回一个promsie
		return smsClient.sendSMS({
		    PhoneNumbers: o.phone,
		    SignName: config.SMSClientOptions.signName,
		    TemplateCode: config.SMSClientOptions.templateCode,
		    TemplateParam: '{"code": "'+ o.code +'"}'
		});

	}

}

module.exports = new Utils();