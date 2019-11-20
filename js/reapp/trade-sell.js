/** 卖出页面js */

/* 输入下单价格  处理 */
function verifyOrderPrice() {
	//下单价格
	var orderPrice = mui('#orderPrice')[0].value;
	if(orderPrice == '' || parseFloat(orderPrice) == 0) {
		return false;
	}
	//跌停价
	var rallyPrice = mui('#rallyPriceHid')[0].value;
	//涨停价
	var limitPrice = mui('#limitPriceHid')[0].value;
	if(rallyPrice == '') {
		mui.toast('请输入股票代码');
		return false;
	}
	
	/** 15:00:00-15:30:00，按固定价格-收盘价交易 */
	var currentTime = toCurrentTime();
	//股票代码 / 股票名称(验证股票是否存在)
	var stockCode = mui('#stockCode')[0].value;
	if(stockCode.substring(0,3) == '688' && '15:00:00' <= currentTime && currentTime < '15:30:00') {
		var currentPrice = mui('#currentPriceHid')[0].value;
		mui.toast('委托价必须是盘后固定价:'+currentPrice);
		mui('#orderPrice')[0].value = currentPrice;
		/* 计算预成交金额 */
		countProSellAmt();
		return true;
	}
	
	
	//如果涨停价为 0, 科创板不限制涨跌停
	if(parseFloat(limitPrice) > 0) {
		//验证跌停
		if(parseFloat(orderPrice) < parseFloat(rallyPrice)) {
			mui.toast('卖出价不得低于'+rallyPrice);
			mui('#orderPrice')[0].value = limitPrice;
			/* 计算预成交金额 */
			countProSellAmt();
			return false;
		}
		if(parseFloat(orderPrice) > parseFloat(limitPrice)) {
			mui.toast('卖出价不得高于'+limitPrice);
			mui('#orderPrice')[0].value = limitPrice;
			/* 计算预成交金额 */
			countProSellAmt();
			return false;
		}
	}
	/* 计算预成交金额 */
	countProSellAmt();
	return true;
}


//点击选择持仓列表
function seletSellStock(stockCode, stockName, enableNumber) {
	//console.log('点击持仓..'+stockCode+stockName+enableNumber);
	var stockCodeOld = mui('#stockCode')[0].value;
	if((stockCodeOld != null && stockCodeOld != '' && stockCodeOld != stockCode) 
		|| stockCodeOld == null || stockCodeOld == '') {
		//卖出价 与 卖出量 清0
		mui('#orderPrice')[0].value = '';
		mui('#sellNum')[0].value = '';
	}
	//console.log('点击持仓2..'+stockCode+stockName+enableNumber);	
	//设置股票代码/股票名称
	mui('#stockCode')[0].value = stockCode;
	mui('#stockName')[0].innerHTML = stockName;
	//设置可用股数
	mui('#enableNumberHid')[0].value = enableNumber;
//	var enableContent = '可卖 '+fmoney(enableNumber, 0)+' 股  <a href="#" onclick="clickAllShell('+enableNumber+');">全部</a>';
	var enableContent = '可卖 '+fmoney(enableNumber, 0)+' 股';
	mui('#enableNumber')[0].innerHTML = enableContent;
	//交易类型 B买入  S卖出 
	mui('#ifOnePrice')[0].value = 'T';
	//加载五档行情
	mui('#marketLocal')[0].value = 'F';
	queryMarketInfo();
	
	/* 设置 快选仓位  */
 	setQSelectNum(enableNumber);
	
	//行情显示位置  2 Level-2行情    1新浪行情
	if(mui('#marketType')[0].value == '2') {
  		//mui('.mui-scroll-wrapper').scroll().scrollTo(0,-92,100);
	} else {
  		//mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0,100);
	}
	
	//清空卖出数量
	mui('#sellNum')[0].value = '0';
	
	/* 计算预成交金额 */
	countProSellAmt();
}


