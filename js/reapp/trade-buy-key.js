
//Mui页面加载
mui.plusReady(function(){
	/** 自定义键盘, 设置值  Start */
	//切换数字或字母键盘
	mui('.key-item-swit').on('tap', 'button', function(){
		//键盘类型: num数字键盘  title字母键盘
		var keyType = document.getElementById('keyType').value;
		if(keyType == 'num') {
			document.getElementById('keyType').value = 'title';
			//显示字母键盘
			var keyTitle = document.getElementById('keyTitle');
			keyTitle.style.display = "block";
			//隐藏数字键盘
			var keyNum = document.getElementById('keyNum');
			keyNum.style.display = "none";
			mui('#switBtn')[0].innerHTML = '切换123';
			//隐藏数字0
			var keyBtn0 = document.getElementsByClassName('key-btn-0')[0];
			keyBtn0.style.display = "none";
			//更改按钮列表25%
			var keyBtnItems = document.getElementsByClassName('key-btn-item');
			for (i = 0; i < keyBtnItems.length; i++) {
			    keyBtnItems[i].style.cssText = 'width:25%';
			}
			
		} else {
			document.getElementById('keyType').value = 'num';
			//隐藏字母键盘
			var keyTitle = document.getElementById('keyTitle');
			keyTitle.style.display = "none";
			//显示数字键盘
			var keyNum = document.getElementById('keyNum');
			keyNum.style.display = "block";
			mui('#switBtn')[0].innerHTML = '切换abc';
			//显示数字0
			var keyBtn0 = document.getElementsByClassName('key-btn-0')[0];
			keyBtn0.style.display = "block";
			//更改按钮列表20%
			var keyBtnItems = document.getElementsByClassName('key-btn-item');
			for (i = 0; i < keyBtnItems.length; i++) {
			    keyBtnItems[i].style.cssText = 'width:20%';
			}
			
		}
	});
	//点击快捷键, 如600
	mui('.key-item-q').on('tap', 'button', function(){
		var tradeBuy = plus.webview.getWebviewById('trade.html');
		tradeBuy.evalJS("setKeyItemQ('"+this.innerHTML+"')");
	});
	//点击单个字母或数字键
	mui('.key-item-set').on('tap', 'button', function(){
		var tradeBuy = plus.webview.getWebviewById('trade.html');
		tradeBuy.evalJS("setKeyItemSet('"+this.innerHTML+"')");
	});
	//点击清空按钮
	mui('.key-item-clear').on('tap', 'button', function(){
		var tradeBuy = plus.webview.getWebviewById('trade.html');
		tradeBuy.evalJS("setKeyItemClear()");
	});
	//点击退格按钮
	mui('.key-item-back').on('tap', 'button', function(){
		var tradeBuy = plus.webview.getWebviewById('trade.html');
		tradeBuy.evalJS("setKeyItemBack()");
	});
	//点击关闭按钮
	mui('.key-item-close').on('tap', 'button', function(){
		//隐藏键盘
		var key = document.getElementById('key');
		key.style.display = "none";
		//显示行情图
		var marketGif = document.getElementById('marketGif');
		marketGif.style.display = "block";
	});
	/** 自定义键盘, 设置值  End */
	
});

/** 打开键盘窗口 */
function openKeyWindow(){
//	console.log('打开键盘窗口...');
	//显示键盘
	var key = document.getElementById('key');
	key.style.display = "block";
	//隐藏行情图
	var marketGif = document.getElementById('marketGif');
	marketGif.style.display = "none";
}

/** 关闭键盘窗口 */
function closeKeyWindow(){
//	console.log('关闭键盘窗口...');
	//隐藏键盘
	var key = document.getElementById('key');
	key.style.display = "none";
	//显示行情图
	var marketGif = document.getElementById('marketGif');
	marketGif.style.display = "block";
}


//设置股票代码
function setSubStockCode(stockCode, stockName) {
	mui('#stockCode')[0].value = stockCode;
	mui('#stockNameHid')[0].value = stockName;
	/* 下方行情图  */
	marketGif('min', '分时图');
}

