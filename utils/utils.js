const nodemailer = require('nodemailer');

const crypto = require('crypto');

const svgCaptcha = require('svg-captcha');

const jwt = require('jsonwebtoken');

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
				expiresIn: '1d'
			}
		);

		return token;
	}

	verifyToken(token, fn) {
		jwt.verify(token, config.saltOptions.salt, fn);
	}

}

module.exports = new Utils();