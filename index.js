const express = require('express');
const ejs = require('ejs');

const port = process.env.PORT || 5000;

const app = express();

app.use(express.static(__dirname + '/views'));

app.set('views', __dirname);
app.set('view engine', 'html');
app.engine('.html', ejs.__express);

app.get('/', (req, res) => {
	res.status(200).render('index');
})

app.use((req, res) => {
	res.status(404);
	res.send('没有找到资源');
})

app.use((err, req, res) => {
	if (err) {
		res.status(500);
		res.send('服务器报错');
	}
})

app.listen(port, () => {
	console.log(`服务器运行于192.168.1.102:${port}`);
})