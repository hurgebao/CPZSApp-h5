/*********** 请求参数列表    ***/

/* 登录请求参数列表 */
function loginParams(username, password, osTypeName){
	var currentVersion = UserInfo.currentVersion();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	var params = {
	  accountNo: username,  //账户号
	  hostName: "",	//主机名
	  ip1: "",		//IP地址
	  ip2: "",		//IP地址 
	  mac1: "",		//Mac地址
	  mac2: "",		//Mac地址
	  newPwd: "",		//新密码
	  sourceSysCode: osTypeName,
	  tid: 0,		//唯一编号
	  token: "",	//唯一码
	  clientVersion: currentVersion, //当前版本
	  tradePwd: password   //账户密码
	}
	//console.log('登录请求:'+JSON.stringify(params))
	return params;
}

/* 修改密码 */
function modifyPasswordParams(oldPassword, newPassword) {
	var accountNoVal = UserInfo.username();
	var currentVersion = UserInfo.currentVersion();
	var tokenVal = UserInfo.token();
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	var params = {
	  accountNo: accountNoVal,  //账户号
	  clientVersion: currentVersion, //当前版本
	  hostName: "",	//主机名
	  ip1: "",		//IP地址
	  ip2: "",		//IP地址 
	  mac1: "",		//Mac地址
	  mac2: "",		//Mac地址
	  newPwd: newPassword,		//新密码
	  sourceSysCode: osTypeName,
	  tid: 0,		//唯一编号
	  token: tokenVal,	//唯一码
	  tradePwd: oldPassword   //账户密码
	}
	//console.log('更改密码请求:'+JSON.stringify(params))
	return params;
}

/* 账户资金 请求参数列表 */
function capStockParams(username, password){
	var accountNoVal = UserInfo.username();
	var tokenVal = UserInfo.token();
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	var params = {
	  accountNo: accountNoVal,  //账户号
	  beginDate: getNowFormatDate(),
	  beginIndex: 0,
	  endDate: getNowFormatDate(),
	  fundChannelGroupNo: accountNoVal, //交易账号
	  pageSize: 1,
	  sourceSysCode: osTypeName,
	  token: tokenVal
	}  
	//console.log('获取账户资金 请求:'+JSON.stringify(params))
	return params;
}


/* 账户资金股份(持仓) 请求参数列表 */
function capStockListParams(onStockCode, beginIndex){
	var stockCodeVal = onStockCode ? onStockCode : '';
	var beginIndexVal = beginIndex ? beginIndex : '';
	//本地缓存信息
	var accountNoVal = UserInfo.username();
	var tokenVal = UserInfo.token();
	//资金池编号
	var loginInfo = UserInfo.loginUser();
	var fundPoolCode = loginInfo.fundPoolCode;
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	//请求参数体
	var params = {
	  accountNo: accountNoVal,  //账户号
	  beginDate: getNowFormatDate(),
	  beginIndex: beginIndexVal,
	  endDate: getNowFormatDate(),
	  fundChannelGroupNo: accountNoVal, //交易账号
	  fundPoolCode: fundPoolCode,
	  pageSize: 50,
	  sourceSysCode: osTypeName,
	  stockCode:stockCodeVal,
	  tid:getReqTId(),
	  token: tokenVal
	}  
	//console.log('获取账户资金股份(持仓) 请求数据:'+JSON.stringify(params))
	return params;
}


/* 委托下单 预风控 请求参数列表 orderType: 0买入 1卖出 orderPrice:委托价格  volumeNm:委托量 */
function sendOrderPreRiskParams(stockCode, stockName, orderPrice, volumeNm, orderType){
	var accountNoVal = UserInfo.username();
	var tokenVal = UserInfo.token();
	//资金池编号
	var loginInfo = UserInfo.loginUser();
	var fundPoolCode = loginInfo.fundPoolCode;
	var upFundPoolNo = loginInfo.upFundPoolNo;
	//请求参数体
	var params = {
	  accountNo: accountNoVal,
	  entrustNum: volumeNm,
	  entrust_price: orderPrice,
	  fundPoolCode: fundPoolCode,
	  sellBuyFlag: orderType, //0买入 1卖出
	  stockCode: stockCode,
	  stockName: stockName,
	  token: tokenVal,
	  upFundPoolCode: upFundPoolNo
	}  
	//console.log('委托下单 预风控检查 请求数据:'+JSON.stringify(params))
	return params;
}


