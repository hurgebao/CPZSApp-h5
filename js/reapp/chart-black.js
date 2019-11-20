//资产分析图表
var myChartAsset = null;

//持仓列表图表
var myChartMarket = null;

//总资产变化曲线
var myChartHisFund = null;

//交易量图表
var myChartTrade = null;

/** 页面加载 */
mui.plusReady(function(){
	/**  资产分布: 柱状图  Start  */
	myChartAsset = echarts.init(document.getElementById('myChartAsset'));
	/**  资产分布: 柱状图  End  */


	/**  持仓统计: 柱状图  Start  */
	myChartMarket = echarts.init(document.getElementById('myChartMarket'));
	/**  持仓统计: 柱状图  End  */
	

	/**  总资产变化曲线: 柱状图  Start  */
	myChartHisFund = echarts.init(document.getElementById('myChartHisFund'));
	/**  总资产变化曲线: 柱状图  End  */
	

	/**  交易量: 柱状图  Strat  */
	//myChartTrade = echarts.init(document.getElementById('myChartTrade'));
	/**  交易量: 柱状图  End  */
	
	
	/* ajax调用  数据 */
	var params = getFundChartByAccountParams();
	mui.web_query_post('chartquery/getFundChartByAccount', params, function(data){
		if(data.returnCode === 0){
			/* 资产分析图表 */
			var fundMap = data.resMaps.fundMap[0];
			reSetMyChartAsset(fundMap);
			
			/* 股票持仓图表 */
			var positionLists = data.resMaps.positionLists;
			reSetMyChartMarket(positionLists, fundMap);
			
			/* 总资产变化曲线 图表 */
			var hisFundMaps = data.resMaps.hisFundMaps;
			reSetMyChartHisFund(hisFundMaps);
			
			
			
			/* 交易量图表 */
			/*var valumeMaps = data.resMaps.valumeMaps;
			reSetMyChartTrade(valumeMaps);*/
		}
	}, function(e){
	}, 3);
	
});

/** 交易量图表重设 */
function reSetMyChartTrade(dataMap) {
	//console.log('Valume dataMap:'+ JSON.stringify(dataMap));
	var optionTrade = {
		tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	    	itemGap: 10, // 各个item之间的间隔，单位px，默认为10，
	    	itemWidth: 15,             // 图例图形宽度
			itemHeight: 14,            // 图例图形高度
	    	textStyle:{
	            fontSize: 8
	        },
	        padding:35
	    },
		toolbox: {
			show : true,
			orient: 'vertical',
			x: 'right',
			y: 'center'/*,
			feature: {
				magicType: {show: true, type: ['line', 'bar']},
				restore: {show: true}
			}*/
		},
		legend: {
			data:['买入量','卖出量', '交易总量']
		},
		xAxis: [
			{
				type: 'category',
				axisLabel: {  
				   interval:0,   //字体倾斜
				   rotate:50,    //字体倾斜
				   textStyle:{
			          fontSize: 10
			       }
				},
				data: JSON.parse(dataMap.lineTitle),
				axisPointer: {
					type: 'shadow'
				} ,
				splitLine:{
					show:false
				}
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '过去交易日变化',
				min: dataMap.lineMinVal,
				max: dataMap.lineMaxVal,
				axisLabel: {
					formatter: '{value}',
					color:'#FFFFFF'
				},
				splitLine:{
					show:false
				}
			}
		],
		grid: {
			left: 50  //y轴标签值显示宽度
		},
		series: [
			{
				name:'买入量',
				type:'bar',
				data:JSON.parse(dataMap.lineBuyVal)
			}, {
				name:'卖出量',
				type:'bar',
				data:JSON.parse(dataMap.lineSellVal)
			}, {
				name:'交易总量',
				type:'line',
				data:JSON.parse(dataMap.lineVal)
			}
		]
	};
	// 使用指定的配置项和数据显示图表。
	myChartTrade.setOption(optionTrade);
}

