angular.module('app')
	.controller('dataController', ['$scope', 'chart', function ($scope, chart) {

		var chartInstance = null;
		
		$scope.generateChart = function () {
			chartInstance = chart.generateChart('chart', '天香鸡销量', ['A', 'B', 'C', 'D', 'E', 'F', 'G'], [120, 200, 150, 80, 70, 110, 130]);
		};

		$scope.clearChart = function () {
			chart.clearChart(chartInstance);
		}
        
	}])