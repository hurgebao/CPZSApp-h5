/** 撤单操作  */

//双击撤单列表
function doubleCheDan(){
	
}
//委托明细展示与隐藏
function displayDesc(descId){
	var descStyle = mui('#'+descId)[0].style.display;
	if(descStyle == 'none') {
		mui('#'+descId)[0].style.display = 'block';
	} else {
		mui('#'+descId)[0].style.display = 'none';
	}
}

//设置资金持仓股票
function setStockListItem(objVal, n){
	var val = fmoney(0, n);
	if(objVal != undefined && objVal != null && objVal != 'null') {
		val = fmoney(objVal, n);
	}
    return val;
}

/* 加载查询委托列表 */
function ajaxEntrustListQuery(eventOpe){
	/* ajax调用 持仓列表 */
	mui.web_query_post('new/cancelorder/query', revokeQueryParams(), function(data){
		if(data.returnCode === 0){
			//持仓列表
			var listMaps = data.list;
			if(listMaps.length == 0) {
				//隐藏刷新
				mui('#scroll1').pullRefresh().endPulldownToRefresh();
				var contentStr = '<div class="box-list" style="text-align: center;font-size: 13px;color: #383838;">'
				     	+ '<span>没有相应的查询信息!</span>'
				     	+ '</div>';
				//添加到列表中 
				document.getElementById("boxLists").innerHTML = contentStr; 
				//清空列表中
				return ; 
			}
			//循环数组
			var contentStr = '';
			for(var i = 0;i < listMaps.length; i++) {
				var stockMap = listMaps[i];
				//买卖标识
				var buySellFlag = stockMap.buySellFlag;
				var buySellFlagName = codeBuySellFlag(buySellFlag);
				//列表样式
				fontStyle = '';
				if(buySellFlag == '0') { //买入
					fontStyle = 'box-list-bg-color-up';
				} else if(buySellFlag == '1'){ //卖出
					fontStyle = 'box-list-bg-color-down';
				}
				//委托状态
				var entrustStatusName = codeEntrustStatus(stockMap.entrustStatus);
				//委托类别
				var entrustTypeName = codeEntrustType(stockMap.entrustType);
				//委托时间
				var entrustTime = (timestampToDate(stockMap.entrustTime)).substr(11);
				var entrustTimeL = timestampToDate(stockMap.entrustTime);
				/* 加载模版展示持仓列表 */
				var showdata = {
					stockName:stockMap.stockName,
					stockCode:stockMap.stockCode,
					buySellFlag:buySellFlagName,
					entrustStatus:entrustStatusName,
					entrustPrice:setStockListItem(stockMap.entrustPrice, 2),
					entrustNum:setStockListItem(stockMap.entrustNum,0),
					entrustTime:entrustTime,
					dealPrice:setStockListItem(stockMap.dealPrice,2),
					entrustTimeL:entrustTimeL,
					dealAmt:setStockListItem(stockMap.dealAmt,2),
					busId:stockMap.id,
					traderNo:stockMap.securitiesTraderEntrustNo,
					entrustType:entrustTypeName,
					fundChannelNo:stockMap.fundChannelNo,
					fontStyle:fontStyle
				};
				//追加模板消息 
		        var strList = template('stock-tmp', { 
		            "showdata": showdata 
		        }); 
		        contentStr = contentStr + strList;
			}
			//添加到列表中 
			document.getElementById("boxLists").innerHTML = contentStr; 
			
			//隐藏刷新
			mui('#scroll1').pullRefresh().endPulldownToRefresh();
			//console.log('撤单查询成功');
			
		} else {
			//console.log('撤单查询失败:' + e.returnMsg);
		}
	}, function(e){}, 3);
}

//撤单提交(传入券商委托编号)
function revokeSubmit(stockCode, stockName, traderEntrustNo, fundChannelNo) {
	mui.confirm('确定提交撤单?', '提示', new Array('取消', '确认'), function(e){
		if(e.index == 1) {
			var clickTime = new Date(); //点击确认时间 (日志)
			var sendorderStartTime = ''; //撤单开始时间(日志)
			var sendorderEndTime = ''; //撤单结束时间(日志)
			var securitiesTraderEntrustNo = traderEntrustNo; //券商委托编号(日志)
			/* ajax调用 持仓列表 */
			var paramsRevoke = revokeSubmitParams(traderEntrustNo,fundChannelNo);
			var tidVal = paramsRevoke.tid; //业务编号 (日志)
			sendorderStartTime = new Date(); //撤单开始时间(日志)
			mui.web_query_post('new/cancelorder/cancel', paramsRevoke, function(data){
				if(data.returnCode === 0){
					/* 记录撤单日志参数 */
					sendorderEndTime = new Date(); //撤单结束时间(日志)
					
					/* 记录撤单日志 */
					var orderType = '9';
					recardTradeTimeLog(stockCode, stockName, '', '', orderType, tidVal, '',
						clickTime, sendorderStartTime, sendorderEndTime, traderEntrustNo);
					
					mui.alert('撤单提交完成');
					/* 刷新列表 */
					ajaxEntrustListQuery();
				} else {
					//console.log('撤单提交失败:' + data.returnMsg);
					mui.toast('撤单提交失败:' + data.returnMsg);
				}
			}, function(e){}, 3);
		}
	});
}