/* 设置 快选仓位  */
function setQSelectNum(enableNum) {
//	console.log('enableNum:'+enableNum);
	if(enableNum == 0) {
		mui('#qSelNum0')[0].innerHTML = '0';
		mui('#qSelNum0Hid')[0].value = '0';
		mui('#qSelNum2')[0].innerHTML = '0';
		mui('#qSelNum2Hid')[0].value = '0';
		mui('#qSelNum3')[0].innerHTML = '0';
		mui('#qSelNum3Hid')[0].value = '0';
		mui('#qSelNum4')[0].innerHTML = '0';
		mui('#qSelNum4Hid')[0].value = '0';
	} else {
		mui('#qSelNum0')[0].innerHTML = enableNum;
		mui('#qSelNum0Hid')[0].value = enableNum;
		mui('#qSelNum2')[0].innerHTML = parseInt(enableNum/2/100)*100;
		mui('#qSelNum2Hid')[0].value = parseInt(enableNum/2/100)*100;
		mui('#qSelNum3')[0].innerHTML = parseInt(enableNum/3/100)*100;
		mui('#qSelNum3Hid')[0].value = parseInt(enableNum/3/100)*100;
		mui('#qSelNum4')[0].innerHTML = parseInt(enableNum/4/100)*100;
		mui('#qSelNum4Hid')[0].value = parseInt(enableNum/4/100)*100;
	}
}


/* 计算预成交金额 */
function countProSellAmt() {
//	console.log('计算预成交金额...');
	//委托价格
	var orderPrice = mui('#orderPrice')[0].value;
	if(orderPrice == '' || parseFloat(orderPrice) == 0) {
		mui('#preSellAmt')[0].innerHTML = '0.00';
		return false;
	}
	//委托数据
	var sellNum = mui('#sellNum')[0].value;
	if(sellNum == '' || parseFloat(sellNum) == 0) {
		mui('#preSellAmt')[0].innerHTML = '0.00';
		return false;
	}
	//预金额 
	var preSellAmt = fmoney(parseFloat(orderPrice)*parseFloat(sellNum), 2);
	mui('#preSellAmt')[0].innerHTML = preSellAmt;
}

/* 点击快选仓位效果 */
function mousedown(idVal){
	document.getElementById(idVal).className="q-select-btn-click-1";
}
function mouseup(idVal){
	document.getElementById(idVal).className="q-select-btn-click";
	
}
//点击快选设置
function setQSelSellNum(idVal) {
//	console.log('idVal:'+idVal);
	//设置委托量
	mui('#sellNum')[0].value = document.getElementById(idVal+'Hid').value;
	/* 计算预成交金额 */
	countProSellAmt();
}


/* 验证卖出量 */
function verifySellNum(){
	var enableNum = mui('#enableNumberHid')[0].value;
	if(parseInt(enableNum) == 0) {
		mui.toast('请输入股票代码');
		return false;
	}
	var sellNum = mui('#sellNum')[0].value;
	if(parseInt(sellNum) > parseInt(enableNum)) {
		mui.toast('最大可卖 '+enableNum+' 股');
		mui('#sellNum')[0].value = enableNum;
		/* 设置 快选仓位  */
 		setQSelectNum(enableNum);
 		/* 计算预成交金额 */
 		countProSellAmt();
		return false;
	}
	//股票代码 / 股票名称(验证股票是否存在)
	var stockCode = mui('#stockCode')[0].value;
	if(stockCode.substring(0,3) == '688') {}
	else {
		//卖出股数为百位整数
		if(parseInt(sellNum) < parseInt(enableNum)){
			mui('#sellNum')[0].value = parseInt(sellNum/100)*100;
		}
		/* 计算预成交金额 */
 		countProSellAmt();
	}
	
}

