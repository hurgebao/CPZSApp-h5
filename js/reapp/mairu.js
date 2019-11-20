/** 买入页面js */

/* 输入下单价格  处理 */
function verifyOrderPrice() {
	//下单价格
	var orderPrice = mui('#orderPrice')[0].value;
	//console.log('orderPrice:'+orderPrice);
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
	
	//console.log(limitPrice + '   '+ rallyPrice);
	
	/** 15:00:00-15:30:00，按固定价格-收盘价交易 */
	var currentTime = toCurrentTime();
	//股票代码 / 股票名称(验证股票是否存在)
	var stockCode = mui('#stockCode')[0].value;
	if(stockCode.substring(0,3) == '688' && '15:00:00' <= currentTime && currentTime < '15:30:00') {
		var currentPrice = mui('#currentPriceHid')[0].value;
		mui.toast('委托价必须是盘后固定价:'+currentPrice);
		mui('#orderPrice')[0].value = currentPrice;
		//计算可买股数
		countEnableNum();
		return true;
	}
	
	
	//如果涨停价为 0, 科创板不限制涨跌停
	if(parseFloat(limitPrice) > 0) {
		//验证跌停
		if(parseFloat(orderPrice) < parseFloat(rallyPrice)) {
			mui.toast('买入价不得低于'+rallyPrice);
			mui('#orderPrice')[0].value = rallyPrice;
			//计算可买股数
			countEnableNum();
			return false;
		}
		if(parseFloat(orderPrice) > parseFloat(limitPrice)) {
			mui.toast('买入价不得高于'+limitPrice);
			mui('#orderPrice')[0].value = limitPrice;
			//计算可买股数
			countEnableNum();
			return false;
		}
	}
	//console.log(mui('#orderPrice')[0].value);
	//计算可买股数
	countEnableNum();
	return true;
}

/* 计算验证可买股数 */
function countEnableNum() {
//	console.log('countEnableNum start....');
	var orderPrice = mui('#orderPrice')[0].value;
	if(orderPrice == '' || parseFloat(orderPrice) == 0) {
		//设置 快选仓位
		setQSelectNum(0);
		return false;
	}
	//当前可用
	var currentEnableAmt = mui('#currentEnableAmtHid')[0].value;
	if(currentEnableAmt == '') {
		//设置 快选仓位
		setQSelectNum(0);
		return false;
	}
	//计算可买股数
	/***
	 * 新计算方式:
	   	(1)先预算一个可买数量 
		preNum=可用资金/((1+总费率)*委托价)
		(2)可买数量按手向下取整，(可买数量/100)*100
		(3)按可买数量计算客户交易费用，serviceFee=可买数量*价格*总费率
		(4)如果serviceFee不小于最低收费X块，则返回该可买数量
	 费用不足5块:
	   	(5)如果serviceFee小于最低收费X块，则重新计算可买数量
		(6)可买数量preNum=(可用资金-X)/委托价
		(7)可买数量按手向下取整
	   * 
	   * 
	   * trade_service_fee_rate 交易服务费率    tradeServiceFeeRate
	   * trade_service_fee_min  交易服务费最低收费  tradeServiceFeeMin
	 */
	/** 新可买股数计算方式 */
	//股票代码 / 股票名称(验证股票是否存在)
	var stockCode = mui('#stockCode')[0].value;
	//用户登录信息
	var loginInfo = UserInfo.loginUser();
	//console.log('loginInfo: '+ JSON.stringify(loginInfo));
	//交易服务费率
	var tradeServiceFeeRate = loginInfo.tradeServiceFeeRate;
	//console.log('tradeServiceFeeRate: '+tradeServiceFeeRate);
	//交易服务费最低收费
	var tradeServiceFeeMin = loginInfo.tradeServiceFeeMin;

	/* 预可买股数 = 可用资金/((1+总费率)*委托价) */
	var enableNum = parseFloat(currentEnableAmt)/((1.00+parseFloat(tradeServiceFeeRate))*parseFloat(orderPrice))
	enableNum = enableNum.toFixed(6);
	//可买数量按手向下取整，(可买数量/100)*100
	if(stockCode.substring(0,3) == '688') {
		enableNum = parseInt(enableNum);
	} else {
		enableNum = parseInt(enableNum/100)*100;
	}
	//console.log('enableNum1: '+enableNum);
	if(enableNum >= 100) {
		//计算交易费用 serviceFee=可买数量*价格*总费率
		var serviceFee = parseFloat(enableNum)*parseFloat(orderPrice)*parseFloat(tradeServiceFeeRate);
		serviceFee = serviceFee.toFixed(6);
		//console.log('serviceFee: '+serviceFee);
		//如果serviceFee小于最低收费X块，则重新计算可买数量
		if(serviceFee < parseFloat(tradeServiceFeeMin)) {
			//重新计算可买股数
			enableNum=(parseFloat(currentEnableAmt)-parseFloat(tradeServiceFeeMin))/parseFloat(orderPrice);
			enableNum = enableNum.toFixed(6);
			if(stockCode.substring(0,3) == '688') {
				enableNum = parseInt(enableNum);
			} else {
				enableNum = parseInt(enableNum/100)*100;
			}
		}
		//console.log('enableNum2: '+enableNum);
	}
	
	//原可买计算方式
	/*var enableNum = parseFloat(currentEnableAmt)/parseFloat(orderPrice);
	enableNum = parseInt(enableNum/100)*100;*/
	//设置可买
	mui('#enableNumber')[0].innerHTML = '可买 '+fmoney(enableNum,0)+'股';
	mui('#enableNumberHid')[0].value = enableNum;
	
	//设置 快选仓位
	setQSelectNum(enableNum);
	
	//计算预买成交金额
	countProBuyAmt();
}