/** 持仓列表图表重设 */
function reSetMyChartMarket(dataMap, fundMap) {
	//console.log('Position dataMap:'+ JSON.stringify(dataMap));
	/* 单票线计算 */
	//总规模
	var totalAmt = fundMap.totalAmt;
	if(totalAmt == null) { totalAmt = 0; }
	//总资产
	var totalAsset = fundMap.totalAsset;
	if(totalAsset == null) { totalAsset = 0; }
	//单票线
	var singleTicketOpenLine = fundMap.singleTicketOpenLine;
	if(singleTicketOpenLine == null) {
		singleTicketOpenLine = 0;
	}
	//单票线值
	var singleTicketOpenLineVal = parseFloat(totalAsset)*parseFloat(singleTicketOpenLine);
	singleTicketOpenLineVal = (singleTicketOpenLineVal/10000).toFixed(2);
	//console.log('totalAmt:'+totalAmt+'  singleTicketOpenLineVal:'+singleTicketOpenLineVal);
	/* 计算最大值 */
	var maxVal = (totalAmt);
	if(parseFloat(totalAsset) > parseFloat(totalAmt)) {
		maxVal = totalAsset;
	}
	maxVal = (maxVal/10000).toFixed(2);
	//console.log('maxVal:'+maxVal);
	//股票名称数组
	var stockNameArrs = new Array();
	//股票持仓市值数组
	var stockMarketArrs = new Array(); 
	//单票线数组
	var stockSingleTicketArrs = new Array();
	//循环持仓 
	for(var i = 0;i < dataMap.length; i++) {
		var stockMap = dataMap[i];
		//股票名称
		stockNameArrs[i] = stockMap.stockName;
		//市值
		var marketValueVal = parseFloat(stockMap.positionMarketValue).toFixed(2);
		stockMarketArrs[i] = (marketValueVal/10000).toFixed(2);
		//单票线
		stockSingleTicketArrs[i] = singleTicketOpenLineVal;
	} 
	//console.log('stockNameArrs:'+stockNameArrs);
	//console.log('stockMarketArrs:'+stockMarketArrs);
	//console.log('stockSingleTicketArrs:'+stockSingleTicketArrs);
	//动态加载数据
	var optionMarket = {
	    tooltip : {
	    	backgroundColor: 'rgba(255,255,255,3)',
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        },
	        textStyle: {
		        color: '#131313'
		    }
	    },
	    legend: {
	    	itemGap: 10, // 各个item之间的间隔，单位px，默认为10，
	    	itemWidth: 15,             // 图例图形宽度
			itemHeight: 14,            // 图例图形高度
	    	textStyle:{
	            fontSize: 11,
	            color:'#ffffff'
	        },
	        padding:35,
	        data:['持仓股票','单票持仓线']
	    },
	    toolbox: {
	        show : true,
	        orient: 'vertical',
	        x: 'right',
	        y: 'center'
	        /*feature : {
	            magicType : {show: true, type: ['line']},
	            restore : {show: true}
	        }*/
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            axisLabel: {  
				   interval:0,   //字体倾斜
				   rotate:50,    //字体倾斜
				   textStyle:{
			          fontSize: 10,
			          color:'#FFFFFF'
			       }
				},
//	            data : ['中国石油','中国石化','农业银行','工商银行','中国软件','东方财富','千方科技']
	            data : stockNameArrs,
				splitLine:{
					show:false
				},
				axisLine: {            // 坐标轴线
			        show: true,         // 默认显示，属性show控制显示与否
			        lineStyle: {        // 属性lineStyle控制线条样式
			            color: '#FFFFFF'
			        }
			    }
	        }
	    ],
	    yAxis : [
	        {
	            max: maxVal,
	            min: '0',
	            type : 'value',
	            axisLabel: {
					formatter: '{value}万',
					lineStyle: {        // 属性lineStyle控制线条样式
			            color: '#FFFFFF'
			        }
				},
				splitLine:{
					show:false
				},
				axisLine: {            // 坐标轴线
			        show: true,         // 默认显示，属性show控制显示与否
			        lineStyle: {        // 属性lineStyle控制线条样式
			            color: '#FFFFFF'
			        }
			    }
	        }
	    ],
	    grid: {
	        left: 50  //y轴标签值显示宽度
	    },
	    series : [
	        {
	            name:'持仓股票',
	            type:'bar',
	            itemStyle: {
	                    normal: {
	　　　　　　　         			color: '#A52A2A',
								barBorderRadius:[15,15, 0, 0]
	                    }
	            },
	            stack: '持仓股票',
	            data:stockMarketArrs
	        } ,
	       {
	            name:'单票持仓线',
	            type:'line',
	            itemStyle: {
	                    normal: {
	　　　　　　　 			color: 'red',
	                         lineStyle:{
	                             width:3     //设置线条粗细
	                         }
	                     }
	            },
	            stack: '单票持仓线',
	            data:stockSingleTicketArrs,
	            markLine: {
	                symbol: ['none'],
                     data : [{
						silent:false,             //鼠标悬停事件  true没有，false有
						lineStyle:{               //警戒线的样式  ，虚实  颜色
                             type:"solid"
						},
						yAxis: parseFloat(stockSingleTicketArrs[0])         // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
					}], 
                     itemStyle: {
				        normal: {
				            borderWidth: 1,          // 标线symbol边框线宽，单位px，默认为2
				            label: {
				                show: false
				            }
				        }
				    }
                }
	        }
	    ]
	};
	// 使用指定的配置项和数据显示图表。
	myChartMarket.setOption(optionMarket);
}

