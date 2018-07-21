angular.module('app')
	.provider('chart', {
		$get: [function () {
			return {

				generateChart: function (id, title, xdata, ydata) {
        	var chart = echarts.init(document.getElementById(id));
        	var option = {
            title: {
              text: title
            },
            tooltip: {
            	trigger: 'axis',
            	axisPointer : { 
            		type : 'shadow'
        			},
            },
            xAxis: {
            	splitLine: {show:false},
              data: xdata
            },
            yAxis: {
            	type : 'value'
            },
            series: [{
                name: '销量',
                type: 'bar',
                data: ydata,
                label: {
	                normal: {
	                   show: true,
	                   position: 'top'
	                }
              	}
            }],
            color: {
					    type: 'linear',
					    x: 0,
					    y: 0,
					    x2: 0,
					    y2: 1,
					    colorStops: [{
					        offset: 0, color: '#52A0E5'
					    }, {
					        offset: 1, color: '#337AB7'
					    }],
					    globalCoord: false
						}
        	};
        	chart.setOption(option);
        	return chart;
				},

				clearChart: function (chart) {
					chart.dispose()
				}

			};
		}]
	})