/* 设置 快选仓位  */
function setQSelectNum(enableNum) {
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


/* 验证买入量 */
function verifyBuyNum(){
	var enableNum = mui('#enableNumberHid')[0].value;
	if(parseInt(enableNum) == 0) {
		mui.toast('最大可买 0股,请检查买入价或余额');
		return false;
	}
	var buyNum = mui('#buyNum')[0].value;
	if(parseInt(buyNum) > parseInt(enableNum)) {
		mui.toast('最大可买 '+enableNum+'股');
		if(parseInt(enableNum) == 0) {
			mui('#buyNum')[0].value = '';
		} else {
			mui('#buyNum')[0].value = enableNum;
		}
		/* 计算预买成交金额 */
		countProBuyAmt();
		return false;
	}
	/* 计算预买成交金额 */
	countProBuyAmt();
}

/* 计算预买成交金额 */
function countProBuyAmt() {
//	console.log('计算预买成交金额...');
	//委托价格
	var orderPrice = mui('#orderPrice')[0].value;
	if(orderPrice == '' || parseFloat(orderPrice) == 0) {
		mui('#preBuyAmt')[0].innerHTML = '0.00';
		return false;
	}
	//委托数据
	var buyNum = mui('#buyNum')[0].value;
	if(buyNum == '' || parseFloat(buyNum) == 0) {
		mui('#preBuyAmt')[0].innerHTML = '0.00';
		return false;
	}
	//预买金额 
	var prebuyAmt = fmoney(parseFloat(orderPrice)*parseFloat(buyNum), 2);
	mui('#preBuyAmt')[0].innerHTML = prebuyAmt;
}

/* 点击快选仓位效果 */
function mousedown(idVal){
	document.getElementById(idVal).className="q-select-btn-click-1";
}
function mouseup(idVal){
	document.getElementById(idVal).className="q-select-btn-click";
	
}
//点击快选设置
function setQSelBuyNum(idVal) {
//	console.log('idVal:'+idVal);
	//设置委托量
	mui('#buyNum')[0].value = document.getElementById(idVal+'Hid').value;
	/* 计算预买成交金额 */
	countProBuyAmt();
}

//点击涨跌停价格
function setRallyLimitPrice(pFlag) {
	//console.log('pFlag:'+pFlag);
	var orderPrice = 0;
	if(pFlag == 'R') {
		//跌停价
		var rallyPrice = mui('#rallyPriceHid')[0].value;
		if(rallyPrice != ''){
			orderPrice = rallyPrice;
		}
	} else if(pFlag == 'L'){
		//涨停价
		var limitPrice = mui('#limitPriceHid')[0].value;
		if(limitPrice != ''){
			orderPrice = limitPrice;
		}
	} else if(pFlag == 'O') {
		//当前价
		var currentPrice = mui('#currentPriceHid')[0].value;
		if(currentPrice != ''){
			orderPrice = currentPrice;
		}
	}
	//价格框 赋值
	mui('#orderPrice')[0].value = orderPrice;
}

/** Ajax调用后台取数据(资金股份) */
function ajaxCapStockQuery(){ 
	/* ajax调用 资产股份 数据 */
	mui.web_query_post('query/getFundByAccount', capStockParams(), function(data){
			if(data.returnCode === 0){
				//资产对象
				var capMap = data.list[0];
				//当前可用
				mui('#currentEnableAmt')[0].innerHTML = '可用 '+formatCurrency(capMap.currentEnableAmt)+'元';
				mui('#currentEnableAmtHid')[0].value = capMap.currentEnableAmt;
				//console.log('获取账户资金成功[买入]:' + data.list);
			} else {
				//获取失败, 所有选项设置成0.00
				mui('#currentEnableAmt')[0].innerHTML = '可用 0.00元';
				mui('#currentEnableAmtHid')[0].value = '';
				//console.log('获取账户资金失败:' + e.returnMsg);
				mui.toast('获取账户资金失败:' + e.returnMsg);
			}
		}, function(e){
			//获取失败, 所有选项设置成0.00
			mui('#currentEnableAmtHid')[0].value = '';
		}, 3);
}

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
		mui.toast('买入价有误,请修改')
		return false;
	}
	var verifyPrice = verifyOrderPrice();
	if(!verifyPrice) {
		mui.toast('买入价格有误,请修改');
		return false;
	}
	//买入量(判断可用资金是否足够)
	var enableNum = mui('#enableNumberHid')[0].value;
	var buyNum = mui('#buyNum')[0].value;
	if(parseInt(buyNum) == 0) {
		mui.toast('买入量有误,请修改')
		return false;
	}
	
	/** 科创板不验证100的倍数 */
	if(stockCode.substring(0,3) == '688') {
		if(parseInt(buyNum) < 200) {
			mui.toast('科创板单笔最少200股,请修改')
			return false;
		}
	} else {
		if((parseInt(buyNum)%100) > 0) {
			mui.toast('买入量必须为100的整数倍,请修改')
			return false;
		}
	}
	
	if(parseInt(buyNum) > parseInt(enableNum)) {
		return false;
	}
	var orderType = '0';  //0买入 1卖出
	/*mui.toast('提交买入!!!');
	if(true) {
		return;
	}*/
	var warnMsg = '确定提交买入?';
	if(stockCode.substring(0,3) == '688') {
		warnMsg = '确定提交买入?\n(连续竞价期间,若委托买入价格高于买入基准价102%,或委托卖出价格低于卖出基准价98%,交易所将作废单处理,请及时查询委托结果)';
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
			
			//设置买入按钮 不可用    true不可用  false可用
			var buyBtn = document.getElementById("buyBtn");
			buyBtn.disabled = true;
			
			/* ajax预风控调用 */
			precheckStartTime = new Date(); //预风控开始时间(日志)
			
			var paramsRisk = sendOrderPreRiskParams(stockCode, stockName, orderPrice, buyNum, orderType);
			mui.web_query_post('trade/sendOrderPreRiskCheck', paramsRisk, function(data){
				sendorderStartTime = new Date(); //下单开始时间(日志)
				precheckEndTime = sendorderStartTime; //预风控结束时间(日志)
				gwPrecheckStartTime = data.gwPrecheckStartTime; //预风控结束时间(日志)(后台处理)
				gwPrecheckEndTime = data.gwPrecheckEndTime; //预风控开始时间(日志)(后台处理)
				if(data.returnCode == 0){
					/* ajax调用 委托下单 数据 Start */
					var params = sendOrderParams(stockCode, stockName, orderPrice, buyNum, orderType);
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
						
						//设置按钮不可用   true不可用  false可用
						buyBtn.disabled = false;
						
						/** 记录下单日志 */
						recardTradeTimeLog(stockCode, stockName, orderPrice, buyNum, orderType, tidVal, logRemark,
							clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo, 
							gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
						
					}, function(e){
						sendorderEndTime = new Date(); //下单结束时间(日志)
						logRemark = '下单异常:'+e; //业务说明(日志)
						
						/** 记录下单日志 */
						recardTradeTimeLog(stockCode, stockName, orderPrice, buyNum, orderType, tidVal, logRemark,
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
					buyBtn.disabled = false;
					
					/** 记录下单日志 */
					recardTradeTimeLog(stockCode, stockName, orderPrice, buyNum, orderType, tidVal, logRemark,
						clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo, 
						gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
				}
			}, function(e){
				precheckEndTime = new Date(); //预风控结束时间(日志)
				logRemark = '预风控异常'; //业务说明(日志)
				
				/** 记录下单日志 */
				recardTradeTimeLog(stockCode, stockName, orderPrice, buyNum, orderType, tidVal, logRemark,
					clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo, 
					gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
			}, 1);
			
			
			/** 延时3秒记录日志 */
/*			setTimeout(function(){
				if(tidVal == '0') {
//					mui.toast('预风控未通过!');
				} else {
					recardTradeTimeLog(stockCode, stockName, orderPrice, buyNum, orderType, tidVal, logRemark,
						clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo, 
						gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
				}
			}, 3000);*/
			
		}
	});
}


/* 记录交易时间日志 */
function recardTradeTimeLog(stockCode, stockName, orderPrice, buyNum, orderType, tidVal, logRemark,
					clickTime, precheckStartTime, precheckEndTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo, 
					gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime) {
	var apCostTime = ''; //Ap报单时间
   	var clickTimeStr = strToDateFormatTimeSSS(clickTime);  //点击确认时间
   	var precheckStartTimeStr = strToDateFormatTimeSSS(precheckStartTime); //预风控开始时间
   	var precheckEndTimeStr = strToDateFormatTimeSSS(precheckEndTime); //预风控结束时间
   	var sendorderStartTimeStr = strToDateFormatTimeSSS(sendorderStartTime); //下单开始时间
   	var sendorderEndTimeStr = strToDateFormatTimeSSS(sendorderEndTime); //下单结束时间
   
// 	console.log('点击确认时间:' + clickTimeStr);	
//	console.log('预风控开始时间:' + precheckStartTimeStr);	
//	console.log('预风控结束时间:' + precheckEndTimeStr);	
//	console.log('下单开始时间:' + sendorderStartTimeStr);	
//	console.log('下单结束时间:' + sendorderEndTimeStr);	
   
   	//计算预风控使用时间(毫秒)
   	var precheckCostTime = countTwoDateMilliSeconds(precheckStartTime, precheckEndTime);
   	var sendorderCostTime = countTwoDateMilliSeconds(sendorderStartTime, sendorderEndTime);
// 	console.log('预风控毫秒数:' + precheckCostTime);	
// 	console.log('下单毫秒数:' + sendorderCostTime);	
// 	console.log('券商委托编号:' + securitiesTraderEntrustNo);
// 	console.log('业务编号:' + tidVal);
    
   	//组织参数
   	var paramsLog = recardTradeTimeLogParams(stockCode, stockName, orderPrice, buyNum, orderType, tidVal,logRemark,
   						apCostTime , clickTimeStr, precheckStartTimeStr, precheckCostTime, 
   						sendorderStartTimeStr, sendorderEndTimeStr, sendorderCostTime, securitiesTraderEntrustNo,
   					gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime);
   	//发送给服务器
   	mui.web_query_post('tradeTime/log', paramsLog, function(data){}, function(e){}, 1);
}




//点击选择持仓列表
function seletMarketStock(stockCode, stockName) {
//	console.log(stockCode+'  '+stockName);
	//设置股票代码/股票名称
	mui('#stockCode')[0].value = stockCode;
	mui('#stockName')[0].innerHTML = stockName;
	mui('#buyNum')[0].value = '';
	//交易类型 B买入  S卖出 
	mui('#ifOnePrice')[0].value = 'T';
	//加载五档行情
	mui('#marketLocal')[0].value = 'F';
	queryMarketInfo();
	
	//判断子页面是否已存在, 如果存在 销毁
	var subPage = plus.webview.getWebviewById('mairu-marketlist.html');
	if(subPage != null) {
		//console.log('销毁子页面:'+subPage);
		subPage.close();
	}
}


/** 打开持仓列表 */
function toOpenMarketWindow(){
	//子页面ID
	var id = 'mairu-marketlist.html';
	//判断子页面是否已存在, 如果存在 销毁
	var subPage = plus.webview.getWebviewById(id);
	if(subPage != null) {
		//console.log('销毁子页面:'+subPage);
		subPage.close();
	}
	//打开子页面
	mui.openWindow({
			id: id,
			url: id,
			styles: {
				popGesture: 'close'
			},
			show: {
				aniShow: "slide-in-right"
			},
			waiting: {
				autoShow: false
			}
	});
}