/** 总资产变化曲线 图表重设 */
function reSetMyChartHisFund(dataMap) {
	//console.log('HisFund dataMap:'+ JSON.stringify(dataMap));
	var optionHisFund = {
		tooltip : {
			backgroundColor: 'rgba(255,255,255,3)',
	        textStyle: {
		        color: '#131313'
		    },
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	    	itemGap: 10, // 各个item之间的间隔，单位px，默认为10，
	    	itemWidth: 15,             // 图例图形宽度
			itemHeight: 14,            // 图例图形高度
	    	textStyle:{
	            fontSize: 11,
	            color:'#ffffff'
	        },
//	        padding:35,
	        data:['持仓市值','资金可用', '总资产']
	    },
		toolbox: {
			show : true,
			orient: 'vertical',
			x: 'right',
			y: 'center'
		},
		xAxis: [
			{
				type: 'category',
				axisLabel: {  
				   interval:0,   //字体倾斜
				   rotate:50,    //字体倾斜
				   textStyle:{
			          fontSize: 10
			       }
				},
				data: JSON.parse(dataMap.lineTitle),
				axisPointer: {
					type: 'shadow'
				} ,
				axisLine: {            // 坐标轴线
			        show: true,         // 默认显示，属性show控制显示与否
			        lineStyle: {        // 属性lineStyle控制线条样式
			            color: '#FFFFFF'
			        }
			    }
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '过去交易日变化',
				min: dataMap.lineMinVal,
				max: dataMap.lineMaxVal,
				axisLabel: {
					formatter: '{value}万'
				},
				axisLine: {            // 坐标轴线
			        show: true,         // 默认显示，属性show控制显示与否
			        lineStyle: {        // 属性lineStyle控制线条样式
			            color: '#FFFFFF'
			        }
			    },
				splitLine:{
					show:false
				}
			}
		],
		grid: {
			left: 50  //y轴标签值显示宽度
		},
		series: [
			{
				name:'持仓市值',
				type:'bar',
				stack: '合并',
				data:JSON.parse(dataMap.lineMarketVal),
				itemStyle: {
	                    normal: {
	　　　　　　　 				color: '#A52A2A'
	                    }
	            }
				
			}, {
				name:'资金可用',
				type:'bar',
				stack: '合并',
				data:JSON.parse(dataMap.lineRemainVal),
				itemStyle: {
	                    normal: {
	　　　　　　　 				color: '#FAFAFA',
								barBorderRadius:[15,15, 0, 0]
	                    }
	            }
			}, {
				name:'总资产',
				type:'line',
				data:JSON.parse(dataMap.lineVal),
				itemStyle: {
	                    normal: {
	　　　　　　　 			color: 'red',
	                         lineStyle:{
	                             width:2     //设置线条粗细
	                         }
	                     }
	            }
			}
		]
	};
	// 使用指定的配置项和数据显示图表。
	myChartHisFund.setOption(optionHisFund);
}

