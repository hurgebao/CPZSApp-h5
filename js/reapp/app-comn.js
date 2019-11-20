	/** 公共自定义 js */

	/** *********************  用户登录 Start ********************* */
	function UserInfo(){
	};
	
	//清除登录信息
	UserInfo.clear = function(){
	    //plus.storage.removeItem('username');
	    plus.storage.removeItem('password');
	    plus.storage.removeItem('token');
	    plus.storage.removeItem('autoLogin');
	    plus.storage.removeItem('loginUser');
		//plus.storage.removeItem('currentVersion');
//	    plus.storage.removeItem('osTypeName');
	    //验证码
	    plus.storage.removeItem('verifyCode');
	}
	
	//检查是否已登录
	UserInfo.has_login = function(){
	    var username = UserInfo.username();
	    var pwd = UserInfo.password();
	    var token = UserInfo.token();
	    if(!username || !pwd || !token){
	        return false;
	    }
	    return true;
	};
	
	//设置&获取用户名
	UserInfo.username = function(){
	    if(arguments.length == 0){
	        return plus.storage.getItem('username');        
	    }
	    if(arguments[0] === ''){
	        plus.storage.removeItem('username');
	        return;
	    }
	    plus.storage.setItem('username', arguments[0]);
	};
	
	//设置&获取密码
	UserInfo.password = function(){
	    if(arguments.length == 0){
	        return plus.storage.getItem('password');        
	    }
	    if(arguments[0] === ''){
	        plus.storage.removeItem('password');
	        return;
	    }
	    plus.storage.setItem('password', arguments[0]);
	};
	
	//设置&获取Token
	UserInfo.token = function(){
	    if(arguments.length == 0){
	        return plus.storage.getItem('token');       
	    }
	    if(arguments[0] === ''){
	        plus.storage.removeItem('token');
	        return;
	    }
	    plus.storage.setItem('token', arguments[0]);
	};
	
	//设置&获取当前版本
	UserInfo.currentVersion = function(){
	    if(arguments.length == 0){
	        return plus.storage.getItem('currentVersion');       
	    }
	    if(arguments[0] === ''){
	        plus.storage.removeItem('currentVersion');
	        return;
	    }
	    plus.storage.setItem('currentVersion', arguments[0]);
	};
	
	//设置&获取登录验证码
	UserInfo.verifyCode = function(){
	    if(arguments.length == 0){
	        return plus.storage.getItem('verifyCode');       
	    }
	    if(arguments[0] === ''){
	        plus.storage.removeItem('verifyCode');
	        return;
	    }
	    plus.storage.setItem('verifyCode', arguments[0]);
	};
	
	//设置&获取用户登录操作系统
	UserInfo.osTypeName = function(){
	    if(arguments.length == 0){
	        return plus.storage.getItem('osTypeName');       
	    }
	    if(arguments[0] === ''){
	        plus.storage.removeItem('osTypeName');
	        return;
	    }
	    plus.storage.setItem('osTypeName', arguments[0]);
	};
	
	
	//设置&获取是否自动登录(OK自动登录, NO不自动登录)
	UserInfo.autoLogin = function(){
	    if(arguments.length == 0){
	        return plus.storage.getItem('autoLogin');        
	    }
	    if(arguments[0] === ''){
	        plus.storage.removeItem('autoLogin');
	        return;
	    }
	    plus.storage.setItem('autoLogin', arguments[0]);
	};
	
	//检查是否包含自动登录的信息
	UserInfo.auto_login = function(){
	    var username = UserInfo.username();
	    var pwd = UserInfo.password();
	    if(!username || !pwd){
	        return false;
	    }
	    return true;
	}
	
	//存储登录对象 loginUser
	UserInfo.loginUser = function(){
	    if(arguments.length == 0){
	    	//把Json字符串格式转换成对象
	    	var loginUserJson = plus.storage.getItem('loginUser');
	        return JSON.parse(loginUserJson); 
	    }
	    if(arguments[0] === ''){
	        plus.storage.removeItem('loginUser');
	        return;
	    }
	    //把对象转换成json字符串格式存储
	    var loginUserJson = JSON.stringify(arguments[0]);
	    plus.storage.setItem('loginUser', loginUserJson);
	};
	
	//获取用户登录名
	UserInfo.getUserName = function(){
		//获取登录对象
		var loginUser = UserInfo.loginUser();
		if(loginUser != undefined && loginUser != '' && loginUser.accountName != '') {
			//交易账户名
			var accountName = loginUser.accountName;
			//交易账户号
			var accountNo = loginUser.accountNo;
			//组合
			var loginMsg = accountNo + ' ('+ accountName+')';
			//console.log('登录账户:'+loginMsg);
			return loginMsg;
		}
		return '';
	}
	
	/** *********************  用户登录 End ********************* */
	

//获取唯一编号
function getReqTId() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var rand = parseInt(10000*Math.random());
    var tId = '8'+date.getFullYear() + month + strDate 
    	+ date.getHours() + date.getMinutes() + date.getSeconds()+rand;
    return tId;
}

//获取当前日期 格式“yyyy-MM-dd HH:MM:SS”
function getNowFormatTime() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}


//获取当前日期 格式“yyyyMMddHHmmssSSS”
function strToDateFormatTimeSSS(date) {
	if(date == null || date == '') {return '';}
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hours = date.getHours();
    var minute = date.getMinutes();
    var secmonds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
    }
    if (secmonds >= 0 && secmonds <= 9) {
        secmonds = "0" + secmonds;
    }
    if (milliseconds >= 0 && milliseconds <= 9) {
        milliseconds = "00" + milliseconds;
    } else if (milliseconds >= 10 && milliseconds <= 99) {
    	milliseconds = "0" + milliseconds;
    }
    var currentdate = ''+date.getFullYear() + month + strDate
            + hours + minute + secmonds + milliseconds;
    //console.log('currentdate:'+currentdate);
    return currentdate;
}

