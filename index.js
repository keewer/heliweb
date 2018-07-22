global.__basename = __dirname;

global.config = require(__basename + '/config/config.js');

global.model = require(__basename + '/lib/db/model/model.js');

const port = process.env_PORT || config.server.port;

const SSLport = process.env_PORT || config.server.SSLport;

const fs = require('fs');

const bodyParser = require('body-parser');

const http = require('http');

const https = require('https');

const express = require('express');

const ejs = require('ejs');

const route = require(__basename + '/route/route.js');

const app = express();

app.use(express.static(__dirname + '/views'));

app.set('views', __dirname);
app.set('view engine', 'html');
app.engine('.html', ejs.__express);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:4200");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  // res.header('Access-Control-Allow-Credentials', true);
  next();
});

route(app);

app.use((req, res) => {
	res.status(404);
	res.send('找不到资源');
})

app.use((err, req, res) => {
	if (err) {
		res.status(500)
		res.send('服务器出错');
	}
})

const certOptions = {
	key: fs.readFileSync(__basename + '/cert/2_' + config.cert.certName + '.key').toString(),
	cert: fs.readFileSync(__basename + '/cert/1_' + config.cert.certName + '_bundle.crt').toString()
};

http.createServer(app)
	.listen(port, () => {
		console.log(`http服务器运行于${config.server.host}:${port}`);
	});

https.createServer(certOptions, app)
	.listen(SSLport, () => {
		console.log(`https服务器运行于${config.server.host}:${SSLport}`);
	})