/** 资产图表重设 */
function reSetMyChartAsset(dataMap) {
	//console.log('Asset dataMap:'+ JSON.stringify(dataMap));
	//总规模
	var totalAmt = dataMap.totalAmt;
	if(totalAmt == null) {
		totalAmt = 0;
	}
	totalAmt = (totalAmt/10000).toFixed(2);
	//预警线
	var precautiousLine = dataMap.precautiousLine;
	if(precautiousLine == null) {
		precautiousLine = 0;
	}
	//平仓线
	var openLine = dataMap.openLine;
	if(openLine == null) {
		openLine = 0;
	}
	//预警线值
	var precautiousLineVal = parseFloat(totalAmt)*parseFloat(precautiousLine);
	precautiousLineVal = (precautiousLineVal).toFixed(2);
	//平仓线值
	var openLineVal = parseFloat(totalAmt)*parseFloat(openLine);
	openLineVal = (openLineVal).toFixed(2);
	//总资产
	var totalAsset = dataMap.totalAsset;
	if(totalAsset == null) {
		totalAsset = 0;
	}
	totalAsset = (totalAsset/10000).toFixed(2);
	//持仓
	var positionMarketValue = dataMap.positionMarketValue;
	if(positionMarketValue == null) {
		positionMarketValue = 0;
	}
	positionMarketValue = (positionMarketValue/10000).toFixed(2);
	//资金余额
	var currentRemainAmt = dataMap.currentRemainAmt;
	if(currentRemainAmt == null) {
		currentRemainAmt = 0;
	}
	currentRemainAmt = (currentRemainAmt/10000).toFixed(2);
	/* 计算最大值 */
	var maxVal = (totalAmt);
	if(parseFloat(totalAsset) > parseFloat(totalAmt)) {
		maxVal = totalAsset;
	}
	
	//初始规模与预警线差值 (初始规模-预警线)
	var totalAmtDis = (parseFloat(totalAmt)-parseFloat(precautiousLineVal)).toFixed(2);
	//预警线与平仓线差值(预警线-平仓线)
	var precautiousLineValDis = (parseFloat(precautiousLineVal)-parseFloat(openLineVal)).toFixed(2);
	
	/** 设置 */
	setChicangFund(dataMap);
	
	//动态加载数据
	var optionAsset = {
		tooltip : {
	        trigger: 'axis',
	        backgroundColor: 'rgba(255,255,255,3)',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        },
	        formatter: function(params) {
				var res = '<font style="color:#080808">初始规模:&nbsp;'+totalAmt+'</font><br/>';
					res = res +'<font style="color:#8B6508">&nbsp;&nbsp;预&nbsp;&nbsp;&nbsp;&nbsp;警&nbsp;&nbsp;:&nbsp;'+precautiousLineVal+'</font><br/>';
					res = res +'<font style="color:#CD0000">&nbsp;&nbsp;平&nbsp;&nbsp;&nbsp;&nbsp;仓&nbsp;&nbsp;:&nbsp;'+openLineVal+'</font><br/>';
					res = res +'<font style="color:#8B2252;font-weight:bold">&nbsp;总&nbsp;资&nbsp;产&nbsp;:&nbsp;'+totalAsset+'</font><br/>';
					res = res +'<font style="color:#556B2F">&nbsp;&nbsp;持&nbsp;&nbsp;&nbsp;&nbsp;仓&nbsp;&nbsp;:&nbsp;'+positionMarketValue+'</font><br/>';
					res = res +'<font style="color:#404040">&nbsp;&nbsp;可&nbsp;&nbsp;&nbsp;&nbsp;用&nbsp;&nbsp;:&nbsp;'+currentRemainAmt+'</font><br/>';
				return res;
			}
	    },
	    legend: {
	    	itemGap: 10, // 各个item之间的间隔，单位px，默认为10，
	    	itemWidth: 15,             // 图例图形宽度
			itemHeight: 14,            // 图例图形高度
	    	textStyle:{
                fontSize: 10,
                color: '#ffffff'
            },
            padding:20,
	        data:['初始规模','预警','平仓','持仓','可用']
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : [''],
	            splitLine:{
					show:false
				},
				axisLine: {            // 坐标轴线
			        show: true,         // 默认显示，属性show控制显示与否
			        lineStyle: {        // 属性lineStyle控制线条样式
			            color: '#FFFFFF'
			        }
			    }
	        }
	    ],
	    yAxis : [
	        {
	            max: maxVal,
//	            max: 300,
	            min: '0',
	            type : 'value',
	            axisLabel: {
					formatter: '{value}万'
				},
				triggerEvent:false,
				splitLine:{
					show:false
				},
				axisLine: {            // 坐标轴线
			        show: true,         // 默认显示，属性show控制显示与否
			        lineStyle: {        // 属性lineStyle控制线条样式
			            color: '#FFFFFF'
			        }
			    }
	        }
	    ],
	    grid: {
	        left:60  //y轴标签值显示宽度
	    },
		series : [
		{
	            name:'平仓',
	            type:'bar',
	            itemStyle: {
	                    normal: {
	　　　　　　　 				color: '#CD0000'
	                    }
	            },
	            stack: 'sum',
	            data:[openLineVal],
	            markLine: {
	                symbol: ['none'],
                     data : [{
						silent:false,             //鼠标悬停事件  true没有，false有
						lineStyle:{               //警戒线的样式  ，虚实  颜色
                             type:"solid"
						},
						yAxis: parseFloat(openLineVal)           // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
					}],
                     itemStyle: {
				        normal: {
				            borderWidth: 1,          // 标线symbol边框线宽，单位px，默认为2
				            label: {
				                show: false
				            }
				        }
				    }
                }
	        },
	        {
	            name:'预警',
	            type:'bar',
	            itemStyle: {
	                    normal: {
	　　　　　　　 				color: '#8B6508',
							width: 5
	                    }
	            },
	            stack: 'sum',
	            data:[precautiousLineValDis],
	            label:{
	            	normal:{
	            		formatter: function(params) {
						  return precautiousLineVal;
						}
	            	}
	            },
	            markLine: {
	                symbol: ['none'],
                     data : [{
						silent:false,             //鼠标悬停事件  true没有，false有
						lineStyle:{               //警戒线的样式  ，虚实  颜色
                             type:"solid"
						},
						yAxis: parseFloat(precautiousLineVal)           // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
					}],
                     itemStyle: {
				        normal: {
				            borderWidth: 1,          // 标线symbol边框线宽，单位px，默认为2
				            label: {
				                show: false
				            }
				        }
				    }
                }
	        },
	        {
	            name:'初始规模',
	            type:'bar',
	            itemStyle: {
	                    normal: {
	　　　　　　　 				color: '#FFFFFF',
								barBorderRadius:[10,10, 0, 0]
	                    }
	            },
	            stack: 'sum',
	            data:[totalAmtDis],
	            markLine: {
	                symbol: ['none'],
                     data : [{
						silent:false,             //鼠标悬停事件  true没有，false有
						lineStyle:{               //警戒线的样式  ，虚实  颜色
                             type:"solid",
							color:"#FA3934",
						},
						yAxis: parseFloat(totalAmt)           // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
					}],
                     itemStyle: {
				        normal: {
				            borderWidth: 1,          // 标线symbol边框线宽，单位px，默认为2
				            label: {
				                show: false
				            }
				        }
				    }
                }
	        },
	        /*{
	            name:'总资产',
	            type:'bar',
	            itemStyle: {
	                    normal: {
	　　　　　　　 				color: '#8B2252'
	                    }
	            },
	            barWidth: 2,
	            data:[totalAsset]
	        },*/
	        {
	            name:'持仓',
	            type:'bar',
	            itemStyle: {
	                    normal: {
	　　　　　　　 				color: '#A52A2A'
	                    }
	            },
	            stack: '资产',
	            data:[positionMarketValue]
	        },
	        {
	            name:'可用',
	            type:'bar',
	             itemStyle: {
	                    normal: {
	　　　　　　　 				color: '#404040',
								barBorderRadius:[15,15, 0, 0]
	                   	}
	            },
	            stack: '资产',
	            data:[currentRemainAmt]
	        }
	    ]
	};
	// 使用指定的配置项和数据显示图表。
	myChartAsset.setOption(optionAsset);
}