//计算两个日期之间的毫秒数(日期类型)
function countTwoDateMilliSeconds(dateStart, dateEnd) {
		if(dateStart == null || dateStart == '' || dateEnd == null || dateEnd == '') {
			return 0;
		}
        var s1 = dateStart.getTime(); 
        var s2 = dateEnd.getTime();
        var totalMilliSeconds = (s2 - s1)
      	return totalMilliSeconds; 
}


//获取当前日期 格式“yyyy-MM-dd”
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//根据Date对象 获取格式“yyyy-MM-dd”
function getFormatDate(date) {
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}


/*获取当前时间  格式“yyyy-MM-dd HH:MM:SS” */
function getNowFormatDateFmd() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}




//数字转成千分位(保留两位小数)
function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num)){
    	num = "0.00";
    }
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10) {
    	cents = "0" + cents;
    }
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
    	num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
    }
    return (((sign)?'':'-') + num + '.' + cents);
 }

/** 参数说明： s要格式化的数字 n：保留几位小数  */
function fmoney(s, n) {
    n = n >= 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    //判断是否为负数
    var sFlag = false;
    if(parseFloat(s) < 0) {
    	sFlag = true;
    	s = (parseFloat(s)*-1.00).toFixed(n) + '';
    }
    var l = s.split(".")[0].split("").reverse();
    var r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    if(n == 0) {
    	if(sFlag) {
    		return '-' + t.split("").reverse().join("");
    	} else {
    		return t.split("").reverse().join("");
    	}
    }
    if(sFlag) {
    	return '-' + t.split("").reverse().join("") + "." + r;
    } else {
    	return t.split("").reverse().join("") + "." + r;
    }
   
}



/** 获取五档行情 Start */
//股票不存在设置
function stockNoExist(){
	//股票名称
	mui('#stockName')[0].innerHTML = '--';
	//当前价
	mui('#currentPrice')[0].innerHTML = '--';
	//涨幅
	mui('#profitPer')[0].innerHTML = '涨幅 --%';
	mui('#profitPer2')[0].innerHTML = ' --%';
	//跌停
	mui('#rallyValue')[0].innerHTML = '跌停 --';
	//涨停
	mui('#limitValue')[0].innerHTML = '涨停 --';
	
	/* 五档行情 卖 */
	var sellFiveHtml = '';
	sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖十', 'N');
	sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖九', 'N');
	sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖八', 'N');
	sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖七', 'N');
	sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖六', 'N');
	
	sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖五', 'N');
	sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖四', 'N');
	sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖三', 'N');
	sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖二', 'N');
	sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖一', 'N');
	//添加到列表
	mui('#box-sell-area')[0].innerHTML = sellFiveHtml;
	
	/* 五档行情 买  */
	var buyFiveHtml = '';
	buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买一', 'N');
	buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买二', 'N');
	buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买三', 'N');
	buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买四', 'N');
	buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买五', 'N');
	
	buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买六', 'N');
	buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买七', 'N');
	buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买八', 'N');
	buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买九', 'N');
	buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买十', 'N');
	//添加到列表
	mui('#box-buy-area')[0].innerHTML = buyFiveHtml;
	
	//设置隐藏信息
	mui('#stockNameHid')[0].value = ''; //股票名称
	mui('#rallyPriceHid')[0].value = ''; //跌停
	mui('#limitPriceHid')[0].value = ''; //涨停
	mui('#currentPriceHid')[0].value = ''; //当前价
	
	//设置默认十档行情位置
	//mui('.mui-scroll-wrapper').scroll().scrollTo(0,-92,100);
	
	/* 下方行情图  */
	marketGif('min', '分时图', '');
}

//读取股票行情
function queryMarketInfo(){
  	//console.log('读取股票行情..');	
  	var ifStock = true;
    //股票代码
	var stockCode = document.getElementById('stockCode').value;
	if(stockCode == '' || stockCode.length < 6 || stockCode.length > 6) {
		//行情设置为空
		stockNoExist();
		//是否赋值第一档行情  N否
		mui('#ifOnePrice')[0].value = 'T';
		mui('#orderPrice')[0].value = '0';
		return false;
	}
	
	//判断取行情源
  	var marketSourceId = mui('#marketSourceId')[0].value;
  	var marketType = mui('#marketType')[0].value;
  	var marketUrl = mui('#marketUrl')[0].value;
  	//临时办法
  	if(marketSourceId == '') {
//		console.log('行情源为空');
  		marketSourceId = '1';
  		marketType = '2';
  		marketUrl = sourceUrlLevel2;
  	}
  	//console.log(marketSourceId+'  '+marketType+'  '+marketUrl);
  	if(marketType == '2') {
  		//console.log('读取 Level-2 行情..');
  		/** Level-2行情 */
  		ifStock = queryMarketInfo10(marketUrl);
  	} else if(marketType == '1') {
  		//console.log('读取 公司 行情..');
  		/** 五档行情 */
  		ifStock = queryMarketInfo51(marketUrl);
  	}
  	
  	/* 下方行情图  */
  	var imgMarketGif = document.getElementById('imgMarketGif');
	if(imgMarketGif != null && imgMarketGif != undefined) {
		var imgFlag = mui('#imgFlag')[0].value;
		var imgFlagName = mui('#imgFlagName')[0].value;
		//加载行情图
		marketGif(imgFlag, imgFlagName, stockCode);
	} 
  	return ifStock;
}