/* 记录交易时间日志 */
function recardTradeTimeLog(stockCode, stockName, orderPrice, sellNum, orderType, tidVal, logRemark,
					clickTime, sendorderStartTime, sendorderEndTime, securitiesTraderEntrustNo) {
	var apCostTime = ''; //Ap报单时间
   	var clickTimeStr = strToDateFormatTimeSSS(clickTime);  //点击确认时间
   	var sendorderStartTimeStr = strToDateFormatTimeSSS(sendorderStartTime); //下单开始时间
   	var sendorderEndTimeStr = strToDateFormatTimeSSS(sendorderEndTime); //下单结束时间
   
   	/*console.log('点击确认时间:' + clickTimeStr);	
	console.log('撤单开始时间:' + sendorderStartTimeStr);	
	console.log('撤单结束时间:' + sendorderEndTimeStr);*/
   
   	//计算预风控使用时间(毫秒)
   	var precheckCostTime = countTwoDateMilliSeconds(clickTime, clickTime);
   	var sendorderCostTime = countTwoDateMilliSeconds(sendorderStartTime, sendorderEndTime);
   	/*console.log('预风控毫秒数:' + precheckCostTime);	
   	console.log('撤单毫秒数:' + sendorderCostTime);	
   	console.log('券商委托编号:' + securitiesTraderEntrustNo);
   	console.log('业务编号:' + tidVal);*/
    
   	//组织参数
   	var paramsLog = recardTradeTimeLogParams(stockCode, stockName, orderPrice, sellNum, orderType, tidVal,logRemark,
   						apCostTime , clickTimeStr, clickTimeStr, '0',
   						sendorderStartTimeStr, sendorderEndTimeStr, sendorderCostTime, securitiesTraderEntrustNo,
   						clickTimeStr, clickTimeStr, clickTimeStr, clickTimeStr);
   	//发送给服务器
   	mui.web_query_post('tradeTime/log', paramsLog, function(data){}, function(e){}, 1);
}



//买卖标志
var TRADEFLAGMAP = { 
	0 : '买入', 
	1 : '卖出',
	2 : '送股',
	3 : '派息',
	4 : '配股',
	G : '零股',
	E : '送股扣税',
	F : '派息扣税'
};
var TRADEFLAGCOLORMAP = { 0 : 'red', 1 : 'green'};
var ENTRUSTTYPEMAP = { 0 : '买卖',  1 : '撤单', 2 : '送配', 3 : '管理'};

function getTradeStr(tradeFlag) {
	return TRADEFLAGMAP[tradeFlag];
}

//3正报改为 已报   9失败改为废单 
var ENTRUSTFLAGMAP = {
	0 : '未报',			
	1 : '废单',		
	2 : '已报',		
	3 : '已报',		
	5 : '部成',			
	6 : '已成',			
	7 : '部撤',	
	8 : '已撤',	
	9 : '废单'
}

function getEntrustStr(entrustStatus) {
	return ENTRUSTFLAGMAP[entrustStatus];
}

//根据long值得到时刻 "hh:mm:ss"
function getTime(longTime) {
	var time = new Date();
	var seperator = ':';
	time.setTime(longTime);
	var minutes = time.getMinutes();
	var seconds = time.getSeconds();
    var formatTime = time.getHours() + seperator + (minutes<10?('0'+minutes):minutes)+ seperator + (seconds<10?('0'+seconds):seconds);
    return formatTime;
}


//设置日期，当前日期的前n天
function getBeforeDate(n){
     var n = n;
     var d = new Date();
     var year = d.getFullYear();
     var mon=d.getMonth()+1;
     var day=d.getDate();
     if(day <= n){
             if(mon>1) {
               mon=mon-1;
            }
            else {
              year = year-1;
              mon = 12;
             }
            }
           d.setDate(d.getDate()-n);
           year = d.getFullYear();
           mon=d.getMonth()+1;
           day=d.getDate();
     s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
      return s;
 }

//根据long值得到日期 "yyyy-MM-dd"
function getDateByLong(date) {
/*	var time = new Date(longTime);
	var seperator = '-';
    var formatDate = time.getFullYear() + seperator + (time.getMonth()+1) + seperator + time.getDay();*/
    return format(new Date(date),"yyyy-MM-dd");
}

 function format(now,mask)
  {
      var d = now;
      var zeroize = function (value, length)
      {
          if (!length) length = 2;
          value = String(value);
          for (var i = 0, zeros = ''; i < (length - value.length); i++)
          {
              zeros += '0';
          }
          return zeros + value;
      };
   
      return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0)
      {
          switch ($0)
          {
              case 'd': return d.getDate();
              case 'dd': return zeroize(d.getDate());
              case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
              case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
              case 'M': return d.getMonth() + 1;
              case 'MM': return zeroize(d.getMonth() + 1);
              case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
              case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
              case 'yy': return String(d.getFullYear()).substr(2);
              case 'yyyy': return d.getFullYear();
              case 'h': return d.getHours() % 12 || 12;
              case 'hh': return zeroize(d.getHours() % 12 || 12);
              case 'H': return d.getHours();
              case 'HH': return zeroize(d.getHours());
              case 'm': return d.getMinutes();
              case 'mm': return zeroize(d.getMinutes());
              case 's': return d.getSeconds();
              case 'ss': return zeroize(d.getSeconds());
              case 'l': return zeroize(d.getMilliseconds(), 3);
              case 'L': var m = d.getMilliseconds();
                  if (m > 99) m = Math.round(m / 10);
                  return zeroize(m);
              case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
              case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
              case 'Z': return d.toUTCString().match(/[A-Z]+$/);
              // Return quoted strings with the surrounding quotes removed
              default: return $0.substr(1, $0.length - 2);
          }
      });
  }

function getTypeColor(type) {
	return TRADEFLAGCOLORMAP[type];
}

function getEntrustTypeStr(type) {
	return ENTRUSTTYPEMAP[type];
}

function getDictKeyValueNew(key){
	var info = "";
	switch(Number(key)) {
		case 0:
		case 1:
		case 2:
		case 8: 
			info = "存入";
			break;
		default:
			info = "取出";
	}
	return info;
}