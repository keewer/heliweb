const environment = process.argv[2] || process.env.NODE_ENV || 'development';

console.log(`执行${environment}环境文件`);

module.exports = require(__basename + '/config/' + environment + '.js');