//读取股票行情(Level-2行情)
function queryMarketInfo10(marketUrl){
	var ifStock = true;
	//股票代码
	var stockCode = document.getElementById('stockCode').value;
	//组织股票代码,区分是上证还是深证
	if(stockCode.substr(0,1) == '0' || stockCode.substr(0,1) == '2' || stockCode.substr(0,1) == '3') {
		stockCode = 'sz'+stockCode;
	} else {
		stockCode = 'sh'+stockCode;
	}
	/** 发送读取行情 */
	var xhr_svn = new plus.net.XMLHttpRequest();  
	xhr_svn.onreadystatechange = function() {   
	    if (xhr_svn.readyState == 4) {   
	        if (xhr_svn.status == 200) {
	        	//行情体
	            var stockContent = xhr_svn.responseText;
	        	//console.log('查询行情反馈体:'+stockContent);
	        	
	        	//验证是否请求异常    level2 行情返回错误编码: E001（认证不通过） E002（证券不存在） E003（证券没有有效时间内的数据）
	        	if(stockContent != null && stockContent != undefined  && stockContent.indexOf("E003") > -1) {
	        		ifStock = false;
		            //切换行情源
		        	cutMarketSource();
		        	return ;
	        	}
	        	//验证股票是否存在 
	        	if(stockContent == null || stockContent == undefined || stockContent.length < 30) {
	        		mui.toast( "股票不存在或Level-2行情源有误！"); 
	        		//行情网络连接错误
					stockNoExist();
					ifStock = false;
					return ;
	        	}
	        	
	            /** 解析行情对象 */
	            var stockContents = stockContent.split(',');
	            //console.log('stockContents:'+stockContents);
	           	/* App显示行情,  取行情赋值 */
				//股票名称
				mui('#stockName')[0].innerHTML = stockContents[62];
				//当前价
				mui('#currentPrice')[0].innerHTML = parseFloat(stockContents[6]).toFixed(2);
				
				//涨跌幅计算
				var preClose = parseFloat(stockContents[2]); //昨收
				var newPrice = parseFloat(stockContents[6]); //当前价
				var profitPer = ((newPrice-preClose)/preClose*100).toFixed(2);
//				console.log('涨跌幅:'+profitPer);
				mui('#profitPer')[0].innerHTML = '涨幅 '+profitPer+' %';
				mui('#profitPer2')[0].innerHTML = profitPer+'%';
//				console.log('涨跌幅:'+mui('#profitPer2')[0].innerHTML);
				
				//设置当前涨幅颜色
				if(profitPer > 0) {
					mui('#currentPrice')[0].style.color = '#FF0000';
					mui('#profitPer')[0].style.color = '#FF0000';
					mui('#profitPer2')[0].style.color = '#FF0000';
				}
				if(profitPer < 0) {
					mui('#currentPrice')[0].style.color = '#4876FF';
					mui('#profitPer')[0].style.color = '#4876FF';
					mui('#profitPer2')[0].style.color = '#4876FF';
				}
				
				
				//股票代码
				var stockCodeVal = document.getElementById('stockCode').value;
				/* 科创板股票计算涨跌停 */
				if(stockCodeVal.substring(0,3) == '688') {
//				if(false) {
					/* 读取科创板股票 */
					var params = getStibStockSetParams(stockCodeVal);
					mui.web_query_post('stibstock/getStibStockSet', params, function(data){
						if(data.returnCode === 0){
//							console.log('data:' + JSON.stringify(data));
							var dataStib = data.resMap;
							var rallyValue = '0.00';
							var limitValue = '0.00';
							//涨跌幅限制类型 不限制涨跌幅0，限制涨跌幅1
							if(dataStib.limit_rally_type == '1') {
								rallyValue = (preClose*0.80).toFixed(2);
								limitValue = (preClose*1.20).toFixed(2);
								mui('#rallyValue')[0].innerHTML = '跌停 '+rallyValue;
								mui('#limitValue')[0].innerHTML = '涨停 '+limitValue;
							} else {
								mui('#rallyValue')[0].innerHTML = '跌停: 不限';
								mui('#limitValue')[0].innerHTML = '涨停: 不限';
							}
//							mui('#rallyValue')[0].innerHTML = '跌停 '+rallyValue;
//							mui('#limitValue')[0].innerHTML = '涨停 '+limitValue;
							mui('#rallyPriceHid')[0].value = rallyValue; //跌停
							mui('#limitPriceHid')[0].value = limitValue; //涨停
						}
					}, function(e){}, 3);
				} else {
					//跌停
					mui('#rallyValue')[0].innerHTML = '跌停 '+parseFloat(stockContents[57]).toFixed(2);
					//涨停
					mui('#limitValue')[0].innerHTML = '涨停 '+parseFloat(stockContents[56]).toFixed(2);
					mui('#rallyPriceHid')[0].value = parseFloat(stockContents[57]).toFixed(2); //跌停
					mui('#limitPriceHid')[0].value = parseFloat(stockContents[56]).toFixed(2); //涨停
				}
				
				
				
				/* 五档行情 卖 */
				var sellFiveHtml = '';
				/* 卖六  到 卖十 Start */
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[16], stockContents[26], '卖十', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[15], stockContents[25], '卖九', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[14], stockContents[24], '卖八', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[13], stockContents[23], '卖七', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[12], stockContents[22], '卖六', 'Y');
				/* 卖六  到 卖十 End */
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[11], stockContents[21], '卖五', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[10], stockContents[20], '卖四', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[9], stockContents[19], '卖三', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[8], stockContents[18], '卖二', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[7], stockContents[17], '卖一', 'Y');
				//添加到列表
				mui('#box-sell-area')[0].innerHTML = sellFiveHtml;
				
				/* 五档行情 买  */
				var buyFiveHtml = '';
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[27], stockContents[37], '买一', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[28], stockContents[38], '买二', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[29], stockContents[39], '买三', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[30], stockContents[40], '买四', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[31], stockContents[41], '买五', 'Y');
				/* 买六 到 买十 Start */
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[32], stockContents[42], '买六', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[33], stockContents[43], '买七', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[34], stockContents[44], '买八', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[35], stockContents[45], '买九', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[36], stockContents[46], '买十', 'Y');
				/* 买六 到 买十 End */
				
				//添加到列表
				mui('#box-buy-area')[0].innerHTML = buyFiveHtml;
				
				//设置隐藏信息
				mui('#stockNameHid')[0].value = stockContents[62]; //股票名称
				mui('#currentPriceHid')[0].value = parseFloat(stockContents[6]).toFixed(2); //当前价
				
				//行情切换次数归零
				mui('#cutTimes')[0].value = '0';
				
				
				//是否赋值一档行情价
				var ifOnePrice = mui('#ifOnePrice')[0].value;
				//交易类型 B买入  S卖出 
				var tradeType = mui('#tradeType')[0].value;