/** 查询股票持仓 Start */
//设置资金持仓股票
function setStockListItem(objVal, n){
	var val = fmoney(0, n);
	if(objVal != undefined && objVal != null && objVal != 'null') {
		val = fmoney(objVal, n);
	}
    return val;
}
/** Ajax调用后台取数据(资金股份所有持仓列表) */
function ajaxStickListQuery(eventOpe){
	//判断是点击刷新还是上拉加载
	if(eventOpe == undefined || eventOpe == null) {
		mui('#beginIndex')[0].value = '0';
	} 
	//开始查询记录索引
	var startIndex = mui('#beginIndex')[0].value;
	//console.log('持仓开始加载..startIndex='+startIndex);
	/* ajax调用 持仓列表 */
	mui.web_query_post('query/getFundStock', capStockListParams('', startIndex), function(data){
			if(data.returnCode === 0){
				//持仓列表
				var listMaps = data.list;
				if(listMaps.length == 0) {
					//事件操作
					if(eventOpe != undefined && eventOpe == 'updown') {
						//上拉加载，true表示没有更多数据了，
						mui('#scroll1').pullRefresh().endPullupToRefresh(true);
					}
					//清空列表中
        			return ; 
				}
				//循环数组
				var contentStr = '';
				for(var i = 0;i < listMaps.length; i++) {
					var stockMap = listMaps[i];
					
					//市值
					var marketValueVal = parseFloat(stockMap.positionMarketValue);
					
					//盈亏比例 =(市值-(持仓股数*成本价))/成本金额
					//var profitRateVal = countProfitRate(marketValueVal, stockMap.currentRemainNum, stockMap.costPrice);
					var profitRateVal = parseFloat(stockMap.profitLossPrecent)*100;
					
					//列表记录样式
					var fontStyle = '';
					if(parseFloat(profitRateVal) >= 0) {
						fontStyle = 'box-list-bg-color-up';
					} else if(parseFloat(profitRateVal) < 0) {
						fontStyle = 'box-list-bg-color-down';
					}
					
					/* 加载模版展示持仓列表 */
					var showdata = {
						stockName:stockMap.stockName,
						stockCode:stockMap.stockCode,
						marketValue:setStockListItem(marketValueVal,2),
						profitLossAmt:setStockListItem(stockMap.profitLossAmt,2),
						profitRate:setStockListItem(profitRateVal,2),
						fontStyle:fontStyle,
						currentRemainNum:setStockListItem(stockMap.currentRemainNum,0),
						currentEnableNum:setStockListItem(stockMap.currentEnableNum,0),
						enableNum:stockMap.currentEnableNum,
						costPrice:setStockListItem(stockMap.costPrice,2),
						currentPrice:setStockListItem(stockMap.marketValue,2)
					};
					//追加模板消息 
			        var strList = template('stock-tmp', { 
			            "showdata": showdata 
			        }); 
			        contentStr = contentStr + strList;
				}
				//添加到列表中 
				var boxLists = document.getElementById("boxLists").innerHTML;
				if(startIndex == '0') {
					boxLists = '';
				}
				document.getElementById("boxLists").innerHTML = boxLists + contentStr;
							
				//console.log('获取账户资金持仓成功');
				
				//下次加载查询
				var beginIndex = mui('#beginIndex')[0].value;
				mui('#beginIndex')[0].value = parseInt(beginIndex)+listMaps.length;
				
				//事件操作
				if(eventOpe != undefined && eventOpe == 'updown') {
					//上拉加载，true表示没有更多数据了，
					mui('#scroll1').pullRefresh().endPullupToRefresh(false);
				}
				
			} else {
				//console.log('获取账户资金持仓失败:' + e.returnMsg);
			}
		}, function(e){}, 3);
}
/** 查询股票持仓 End */