/** 设置资产展示 */
function setChicangFund(dataMap){
	//初始规模
	var totalAmtVal = setCapItem(dataMap.totalAmt, "totalAmt");
	document.getElementById("totalAmt").innerHTML = totalAmtVal;
	
	//总资产
	var totalAssetVal = setCapItem(dataMap.totalAsset, "totalAsset");
	document.getElementById("totalAsset").innerHTML = totalAssetVal;
	var assetRate = 0.00;
	if(parseFloat(dataMap.totalAmt) > 0) {
		assetRate = (parseFloat(dataMap.totalAsset)/parseFloat(dataMap.totalAmt)*100).toFixed(2);
	}
	document.getElementById("totalAssetNet").innerHTML = assetRate;

	//持仓市值
	var positionMarketValueVal = setCapItem(dataMap.positionMarketValue, "positionMarketValue");
	document.getElementById("positionMarketValue").innerHTML = positionMarketValueVal;
	var positionMarketValuePer = 0.00;
	if(parseFloat(dataMap.totalAsset) > 0) {
		positionMarketValuePer = (parseFloat(dataMap.positionMarketValue)/parseFloat(dataMap.totalAsset)*100).toFixed(2);
	}
	document.getElementById("positionMarketValuePer").innerHTML = positionMarketValuePer;
	
	//资金余额
	var currentRemainAmtVal = setCapItem(dataMap.currentRemainAmt, "currentRemainAmt");
	document.getElementById("currentRemainAmt").innerHTML = currentRemainAmtVal;
	var currentRemainAmtPer = 0.00;
	if(parseFloat(dataMap.totalAsset) > 0) {
		currentRemainAmtPer = (parseFloat(dataMap.currentRemainAmt)/parseFloat(dataMap.totalAsset)*100).toFixed(2);
	}
	document.getElementById("currentRemainAmtPer").innerHTML = currentRemainAmtPer;
	
	// 计算预警线线
	//总规模
	var totalAmt = dataMap.totalAmt;
	if(totalAmt == null) {
		totalAmt = 0;
	}
	//预警线
	var precautiousLine = dataMap.precautiousLine;
	if(precautiousLine == null) {
		precautiousLine = 0;
	}
	//平仓线
	var openLine = dataMap.openLine;
	if(openLine == null) {
		openLine = 0;
	}
	//预警线值
	var precautiousLineVal = parseFloat(totalAmt)*parseFloat(precautiousLine);
	var precautiousLineAmtVal = setCapItem(precautiousLineVal+"", "precautiousLineAmt");
	document.getElementById("precautiousLineAmt").innerHTML = precautiousLineAmtVal;
	document.getElementById("precautiousLineAmtPer").innerHTML = (precautiousLine*100).toFixed(2);

	//平仓线值
	var openLineVal = parseFloat(totalAmt)*parseFloat(openLine);
	var openLineAmtVal = setCapItem(openLineVal+"", "openLineAmt");
	document.getElementById("openLineAmt").innerHTML = openLineAmtVal;
	document.getElementById("openLineAmtPer").innerHTML = (openLine*100).toFixed(2);
}

//设置资金金额
function setCapItem(objVal, fieldName){
	var val = formatCurrency(0);
	if(objVal != undefined && objVal != null && objVal != 'null') {
		val = formatCurrency(objVal);
	}
	return val;
}