//				console.log('ifOnePrice:'+ifOnePrice);
				if(ifOnePrice == 'T' && tradeType == 'B') {
					mui('#orderPrice')[0].value = parseFloat(stockContents[7]).toFixed(2);
					mui('#ifOnePrice')[0].value = 'N';
//					console.log('#orderPrice:'+mui('#orderPrice')[0].value);
				}
				if(ifOnePrice == 'T' && tradeType == 'S') {
					mui('#orderPrice')[0].value = parseFloat(stockContents[27]).toFixed(2);
					mui('#ifOnePrice')[0].value = 'N';
				}
				if(tradeType == 'B') {
//					console.log('买入交易..');
					//计算可买股数
					countEnableNum(); 
				}
				
				//指定位置
				var marketLocal = mui('#marketLocal')[0].value;
				//console.log('marketLocal:'+marketLocal);
				if(marketLocal == 'F') {
					//mui('.mui-scroll-wrapper').scroll().scrollTo(0,-92,100);
					mui('#marketLocal')[0].value = 'T';
				}
	        } else {   
	            ifStock = false;
	            //切换行情源
	        	cutMarketSource();
	        }  
	    }   
	}   
	//console.log('Level-2行情源:'+marketUrl+stockCode);
	/* 下发请求行情 */
	xhr_svn.open("GET", marketUrl+stockCode);//这里的地址是上面json文件的地址   
	//获取加密时间
	xhr_svn.setRequestHeader('l2register', createTimeEncrypt());
	xhr_svn.send(); 
	return ifStock;
}

/* 获取加密时间串 */
function createTimeEncrypt() {
	var dateObj = new Date();
	//当前毫秒数
	var longTimes = '' + dateObj.getTime();
	//console.log('longTimes:'+ longTimes);
	//当前小时数
	var longHours = dateObj.getHours();
	//console.log('longHours:'+ longHours);
	//当前月份
	var longMonth = dateObj.getMonth() + 1;
	//console.log('longMonth:'+ longMonth);
	
	//第一次加密
	var strVal = '';
	for(i=0;i<longTimes.length;i++){ 
		var sCodeVal = longTimes.charAt(i).charCodeAt();
		var sVal = sCodeVal ^ longHours;
		strVal = strVal + String.fromCharCode(sVal);
	}
	//console.log('第一次加密:'+strVal);
	
	//第二次加密
	var longTimes = longTimes + '-' + strVal;
	//console.log('longTimes222:'+ longTimes);
	var strVal = '';
	for(i=0;i<longTimes.length;i++){ 
		var sCodeVal = longTimes.charAt(i).charCodeAt();
		var sVal = sCodeVal ^ longMonth;
		strVal = strVal + String.fromCharCode(sVal);
	}
	return strVal;
	//console.log('第二次加密:'+strVal);
}



