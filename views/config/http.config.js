angular.module('app')
	.config(["$httpProvider", function ($httpProvider) {
　　//更改 Content-Type
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
    $httpProvider.defaults.headers.post["Accept"] = "*/*";
    $httpProvider.defaults.transformRequest = function (data) { 
    //把JSON数据转换成字符串形式, 以便服务器接收
      if (data !== undefined) { 
        return $.param(data);
      }
        return data;
      };
  }])