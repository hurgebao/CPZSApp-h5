/** 持仓js */

//设置资金金额
function setCapItem(objVal, fieldName){
	var val = formatCurrency(0);
	if(objVal != undefined && objVal != null && objVal != 'null') {
		val = formatCurrency(objVal);
	}
    document.getElementById(fieldName).innerHTML = val;
}

//设置资金金额(子页面)
function setCapItemSub(objVal, fieldName){
	var val = formatCurrency(0);
	if(objVal != undefined && objVal != null && objVal != 'null') {
		val = formatCurrency(objVal);
	}
    document.getElementById(fieldName).innerHTML = val;
}

/** Ajax调用后台取数据(资金股份) */
function ajaxCapStockQuery(){ 
	//加载标识
	document.getElementById('loadFlag').value = '1';
	/* ajax调用 资产股份 数据 */
	mui.web_query_post('query/getFundByAccount', capStockParams(), function(data){
			if(data.returnCode === 0){
				//资产对象
				var capMap = data.list[0];
				//总资产
				setCapItem(capMap.totalAsset, "totalAsset");
//				setCapItem(0, "totalAsset");
				//可用资产
				setCapItem(capMap.currentEnableAmt, "currentEnableAmt");
				//持仓市值
				setCapItem(capMap.positionMarketValue, "positionMarketValue");
				//setCapItem(0, "positionMarketValue");
	
				//盈亏
				setCapItem(capMap.profitLossAmt, "profitAmt");
				//setCapItem(0, "profitAmt");
				//资金余额
				setCapItem(capMap.currentRemainAmt, "currentRemainAmt");
				
				/* 计算预警线线 */
				//总规模
				var totalAmt = capMap.totalAmt;
				if(totalAmt == null) {
					totalAmt = 0;
				}
				//预警线
				var precautiousLine = capMap.precautiousLine;
				if(precautiousLine == null) {
					precautiousLine = 0;
				}
				//平仓线
				var openLine = capMap.openLine;
				if(openLine == null) {
					openLine = 0;
				}
				//预警线值
				var precautiousLineVal = parseFloat(totalAmt)*parseFloat(precautiousLine);
				setCapItem(precautiousLineVal+"", "precautiousLineAmt");
				//预警线
				document.getElementById("precautiousLine").innerHTML = 100*parseFloat(precautiousLine)+" %";
				
				//平仓线值
				var openLineVal = parseFloat(totalAmt)*parseFloat(openLine);
				setCapItem(openLineVal+"", "openLineAmt");
				//预警线
				document.getElementById("openLine").innerHTML = 100*parseFloat(openLine)+" %";
				
				
				//冻结资金 & 当前可用资金
				document.getElementById('currentBuyFreezeAmtVal').value = capMap.currentBuyFreezeAmt;
				document.getElementById('currentEnableAmtVal').value = capMap.currentEnableAmt;
	      		
				//console.log('获取账户资金成功:' + data.list);
			} else {
				//获取失败, 所有选项设置成0.00
				setCapItem(0, "totalAsset");
				setCapItem(0, "currentEnableAmt");
				setCapItem(0, "positionMarketValue");
				setCapItem(0, "profitAmt");
				setCapItem(0, "currentRemainAmt");
				setCapItem(0, "precautiousLineAmt");
				setCapItem(0, "openLineAmt");
				//冻结资金 & 当前可用资金
				document.getElementById('currentBuyFreezeAmtVal').value = 0;
				document.getElementById('currentEnableAmtVal').value = 0;
				//console.log('获取账户资金失败:' + e.returnMsg);
				mui.toast('获取账户资金失败:' + e.returnMsg);
			}
			//加载标识
			document.getElementById('loadFlag').value = '0';
		}, function(e){
			//获取失败, 所有选项设置成0.00
			setCapItem(0, "totalAsset");
			setCapItem(0, "currentEnableAmt");
			setCapItem(0, "positionMarketValue");
			setCapItem(0, "profitAmt");
			setCapItem(0, "currentRemainAmt");
			setCapItem(0, "precautiousLineAmt");
			setCapItem(0, "openLineAmt");
			//冻结资金 & 当前可用资金
			document.getElementById('currentBuyFreezeAmtVal').value = 0;
			document.getElementById('currentEnableAmtVal').value = 0;
			//加载标识
			document.getElementById('loadFlag').value = '0';
		}, 3);
}