//读取股票行情(五档行情一)
function queryMarketInfo51(marketUrl){
	var ifStock = true;
	//股票代码
	var stockCode = document.getElementById('stockCode').value;
	//组织股票代码,区分是上证还是深证
	if(stockCode.substr(0,1) == '0' || stockCode.substr(0,1) == '2' || stockCode.substr(0,1) == '3') {
		stockCode = 'sz'+stockCode;
	} else {
		stockCode = 'sh'+stockCode;
	}
	
	/** 发送读取行情 */
	var xhr_svn = new plus.net.XMLHttpRequest();  
	xhr_svn.onreadystatechange = function() { 
		//console.log('xhr_svn readyState: '+xhr_svn.readyState);
	    if (xhr_svn.readyState == 4) {  
	    	//console.log('xhr_svn status:'+xhr_svn.status+'  '+marketUrl);
	        if (xhr_svn.status == 200) {
	        	//console.log(xhr_svn.getAllResponseHeaders());
	        	//行情体
	            var stockContent = xhr_svn.responseText;
	        	//console.log(marketUrl+'五档行情源反馈体:'+stockContent);
	        	if(stockContent == null || stockContent == undefined || stockContent.length < 30) {
	        		mui.toast( "股票不存在或五档行情源有误！"); 
	        		//行情网络连接错误
					stockNoExist();
					ifStock = false;
					return ;
	        	}
	        	
	            /** 解析行情对象 */
	            //格式  var hq_str_sh601006="大秦铁路, 27.55, 27.25, 26.91, 27.55....";
	            //按=号拆分
	            var stockSplits = stockContent.split('=');
	            //替换掉""
	            var stockVals = stockSplits[1].replace('"','');
	            //console.log('stockVals:'+stockVals);
	            //按,拆分
	            var stockContents = stockVals.split(',');
	            //console.log('stockContents:'+stockContents);
	            
	           	/* App显示行情,  取行情赋值 */
				//股票名称
				mui('#stockName')[0].innerHTML = stockContents[0];
				//当前价
				mui('#currentPrice')[0].innerHTML = parseFloat(stockContents[3]).toFixed(2);
		
				//涨跌幅计算
				var preClose = parseFloat(stockContents[2]); //昨收
				var newPrice = parseFloat(stockContents[3]); //当前价
				var profitPer = ((newPrice-preClose)/preClose*100).toFixed(2);
				//console.log('涨跌幅:'+profitPer);
				mui('#profitPer')[0].innerHTML = '涨幅 '+profitPer+' %';
				mui('#profitPer2')[0].innerHTML = profitPer+'%';
				//设置当前涨幅颜色
				if(profitPer > 0) {
					mui('#currentPrice')[0].style.color = '#FF0000';
					mui('#profitPer')[0].style.color = '#FF0000';
					mui('#profitPer2')[0].style.color = '#FF0000';
				}
				if(profitPer < 0) {
					mui('#currentPrice')[0].style.color = '#4876FF';
					mui('#profitPer')[0].style.color = '#4876FF';
					mui('#profitPer2')[0].style.color = '#4876FF';
				}
				
				//股票代码
				var stockCodeVal = document.getElementById('stockCode').value;
				/* 科创板股票计算涨跌停 */
				if(stockCodeVal.substring(0,3) == '688') {
//				if(false) {
					/* 读取科创板股票 */
					var params = getStibStockSetParams(stockCodeVal);
					mui.web_query_post('stibstock/getStibStockSet', params, function(data){
						if(data.returnCode === 0){
//							console.log('data:' + JSON.stringify(data));
							var dataStib = data.resMap;
							var rallyValue = '0.00';
							var limitValue = '0.00';
							//涨跌幅限制类型 不限制涨跌幅0，限制涨跌幅1
							if(dataStib.limit_rally_type == '1') {
								rallyValue = (preClose*0.80).toFixed(2);
								limitValue = (preClose*1.20).toFixed(2);
								mui('#rallyValue')[0].innerHTML = '跌停 '+rallyValue;
								mui('#limitValue')[0].innerHTML = '涨停 '+limitValue;
							} else {
								mui('#rallyValue')[0].innerHTML = '跌停: 不限';
								mui('#limitValue')[0].innerHTML = '涨停: 不限';
							}
//							mui('#rallyValue')[0].innerHTML = '跌停 '+rallyValue;
//							mui('#limitValue')[0].innerHTML = '涨停 '+limitValue;
							mui('#rallyPriceHid')[0].value = rallyValue; //跌停
							mui('#limitPriceHid')[0].value = limitValue; //涨停
						}
					}, function(e){}, 3);
				} else {
					//跌停
					var rallyValue = (preClose*0.90).toFixed(2);
					mui('#rallyValue')[0].innerHTML = '跌停 '+rallyValue;
					//涨停
					var limitValue = (preClose*1.10).toFixed(2);
					mui('#limitValue')[0].innerHTML = '涨停 '+limitValue;
					mui('#rallyPriceHid')[0].value = rallyValue; //跌停
					mui('#limitPriceHid')[0].value = limitValue; //涨停
				}
				
				/* 五档行情 卖 */
				var sellFiveHtml = '';
				sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖十', 'N');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖九', 'N');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖八', 'N');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖七', 'N');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed('0', '0.00', 0, '卖六', 'N');
	
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[29], stockContents[28], '卖五', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[27], stockContents[26], '卖四', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[25], stockContents[24], '卖三', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[23], stockContents[22], '卖二', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[21], stockContents[20], '卖一', 'Y');
				//添加到列表
				mui('#box-sell-area')[0].innerHTML = sellFiveHtml;
				
				/* 五档行情 买  */
				var buyFiveHtml = '';
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[11], stockContents[10], '买一', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[13], stockContents[12], '买二', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[15], stockContents[14], '买三', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[17], stockContents[16], '买四', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[19], stockContents[18], '买五', 'Y');
				
				buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买六', 'N');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买七', 'N');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买八', 'N');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买九', 'N');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed('0', '0.00', 0, '买十', 'N');
				//添加到列表
				mui('#box-buy-area')[0].innerHTML = buyFiveHtml;
				
				//设置隐藏信息
				mui('#stockNameHid')[0].value = stockContents[0]; //股票名称
				mui('#currentPriceHid')[0].value = parseFloat(stockContents[3]).toFixed(2); //当前价
				
				//行情切换次数归零
				mui('#cutTimes')[0].value = '0';
				//console.log('五档处理完成...');
				
				//是否赋值一档行情价
				var ifOnePrice = mui('#ifOnePrice')[0].value;
				//交易类型 B买入  S卖出 
				var tradeType = mui('#tradeType')[0].value;
//				console.log('ifOnePrice:'+ifOnePrice);
				if(ifOnePrice == 'T' && tradeType == 'B') {
					mui('#orderPrice')[0].value = parseFloat(stockContents[21]).toFixed(2);
					mui('#ifOnePrice')[0].value = 'N';
					//计算可买股数
//					countEnableNum(); 
				}
				if(ifOnePrice == 'T' && tradeType == 'S') {
					mui('#orderPrice')[0].value = parseFloat(stockContents[11]).toFixed(2);
					mui('#ifOnePrice')[0].value = 'N';
				}
				if(tradeType == 'B') {
//					console.log('买入交易..');
					//计算可买股数
					countEnableNum(); 
				}
	        } else {
	        	ifStock = false;
	        	
	        	//console.log('切换...');
	        	//切换行情源
	        	cutMarketSource();
	        }
	    }   
	}   
	//console.log('五档行情源:'+marketUrl+stockCode);
	/* 下发请求行情 */
	xhr_svn.open("GET", marketUrl+stockCode);//这里的地址是上面json文件的地址   
//	xhr_svn.setRequestHeader('Content-Type', 'application/javascript;charset=GBK');
/*	xhr_svn.setRequestHeader('Accept-Charset', 'UTF-8');*/
	xhr_svn.send(); 
	
	return ifStock;
}



