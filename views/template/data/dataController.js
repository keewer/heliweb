angular.module('app')
	.controller('dataController', ['$scope', 'chart', function ($scope, chart) {

		var chartInstance = null;
		
		$scope.generateChart = function () {
			chartInstance = chart.generateChart('chart', '天香鸡销量', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'], [120, 200, 150, 80, 70, 110, 130, 160, 174, 198, 208, 307]);
		};

		$scope.clearChart = function () {
			chart.clearChart(chartInstance);
		}
        
	}])