/* 委托下单 请求参数列表 orderType: 0买入 1卖出 orderPrice:委托价格  volumeNm:委托量 */
function sendOrderParams(stockCode, stockName, orderPrice, volumeNm, orderType){
	var accountNoVal = UserInfo.username();
	var tokenVal = UserInfo.token();
	//资金池编号
	var loginInfo = UserInfo.loginUser();
	var fundPoolCode = loginInfo.fundPoolCode;
	var upFundPoolNo = loginInfo.upFundPoolNo;
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	//请求参数体
	var params = {
	  accountNo: accountNoVal,
	  batchId: 0,
	  fundPoolCode: fundPoolCode,
	  isAutoRevokeOutFiverange: true,
	  orderType: orderType, //0买入 1卖出
	  price: orderPrice,
	  priceType: 0,
	  secID: stockCode,
	  sourceSysCode: osTypeName,
	  stockName: stockName,
	  tid: getReqTId(),
	  token: tokenVal,
	  upFundPoolCode: upFundPoolNo,
	  volume: volumeNm
	}  
	//console.log('委托下单 请求数据:'+JSON.stringify(params))
	return params;
}

/** 记录交易时间日志  orderType: 0买入 1卖出 orderPrice:委托价格  volumeNm:委托量 */
function recardTradeTimeLogParams(stockCode, stockName, orderPrice, volumeNm, orderType, tidVal, logRemark,
		apCostTime, clickTime, precheckStartTime, precheckCostTime, 
		sendorderStartTime, sendorderEndTime, sendorderCostTime, securitiesTraderEntrustNo,
		gwPrecheckStartTime, gwPrecheckEndTime, gwSendOrderStartTime, gwSendOrderEndTime) {
	var accountNoVal = UserInfo.username();
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	//请求参数体
	var params = {
		accountNo : accountNoVal,
		buySellFlag : orderType,//买卖标志
		clickTime: clickTime,//客户端点击确定时间 yyyyMMddHHmmssSSS
		entrustNum:volumeNm, //委托数量
		entrustPrice:orderPrice, //委托价格
		precheckCostTime: precheckCostTime, //预风控耗时,单位毫秒
		precheckStartTime: precheckStartTime, //'客户端预风控耗时间yyyyMMddHHmmssSSS
		securitiesTraderEntrustNo: securitiesTraderEntrustNo,//券商委托编号
		sendorderCostTime: sendorderCostTime,//下单耗时,单位毫秒
		sendorderEndTime: sendorderEndTime,//下单截止时间yyyyMMddHHmmssSSS
		sendorderStartTime:sendorderStartTime,//开始下单时间yyyyMMddHHmmssSSS
		gwPrecheckStartTime:gwPrecheckStartTime,
		gwPrecheckEndTime:gwPrecheckEndTime,
		gwSendOrderStartTime:gwSendOrderStartTime,
		gwSendOrderEndTime:gwSendOrderEndTime,
		sourceSysCode:osTypeName,//交易渠道
		stockCode:stockCode,//股票代码
		stockName:stockName,//股票名称
		tid:tidVal , //业务编号
		remark: '委托响应:'+logRemark //备注说明 
	}
	return params;
}

/** 撤单查询 */
function revokeQueryParams(){
	var accountNoVal = UserInfo.username();
	var tokenVal = UserInfo.token();
	//资金池编号
	var loginInfo = UserInfo.loginUser();
	var fundPoolCode = loginInfo.fundPoolCode;
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	//请求参数体
	var params = {
	  accountNo: accountNoVal,
	 /* fundChnlNo: 0,*/
	  fundPoolCode: fundPoolCode,
	  secEntrustNo: "",
	  sourceSysCode: osTypeName,
	  token: tokenVal
	}  
	//console.log('撤单查询 请求数据:'+JSON.stringify(params))
	return params;
}


/** 当日委托查询请求数据获取 */
function getCurrentQueryParams(startIndex) {
	var accountInfo = UserInfo.loginUser();
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	var params = {
		  "accountNo": UserInfo.username(),
		  "beginDate": getNowFormatDate(),
		  "beginIndex": startIndex,
		  "endDate": getNowFormatDate(),
		  "fundPoolCode": accountInfo.fundPoolCode,
		  "pageSize": 15,
		  "sourceSysCode": osTypeName,
		  "tid": getReqTId(),
		  "token": UserInfo.token()
	}
	return params;
}

/** 当日成交查询请求数据获取 */
function getCurrentDealQueryParams(startIndex) {
	var accountInfo = UserInfo.loginUser();
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	var params = {
		  "accountNo": UserInfo.username(),
		  "beginDate": getNowFormatDate(),
		  "beginIndex": startIndex,
		  "endDate": getNowFormatDate(),
		  "fundPoolCode": accountInfo.fundPoolCode,
		  "pageSize": 15,
		  "sourceSysCode": osTypeName,
		  "tid": getReqTId(),
		  "token": UserInfo.token()
	}
	return params;
}