//切换行情源
function cutMarketSource() {
	//行情源已切换次数
	var cutTimes = mui('#cutTimes')[0].value;
	if(parseInt(cutTimes) >= 3) {
		return ;
	}
	//当前行情源
	var currMarketSourceId = mui('#marketSourceId')[0].value;
  	var currMarketType = mui('#marketType')[0].value;
  	var currMarketUrl = mui('#marketUrl')[0].value;
	//切换行情源
	var popoverAs = document.getElementsByName('popoverA');
	//console.log('popoverAs:'+popoverAs);
	for(var i=0;i<popoverAs.length;i++) {
		//行情类型 1 五档行情         2 Level-2行情
		var marketType = popoverAs[i].getAttribute('marketType');
		var marketSourceId = popoverAs[i].getAttribute('marketSourceId');
		//取下一个行情源
		if(currMarketSourceId == marketSourceId) {
			//判断是否最后一个行情源
			var newPopoverAs = popoverAs[0];
			if((i+1) < popoverAs.length) {
				newPopoverAs = popoverAs[i+1];
			} 
			//设置行情源
			mui('#marketSourceId')[0].value = newPopoverAs.getAttribute('marketSourceId');
			mui('#marketUrl')[0].value = newPopoverAs.getAttribute('marketUrl');
			mui('#marketType')[0].value = newPopoverAs.getAttribute('marketType');
			//行情源切换次数+1
			mui('#cutTimes')[0].value = parseInt(cutTimes)+1;
			
			//重新读取行情
			queryMarketInfo();
			
			//行情显示位置  2 Level-2行情    1新浪行情
			if(newPopoverAs.getAttribute('marketType') == '2') {
  				//mui('.mui-scroll-wrapper').scroll().scrollTo(0,-92,100);
			} else {
  				//mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0,100);
			}
			
			mui.toast('行情源切换为['+newPopoverAs.getAttribute('marketName')+']');
			
			//跳出循环
			break;
		}
	}
	
	//设置选择的颜色
	var popoverAsColor = document.getElementsByName('popoverA');
	var marketSourceIdColor = mui('#marketSourceId')[0].value;
	for(var i=0;i<popoverAsColor.length;i++) {
		if(popoverAsColor[i].getAttribute('marketSourceId') == marketSourceIdColor) {
			popoverAsColor[i].style.cssText = 'color:red';
		} else {
			popoverAsColor[i].style.cssText = 'color:#383838';
		}
	}
}



//读取股票行情(公司行情)
function queryMarketInfo51Old(){
	var ifStock = true;
	//股票代码
	var stockCode = document.getElementById('stockCode').value;
	/* ajax调用 后台, 取行情 */
	var queryUrl = 'stockMarket/'+stockCode;
	mui.web_query_get(queryUrl, function(data){
		if(JSON.stringify(data) == '{}') {
			mui.toast('股票不存在')
			//行情设置为空
			stockNoExist();
			ifStock = false;
		} else {
			/** 取行情赋值 */
			//股票名称
			mui('#stockName')[0].innerHTML = data.stock_name;
			//当前价
			mui('#currentPrice')[0].innerHTML = parseFloat(data.current_price).toFixed(2);
			//涨幅
			mui('#profitPer')[0].innerHTML = '涨幅 '+parseFloat(data.profit_per).toFixed(2)+' %';
			mui('#profitPer2')[0].innerHTML = parseFloat(data.profit_per).toFixed(2)+'%';
			//设置当前涨幅颜色
			if(parseFloat(data.profit_per) > 0) {
				mui('#currentPrice')[0].style.color = '#FF0000';
				mui('#profitPer')[0].style.color = '#FF0000';
				mui('#profitPer2')[0].style.color = '#FF0000';
			}
			if(parseFloat(data.profit_per) < 0) {
				mui('#currentPrice')[0].style.color = '#4876FF';
				mui('#profitPer')[0].style.color = '#4876FF';
				mui('#profitPer2')[0].style.color = '#4876FF';
			}
			//跌停
			mui('#rallyValue')[0].innerHTML = '跌停 '+parseFloat(data.rally_value).toFixed(2);
			//涨停
			mui('#limitValue')[0].innerHTML = '涨停 '+parseFloat(data.limit_value).toFixed(2);
			
			/* 五档行情 卖 */
			var sellFiveHtml = '';
			sellFiveHtml = sellFiveHtml + loadFiveSpeed(data.yest_value, data.sell_price_5, data.sell_num_5, '卖五', 'N');
			sellFiveHtml = sellFiveHtml + loadFiveSpeed(data.yest_value, data.sell_price_4, data.sell_num_4, '卖四', 'N');
			sellFiveHtml = sellFiveHtml + loadFiveSpeed(data.yest_value, data.sell_price_3, data.sell_num_3, '卖三', 'N');
			sellFiveHtml = sellFiveHtml + loadFiveSpeed(data.yest_value, data.sell_price_2, data.sell_num_2, '卖二', 'N');
			sellFiveHtml = sellFiveHtml + loadFiveSpeed(data.yest_value, data.sell_price_1, data.sell_num_1, '卖一', 'N');
			//添加到列表
			mui('#box-sell-area')[0].innerHTML = sellFiveHtml;
			
			/* 五档行情 买  */
			var buyFiveHtml = '';
			buyFiveHtml = buyFiveHtml + loadFiveSpeed(data.yest_value, data.buy_price_1, data.buy_num_1, '买一', 'N');
			buyFiveHtml = buyFiveHtml + loadFiveSpeed(data.yest_value, data.buy_price_2, data.buy_num_2, '买二', 'N');
			buyFiveHtml = buyFiveHtml + loadFiveSpeed(data.yest_value, data.buy_price_3, data.buy_num_3, '买三', 'N');
			buyFiveHtml = buyFiveHtml + loadFiveSpeed(data.yest_value, data.buy_price_4, data.buy_num_4, '买四', 'N');
			buyFiveHtml = buyFiveHtml + loadFiveSpeed(data.yest_value, data.buy_price_5, data.buy_num_5, '买五', 'N');
			
			//添加到列表
			mui('#box-buy-area')[0].innerHTML = buyFiveHtml;
			
			//设置隐藏信息
			mui('#stockNameHid')[0].value = data.stock_name; //股票名称
			mui('#rallyPriceHid')[0].value = parseFloat(data.rally_value).toFixed(2); //跌停
			mui('#limitPriceHid')[0].value = parseFloat(data.limit_value).toFixed(2); //涨停
			mui('#currentPriceHid')[0].value = parseFloat(data.current_price).toFixed(2); //当前价
		}
	});
	return ifStock;
}