/** 资金股份持仓可卖 Start */
/** Ajax调用后台取数据(资金股份持仓可卖) */
function ajaxCapStockInfoByCode(stockCode){ 
	/* ajax调用 资金股份持仓可卖  数据 */
	mui.web_query_post('query/getFundStock', capStockListParams(stockCode), function(data){
		if(data.returnCode === 0){
			//持仓列表
			var listMaps = data.list;
			if(listMaps.length == 0) {
				//设置可卖股数为 0
				mui('#enableNumber')[0].innerHTML = '可卖 '+0+' 股';
				mui('#enableNumberHid')[0].value = 0;
				/* 设置 快选仓位  */
 				setQSelectNum(0);
				return ; 
			}
			//循环数组
			var ifExist = false;
			for(var i = 0;i < listMaps.length; i++) {
				var stockMap = listMaps[i];
				if(stockMap.stockCode == stockCode) {
					/* 卖出可用股数 */
					var enableNumber = stockMap.currentEnableNum;
					mui('#enableNumberHid')[0].value = enableNumber;
//					var enableContent = '可卖 '+fmoney(enableNumber, 0)+' 股  <a href="#" onclick="clickAllShell('+enableNumber+');">全部</a>';
					var enableContent = '可卖 '+fmoney(enableNumber, 0)+' 股';
					mui('#enableNumber')[0].innerHTML = enableContent;
					ifExist = true;
					/* 设置 快选仓位  */
 					setQSelectNum(enableNumber);
					break;
				}
			}
			if(!ifExist) {
				mui('#enableNumber')[0].innerHTML = '可卖 '+0+'股';
				mui('#enableNumberHid')[0].value = 0;
				/* 设置 快选仓位  */
 				setQSelectNum(0);
				//console.log('账户资金持仓['+stockCode+']不存在');
				return false;
			} else {
				//console.log('获取账户资金持仓['+stockCode+']完成');
				return true;
			}
		} else {
			//console.log('获取账户资金持仓['+stockCode+']失败:' + e.returnMsg);
			mui('#enableNumber')[0].innerHTML = '可卖 '+0+'股';
			mui('#enableNumberHid')[0].value = 0;
			/* 设置 快选仓位  */
 			setQSelectNum(0);
			return false; 
		}
	}, function(e){}, 3);
}
//点击全部卖出
function clickAllShell(enableNum) {
	mui('#sellNum')[0].value = enableNum;
}
/** 资金股份持仓可卖 End */