/** 历史委托查询请求数据获取 */
function getHistoryQueryParams(reqBeginDate, reqEndDate, startIndex) {
	var accountInfo = UserInfo.loginUser();
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	var params = {
		  "accountNo": UserInfo.username(),
		  "beginDate": reqBeginDate,
		  "beginIndex": startIndex,
		  "endDate": reqEndDate,
		  "fundPoolCode": accountInfo.fundPoolCode,
		  "pageSize": 15,
		  "sourceSysCode": osTypeName,
		  "tid": getReqTId(),
		  "token": UserInfo.token()
	}
	return params;
}

/** 历史成交查询请求数据获取 */
function getHistoryDealParams(reqBeginDate, reqEndDate, startIndex) {
	var accountInfo = UserInfo.loginUser();
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	var params = {
		  "accountNo": UserInfo.username(),
		  "beginDate": reqBeginDate,
		  "beginIndex": startIndex,
		  "endDate": reqEndDate,
		  "fundPoolCode": accountInfo.fundPoolCode,
		  "pageSize": 15,
		  "sourceSysCode": osTypeName,
		  "tid": getReqTId(),
		  "token": UserInfo.token()
	}
	return params;
}

/** 出入金流水查询请求数据获取 */
function getAccountMgrDetailParams(reqBeginDate, reqEndDate, startIndex) {
	var accountInfo = UserInfo.loginUser();
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	var params = {
		  "accountNo": UserInfo.username(),
		  "beginDate": reqBeginDate,
		  "beginIndex": startIndex,
		  "endDate": reqEndDate,
		  "fundPoolCode": accountInfo.fundPoolCode,
		  "pageSize": 15,
		  "sourceSysCode": osTypeName,
		  "tid": getReqTId(),
		  "token": UserInfo.token()
	}
	return params;
}

/** 撤单提交 */
function revokeSubmitParams(traderEntrustNo, fundChannelNo){
	var accountNoVal = UserInfo.username();
	var tokenVal = UserInfo.token();
	//资金池编号
	var loginInfo = UserInfo.loginUser();
	var fundPoolCode = loginInfo.fundPoolCode;
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	//请求参数体
	var params = {
	  accountNo: accountNoVal,
	  fundChnlNo: fundChannelNo,
	  fundPoolCode: fundPoolCode,
	  secEntrustNo: traderEntrustNo, //券商编号
	  sourceSysCode: osTypeName,
	  tid: getReqTId(),
	  token: tokenVal
	}  
	//console.log('撤单提交 请求数据:'+JSON.stringify(params))
	return params;
}

/** 读取科创板股票 */
function getStibStockSetParams(stockCodeVal) {
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	//请求参数体
	var params = {
	  stockCode : stockCodeVal,
	  sourceSysCode: osTypeName,
	  tid: getReqTId()
	}  
	return params;
}




/** 查询图表数据  */
function getFundChartByAccountParams(username){
	var accountNoVal = UserInfo.username();
	var tokenVal = UserInfo.token();
	var osTypeName = UserInfo.osTypeName();
	if(osTypeName == '') {
		osTypeName = 'IOS-App';
	}
	//资金池编号
	var loginInfo = UserInfo.loginUser();
	var fundPoolCode = loginInfo.fundPoolCode;
	var params = {
	  accountNo: accountNoVal,  //账户号
	  beginDate: getNowFormatDate(),
	  beginIndex: 0,
	  endDate: getNowFormatDate(),
	  fundChannelGroupNo: accountNoVal, //交易账号
	  pageSize: 150,
	  fundPoolCode:fundPoolCode,
	  tid:getReqTId(),
	  sourceSysCode: osTypeName,
	  token: tokenVal
	}
	//console.log('获取账户资金 请求:'+JSON.stringify(params))
	return params;
}


/** 模糊查询股票列表  */
function queryStockListsByValParams(stockCodeVal){
	var accountNoVal = UserInfo.username();
	//资金池编号
	var loginInfo = UserInfo.loginUser();
	var fundPoolCode = loginInfo.fundPoolCode;
	var params = {
	  accountNo: accountNoVal,  //账户号
	  fundPoolCode:fundPoolCode,
	  stockCode: stockCodeVal
	}
	//console.log('获取账户资金 请求:'+JSON.stringify(params))
	return params;
}