//读取股票行情(五档行情二)
function queryMarketInfo52Old(){
	var ifStock = true;
	//股票代码
	var stockCode = document.getElementById('stockCode').value;
	//组织股票代码,区分是上证还是深证
	if(stockCode.substr(0,1) == '0' || stockCode.substr(0,1) == '2' || stockCode.substr(0,1) == '3') {
		stockCode = 'sz'+stockCode;
	} else {
		stockCode = 'sh'+stockCode;
	}
	/** 发送读取行情 */
	var xhr_svn = new plus.net.XMLHttpRequest();  
	xhr_svn.onreadystatechange = function() {   
	    if (xhr_svn.readyState == 4) {   
	        if (xhr_svn.status == 200) {  
	        	//console.log(xhr_svn.getAllResponseHeaders());
	        	//行情体
	            var stockContent = xhr_svn.responseText;
	        	//console.log('五档2行情源反馈体:'+stockContent);
	        	if(stockContent == null || stockContent == undefined || stockContent.length < 30) {
	        		mui.toast( "五档2行情源有误！"); 
	        		//行情网络连接错误
					stockNoExist();
					ifStock = false;
					return ;
	        	}
	        	
	            /** 解析行情对象 */
	            //格式  var hq_str_sh601006="大秦铁路, 27.55, 27.25, 26.91, 27.55....";
	            //按=号拆分
	            var stockSplits = stockContent.split('=');
	            //替换掉""
	            var stockVals = stockSplits[1].replace('"','');
	            //console.log('stockVals:'+stockVals);
	            //按,拆分
	            var stockContents = stockVals.split(',');
	            //console.log('stockContents:'+stockContents);
	            
	           	/* App显示行情,  取行情赋值 */
				//股票名称
				mui('#stockName')[0].innerHTML = stockContents[0];
				//当前价
				mui('#currentPrice')[0].innerHTML = parseFloat(stockContents[3]);
				//涨跌幅计算
				var preClose = parseFloat(stockContents[2]); //昨收
				var newPrice = parseFloat(stockContents[3]); //当前价
				var profitPer = ((newPrice-preClose)/preClose*100).toFixed(2);
				//console.log('涨跌幅:'+profitPer);
				mui('#profitPer')[0].innerHTML = '涨幅 '+profitPer+' %';
				mui('#profitPer2')[0].innerHTML = profitPer+'%';
				//设置当前涨幅颜色
				if(profitPer > 0) {
					mui('#currentPrice')[0].style.color = '#FF0000';
					mui('#profitPer')[0].style.color = '#FF0000';
					mui('#profitPer2')[0].style.color = '#FF0000';
				}
				if(profitPer < 0) {
					mui('#currentPrice')[0].style.color = '#4876FF';
					mui('#profitPer')[0].style.color = '#4876FF';
					mui('#profitPer2')[0].style.color = '#4876FF';
				}
				//跌停
				var rallyValue = (preClose*0.90).toFixed(2);
				mui('#rallyValue')[0].innerHTML = '跌停 '+rallyValue;
				//涨停
				var limitValue = (preClose*1.10).toFixed(2);
				mui('#limitValue')[0].innerHTML = '涨停 '+limitValue;
				
				/* 五档行情 卖 */
				var sellFiveHtml = '';
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[29], stockContents[28], '卖五', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[27], stockContents[26], '卖四', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[25], stockContents[24], '卖三', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[23], stockContents[22], '卖二', 'Y');
				sellFiveHtml = sellFiveHtml + loadFiveSpeed(stockContents[2], stockContents[21], stockContents[20], '卖一', 'Y');
				//添加到列表
				mui('#box-sell-area')[0].innerHTML = sellFiveHtml;
				
				/* 五档行情 买  */
				var buyFiveHtml = '';
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[11], stockContents[10], '买一', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[13], stockContents[12], '买二', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[15], stockContents[14], '买三', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[17], stockContents[16], '买四', 'Y');
				buyFiveHtml = buyFiveHtml + loadFiveSpeed(stockContents[2], stockContents[19], stockContents[18], '买五', 'Y');
				
				//添加到列表
				mui('#box-buy-area')[0].innerHTML = buyFiveHtml;
				
				//设置隐藏信息
				mui('#stockNameHid')[0].value = stockContents[0]; //股票名称
				mui('#rallyPriceHid')[0].value = rallyValue; //跌停
				mui('#limitPriceHid')[0].value = limitValue; //涨停
				mui('#currentPriceHid')[0].value = parseFloat(stockContents[3]).toFixed(2); //当前价
				
				
	        } else {
	        	mui.toast( "自动切换到五档行情2");
	        }   
	    }   
	}   
	/* 下发请求行情 */
	xhr_svn.open("GET", 'http://hq.sinajs.cn/list='+stockCode);//这里的地址是上面json文件的地址   
	xhr_svn.send(); 
	return ifStock;
}




//点击五档行情价格
function setOrderPrice(orderPrice) {
	//价格框 赋值
	mui('#orderPrice')[0].value = orderPrice;
}