/** 提交下单 */
function submitOrder(){
	/* 从界面获取 数据 */
	//股票代码 / 股票名称(验证股票是否存在)
	var stockCode = mui('#stockCode')[0].value;
	if(stockCode == '' || stockCode.length < 6) {
		//行情设置为空
		mui.toast('股票代码有误')
		return false;
	}
	var stockName = mui('#stockNameHid')[0].value;
	if(stockName == '') {
		mui.toast('股票代码不存在')
		return false;
	}
	
	//买入价格(判断是否超出 涨跌停)
	var orderPrice = mui('#orderPrice')[0].value;
	if(parseFloat(orderPrice) == 0) {
		mui.toast('卖出价有误,请修改')
		return false;
	}
	var verifyPrice = verifyOrderPrice();
//	console.log('verifyPrice:'+verifyPrice);
	if(!verifyPrice) {
		mui.toast('卖出价有误,请修改')
		return false;
	}
	//买入量(判断可用资金是否足够)
	var enableNum = mui('#enableNumberHid')[0].value;
	var sellNum = mui('#sellNum')[0].value;
	if(parseInt(sellNum) == 0) {
		mui.toast('卖出量有误,请修改')
		return false;
	}
	if(parseInt(sellNum) > parseInt(enableNum)) {
		mui.toast('卖出量必须小于可卖量,请修改')
		return false;
	}
	/** 科创板不验证100的倍数 */
	if(stockCode.substring(0,3) == '688') {
		if(parseInt(sellNum) < 200) {
			mui.toast('科创板单笔最少200股,请修改')
			return false;
		}
	} else {
		if((parseInt(sellNum)%100) > 0) {
			mui.toast('卖出量必须为100的整数倍,请修改')
			return false;
		}
	}
	var orderType = '1';  //0买入 1卖出
	var warnMsg = '确定提交卖出?';
	if(stockCode.substring(0,3) == '688') {
		warnMsg = '确定提交卖出?\n(连续竞价期间,若委托买入价格高于买入基准价102%,或委托卖出价格低于卖出基准价98%,交易所将作废单处理,请及时查询委托结果)';
	}
	
	//提交委托
	mui.confirm(warnMsg, '提示', new Array('取消', '确认'), function(e){
		if(e.index == 1) {
			/****** 预风控和下单时间参数 *****/
			var clickTime = new Date(); //点击确认时间 (日志)
			var precheckStartTime = ''; //预风控开始时间(日志)
			var precheckEndTime = ''; //预风控结束时间(日志)
			var gwPrecheckEndTime = ''; //预风控开始时间(日志)(后台处理)
			var gwPrecheckStartTime = ''; //预风控结束时间(日志)(后台处理)
			var sendorderStartTime = ''; //下单开始时间(日志)
			var sendorderEndTime = ''; //下单结束时间(日志)
			var gwSendOrderStartTime = ''; //下单开始时间(日志)(后台处理)
			var gwSendOrderEndTime = ''; //下单结束时间(日志)(后台处理)
			var securitiesTraderEntrustNo = ''; //券商委托编号(日志)
			var tidVal = 0; //业务编号 (日志)
			var logRemark = ''; //业务说明(日志)
			
			//设置买入按钮 不可用
			var orderBtn = document.getElementById("orderBtn");
			orderBtn.disabled = true;
			
			/* ajax预风控调用 */
			precheckStartTime = new Date(); //预风控开始时间(日志)
			
			/* ajax预风控调用 */
			var paramsRisk = sendOrderPreRiskParams(stockCode, stockName, orderPrice, sellNum, orderType);
			mui.web_query_post('trade/sendOrderPreRiskCheck', paramsRisk, function(data){
				sendorderStartTime = new Date(); //下单开始时间(日志)
				precheckEndTime = sendorderStartTime; //预风控结束时间(日志)
				gwPrecheckStartTime = data.gwPrecheckStartTime; //预风控结束时间(日志)(后台处理)
				gwPrecheckEndTime = data.gwPrecheckEndTime; //预风控开始时间(日志)(后台处理)
				if(data.returnCode == 0){
					/* ajax调用 委托下单 数据 Start */
					var params = sendOrderParams(stockCode, stockName, orderPrice, sellNum, orderType);
					tidVal = params.tid; //业务编号
					mui.web_query_post('trade/sendOrder', params, function(data){
						gwSendOrderStartTime = data.gwSendOrderStartTime; //下单开始时间(日志)(后台处理)
						gwSendOrderEndTime = data.gwSendOrderEndTime; //下单结束时间(日志)(后台处理)
						/* 记录下单日志参数 */
						sendorderEndTime = new Date(); //下单结束时间(日志)
						//券商委托编号
						if(data.orderNo != null && data.orderNo.length > 0) {
							securitiesTraderEntrustNo = data.orderNo;
						}
						logRemark = data.returnMsg; //业务说明(日志)
						
						mui.alert('委托提交完成,请查看当日委托');
						
						orderBtn.disabled = false;
						
						//查询持仓可卖
						ajaxCapStockInfoByCode(stockCode);
						
						//后台取数据(资金股份所有持仓列表)
						var maichuSub = plus.webview.getWebviewById('trade-sell-sub.html');
						maichuSub.evalJS("ajaxStickListQuery()");
						
						/** 记录日志 */
						recardTradeTimeLog(stockCode, stockName, orderPrice, sellNum, orderType, tidVal, logRemark,
							clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo,
							gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
						
					}, function(e){
						sendorderEndTime = new Date(); //下单结束时间(日志)
						logRemark = '下单异常:'+e; //业务说明(日志)
						
						//查询持仓可卖
						ajaxCapStockInfoByCode(stockCode);
						//后台取数据(资金股份所有持仓列表)
						var maichuSub = plus.webview.getWebviewById('trade-sell-sub.html');
						maichuSub.evalJS("ajaxStickListQuery()");;
						
						/** 记录日志 */
						recardTradeTimeLog(stockCode, stockName, orderPrice, sellNum, orderType, tidVal, logRemark,
							clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo,
							gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
						
					}, 1);
					 
					/* ajax调用 委托下单 数据 End */
				} else {
					//如果预风险未通过, 下单结束时间等于下单开始时间
					sendorderStartTime = '';//(日志)
					sendorderEndTime = '';//(日志)
					logRemark = data.returnMsg; //业务说明(日志)
					
					mui.alert('委托失败:'+data.returnMsg);
					//console.log('委托失败:'+data.returnMsg);
					//设置按钮不可用   true不可用  false可用
					orderBtn.disabled = false;
					
					//查询持仓可卖
					ajaxCapStockInfoByCode(stockCode);
					//后台取数据(资金股份所有持仓列表)
					var maichuSub = plus.webview.getWebviewById('trade-sell-sub.html');
					maichuSub.evalJS("ajaxStickListQuery()");
					
					/** 记录日志 */
					recardTradeTimeLog(stockCode, stockName, orderPrice, sellNum, orderType, tidVal, logRemark,
						clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo,
						gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
				}
			}, function(e){
				precheckEndTime = new Date(); //预风控结束时间(日志)
				logRemark = '预风控异常'; //业务说明(日志)
				/** 记录日志 */
				recardTradeTimeLog(stockCode, stockName, orderPrice, sellNum, orderType, tidVal, logRemark,
					clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo,
					gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
			}, 1);
			
			/** 延时3秒记录日志 */
/*			setTimeout(function(){
				if(tidVal == '0') {
//					mui.toast('预风控未通过!');
				} else {
					recardTradeTimeLog(stockCode, stockName, orderPrice, sellNum, orderType, tidVal, logRemark,
						clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo,
						gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
				}
			}, 3000);*/
		}
	});
}


/* 记录交易时间日志 */
function recardTradeTimeLog(stockCode, stockName, orderPrice, sellNum, orderType, tidVal, logRemark,
					clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo,
					gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime) {
	var apCostTime = ''; //Ap报单时间
   	var clickTimeStr = strToDateFormatTimeSSS(clickTime);  //点击确认时间
   	var precheckStartTimeStr = strToDateFormatTimeSSS(precheckStartTime); //预风控开始时间
   	var precheckEndTimeStr = strToDateFormatTimeSSS(precheckEndTime); //预风控结束时间
   	var sendorderStartTimeStr = strToDateFormatTimeSSS(sendorderStartTime); //下单开始时间
   	var sendorderEndTimeStr = strToDateFormatTimeSSS(sendorderEndTime); //下单结束时间
   
 	/*console.log('点击确认时间:' + clickTimeStr);	
	console.log('预风控开始时间:' + precheckStartTimeStr);	
	console.log('预风控结束时间:' + precheckEndTimeStr);	
	console.log('下单开始时间:' + sendorderStartTimeStr);	
	console.log('下单结束时间:' + sendorderEndTimeStr);	*/
   
   	//计算预风控使用时间(毫秒)
   	var precheckCostTime = countTwoDateMilliSeconds(precheckStartTime, precheckEndTime);
   	var sendorderCostTime = countTwoDateMilliSeconds(sendorderStartTime, sendorderEndTime);
// 	console.log('预风控毫秒数:' + precheckCostTime);	
// 	console.log('下单毫秒数:' + sendorderCostTime);	
// 	console.log('券商委托编号:' + securitiesTraderEntrustNo);
// 	console.log('业务编号:' + tidVal);
    
   	//组织参数
   	var paramsLog = recardTradeTimeLogParams(stockCode, stockName, orderPrice, sellNum, orderType, tidVal,logRemark,
   						apCostTime , clickTimeStr, precheckStartTimeStr, precheckCostTime, 
   						sendorderStartTimeStr, sendorderEndTimeStr, sendorderCostTime, securitiesTraderEntrustNo,
   						gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
   	//发送给服务器
   	mui.web_query_post('tradeTime/log', paramsLog, function(data){}, function(e){}, 1);
}