/** Ajax调用后台取数据(资金股份) eventOpe判断是上拉还是点击刷新  envThis:上拉事件 */
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
					if(eventOpe == 'updown') {
						//上拉加载，true表示没有更多数据了，
						//envThis.endPullupToRefresh(true);
						mui('#scroll1').pullRefresh().endPullupToRefresh(true);
					}
					//调用父页面持仓 刷新
					//var chicang = plus.webview.getWebviewById('chicang.html');
					//计算总资产
					//chicang.evalJS("countTotalAsset('"+0+"')");
					//清空列表中
        			return ; 
				}
				//总市值
				var marketAmtTotal = 0;
				//总盈亏
				var profitLossAmtTotal = 0;
				//循环数组
				var contentStr = '';
				for(var i = 0;i < listMaps.length; i++) {
					var stockMap = listMaps[i];
					//市值
					var marketValueVal = parseFloat(stockMap.positionMarketValue);
					marketAmtTotal = marketAmtTotal + marketValueVal;
					//盈亏
					var profitLossAmt = parseFloat(stockMap.profitLossAmt);
					profitLossAmtTotal = profitLossAmtTotal + profitLossAmt;
					//盈亏比例 =(市值-(持仓股数*成本价))/成本金额
//					var profitRateVal = countProfitRate(marketValueVal, stockMap.currentRemainNum, stockMap.costPrice);
					var profitRateVal = parseFloat(stockMap.profitLossPrecent)*100;
					//列表记录样式
					var fontStyle = '';
					if(parseFloat(profitRateVal) >= 0) {
						fontStyle = 'box-list-bg-color-up';
					} else if(parseFloat(profitRateVal) < 0) {
						fontStyle = 'box-list-bg-color-down';
					}
					
					//alert('profitRateVal:'+profitRateVal+'  setStockListItem:'+setStockListItem(profitRateVal,2));
					/* 加载模版展示持仓列表 */ 
					var showdata = {
						stockName:stockMap.stockName,
						stockCode:stockMap.stockCode,
						//市值
						marketValue:setStockListItem(marketValueVal,2),
						profitLossAmt:setStockListItem(stockMap.profitLossAmt,2),
						profitRate:setStockListItem(profitRateVal,2),
						fontStyle:fontStyle,
						currentRemainNum:setStockListItem(stockMap.currentRemainNum,0),
						currentEnableNum:setStockListItem(stockMap.currentEnableNum,0),
						costPrice:setStockListItem(stockMap.costPrice,2),
						//当前价
						currentPrice:setStockListItem(stockMap.marketValue,2)
					};
					//追加模板消息 
			        var strList = template('stock-tmp', { 
			            "showdata": showdata 
			        });
			        contentStr = contentStr + strList;
				}
				
				/**
				//调用父页面持仓 刷新
				var chicang = plus.webview.getWebviewById('chicang.html');
				//持仓总市值
				var marketVal = formatCurrency(marketAmtTotal+"");
				chicang.evalJS("document.getElementById('positionMarketValue').innerHTML ='"+marketVal+"'");
				//持仓盈亏
				var profitVal = formatCurrency(profitLossAmtTotal+"");
				chicang.evalJS("document.getElementById('profitAmt').innerHTML ='"+profitVal+"'");
				//计算总资产
				chicang.evalJS("countTotalAsset('"+marketAmtTotal+"')");
				*/
				
				//添加到列表中 , 追加记录
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
				if(eventOpe == 'updown') {
					//上拉加载，true表示没有更多数据了，
					mui('#scroll1').pullRefresh().endPullupToRefresh(false);
				}
			} else {
				//console.log('获取账户资金持仓失败:' + e.returnMsg);
			}
		}, function(e){}, 3);
}

//设置资金持仓股票
function setStockListItem(objVal, n){
	var val = fmoney(0, n);
	if(objVal != undefined && objVal != null && objVal != 'null') {
		val = fmoney(objVal, n);
	}
    return val;
}
			

//预警/平仓线 或值 切换
function switOpenLineOrVal(clickFlag) {
	if('warn_1' == clickFlag) {
		//如果点击,预警值金额,切换成预警线
		document.getElementById('precautiousLineAmt').style.display = 'none';
		document.getElementById('precautiousLine').style.display = 'block';
	} else if('warn_2' == clickFlag) {
		//如果点击,预警线,切换成预警值金额
		document.getElementById('precautiousLineAmt').style.display = 'block';
		document.getElementById('precautiousLine').style.display = 'none';
	} else if('open_1' == clickFlag) {
		//如果点击,平仓值金额,切换成平仓线
		document.getElementById('openLineAmt').style.display = 'none';
		document.getElementById('openLine').style.display = 'block';
	} else if('open_2' == clickFlag) {
		//如果点击,平仓值金额,切换成平仓值金额
		document.getElementById('openLineAmt').style.display = 'block';
		document.getElementById('openLine').style.display = 'none';
	}
}