//点击涨跌停价格
function setRallyLimitPrice(pFlag) {
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

//获取行情  昨收价,委价,委量(股),委名, 委量是否除以100(Y是 N否)
function loadFiveSpeed(yestValue, speedPrice, speedNum, speedName, speedNumDivideFlag){
	//颜色样式
	var styleColor = 'box-b-list-flat';
	if(parseFloat(speedPrice) == 0) {
		//五档价为0, 不加样式
		styleColor = '';
	} else {
		//昨收价
		if(parseFloat(yestValue) > parseFloat(speedPrice)) {
			styleColor = 'box-b-list-rally';
		} else if(parseFloat(yestValue) < parseFloat(speedPrice)){
			styleColor = 'box-b-list-limit';
		}
	}
	if(speedPrice == undefined || parseFloat(speedPrice) == 0) {
		speedPrice = '--';
	}
	//量
	if(speedNum == undefined || parseFloat(speedPrice) == 0) {
		speedNum = '--';
	} else {
		if(speedNumDivideFlag == 'Y') {
			speedNum = (speedNum/100).toFixed(0);
		}
	}
	if(speedPrice != '--') {
		speedPrice = parseFloat(speedPrice).toFixed(2);
	}
	var marketHtml = '<div class="box-b-list '+styleColor+'"  onclick="setOrderPrice('+speedPrice+');verifyOrderPrice();">'
							+ '<p class="box-b-list-1">'+speedName+'</p>'
							+ '<p class="box-b-list-2">'+speedPrice+'</p>'
							+ '<p class="box-b-list-3">'+speedNum+'</p>'
						+'</div>';
	return marketHtml;
}



//读取行情(Gif)
function marketGif(marketUrl, gifName, stockCode) {
	//如果不存在行情Gif_Div, 不执行
	var imgMarketGif = document.getElementById('imgMarketGif');
	if(imgMarketGif == null || imgMarketGif == undefined) {
		return ;
	} 
	mui('#imgFlag')[0].value = marketUrl;
	mui('#imgFlagName')[0].value = gifName;
	var stockName = mui('#stockNameHid')[0].value;
	var stockCode = '';
	if(stockName == '') {
		stockCode = 'sh000001';
	} else {
		stockCode = mui('#stockCode')[0].value;
		//判断是上证还是深证
		if (stockCode.substr(0,1) == '0' || stockCode.substr(0,1) == '2' || stockCode.substr(0,1) == '3') {
            stockCode = "sz"+stockCode;
        } else {
            stockCode = "sh"+stockCode;
        }
	}
	//取新浪行情
	var imgSrc = 'http://image.sinajs.cn/newchart/'+marketUrl+'/n/'+stockCode+'.gif';
	document.getElementById('imgMarketGif').src = imgSrc;
	document.getElementById('gifName').innerHTML = gifName;
}

/** 获取五档行情 End */



/* 数字前补 0 */
function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
/* timestamp 时间戳 转成 日期时间格式 */
function timestampToDate(time) {
	 var datetime = new Date();
     datetime.setTime(time);
     var year = datetime.getFullYear();
     var month = prefixInteger(datetime.getMonth()+1, 2);
     var date = prefixInteger(datetime.getDate(), 2);
     var hour = prefixInteger(datetime.getHours(), 2);
     var minute = prefixInteger(datetime.getMinutes(), 2);
     var second = prefixInteger(datetime.getSeconds(), 2);
     return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}

/* 获取当前时间  MM:ss */
function toCurrentTime() {
	 var datetime = new Date();
     var hour = prefixInteger(datetime.getHours(), 2);
     var minute = prefixInteger(datetime.getMinutes(), 2);
     var second = prefixInteger(datetime.getSeconds(), 2);
     return hour+":"+minute+":"+second;
}



/** 公共码值 Start */
/* 买卖标识 */
function codeBuySellFlag(c){
	var cName = '';
	switch(c) {
		case '0': cName = '买入'; break;
		case '1': cName = '卖出'; break;
		case '2': cName = '送股'; break;
		case '3': cName = '派息'; break;
		case '4': cName = '配股'; break;
		default:'--'
	}
	return cName;
}
/* 委托状态 */
function codeEntrustStatus(c){
	var cName = '';
	switch(c) {
		case '0': cName = '未报'; break;
		case '1': cName = '废单'; break;
		case '2': cName = '已报'; break;
		case '3': cName = '正报'; break;
		case '5': cName = '部成'; break;
		case '6': cName = '已成'; break;
		case '7': cName = '部撤'; break;
		case '8': cName = '已撤'; break;
		case '9': cName = '失败'; break;
		default:'--'
	}
	return cName;
}
/* 委托类别 */
function codeEntrustType(c){
	var cName = '';
	switch(c) {
		case '0': cName = '买卖'; break;
		case '1': cName = '撤单'; break;
		case '2': cName = '送配'; break;
		case '3': cName = '管理'; break;
		default:'--'
	}
	return cName;
}
/** 公共码值 End */

//更改日期
function changeDate(dateName) {
/*			   var dDate = new Date();
		   dDate.setFullYear(2017, 8, 4);*/
		   //最小时间
		   var minDate = new Date();
		   minDate.setFullYear(2010, 0, 1);
/*		   //最大时间
		   var maxDate = new Date();
		   maxDate.setFullYear(2017, 11, 31);*/
		   
		   //mui启动日期  第一个函数:选择日期时动作, 第二个:取消时期选择  第三个:创建一个弹出对象
		   plus.nativeUI.pickDate(
		   	  function(e){
		   	  	//选择日期, 触发当前函数
			   	var d = e.date;
			   	document.getElementById(dateName).innerHTML = getFormatDate(d);
			  },
			   function(e) {
			   	//没有选择日期, 或点击屏幕其他地方, 触发当前函数
			   	mui.toast('您没有选择日期');
		   	  },{
		   	  	title: '请选择日期',
		   	  	//date: dDate,
		   	  	minDate: minDate
//maxDate: maxDate
		   	  }
		   );
}

/** 统计盈亏比例(盈亏比例 =(市值-(持仓股数*成本价))/成本金额) */
function countProfitRate(marketAmt, currentRemainNum, costPrice) {
	//市值
	if(marketAmt == undefined || marketAmt == null || marketAmt == '0') {
		return 0;
	}
	//当前股数
	if(currentRemainNum == undefined || currentRemainNum == null || currentRemainNum == '0') {
		return 0;
	}
	//成本价
	if(costPrice == undefined || costPrice == null || costPrice == '0') {
		return 0;
	}
	//计算盈亏比例
	var costAmt = (parseFloat(currentRemainNum)*parseFloat(costPrice));
//	console.log('-----------------'+marketAmt+'-------'+costAmt)
	var profitRateVal = (marketAmt-costAmt)/costAmt*100;
	return profitRateVal;
}




