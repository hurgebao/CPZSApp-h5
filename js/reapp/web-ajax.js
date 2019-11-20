	/** Web服务端(后台)请求地址 */
	//开发环境
	var appWebUrl = 'http://47.92.141.61:8080/stocktrade-gateway-facade/';
	//生产云服务(T1)
//	var appWebUrl = 'https://106.15.233.120/stocktrade-gateway-facade/';
	//模拟系统(T1)
//	var appWebUrl = 'https://118.244.199.86/stocktrade-gateway-facade/';
	
	
	
	/* 检索所有股票 地址   http://47.92.141.61:8083/stockIndex/000 */
	//开发环境
//	var stockListUrl = 'http://47.92.141.61:8083/stockIndex/';
	//生产环境
	var stockListUrl = 'http://47.95.204.52:8083/stockIndex/';
	
	
	
	/** 行情源地址 sh600482  */
	//生产云服务
	var sourceUrl = 'https://106.15.233.120/stocktrade-gateway-facade/market/list';
	
	/** 默认Level2行情源地址(未取出行情时备用) */
	var sourceUrlLevel2 = 'http://47.95.4.227:8080/l2/list=';

	/** ******** mui的ajax进一步的封装, 对超时进行了自动重试 Start ******** */
	//重写mui.ajax POST请求, 函数('url', 传参, 调用成功函数, 调用失败函数, 重试次数)
	mui.web_query_post = function(funcUrlName, params, onSuccess, onError, retry){
		/* 验证是否已退出(用户失效) */
		var token = UserInfo.token();  
		if(!token && 'system/login' != funcUrlName) { //token是否存在
			//token 为空, 返回登录页面
			/** 跳转到登录页面 */
			skipToLoginPage();
			return ;
		} else {
			//加载说明
		    var onSuccess = arguments[2]?arguments[2]:function(){}; //调用成功函数
		    var onError = arguments[3]?arguments[3]:function(){}; //调用失败函数
		    var retry = arguments[4]?arguments[4]:3; //重试次数
		    func_url = appWebUrl + funcUrlName; //请求地址
		    //console.log('func_url:'+func_url);
		  	//console.log(funcUrlName+'请求时间:'+getNowFormatDateFmd());
//		    console.log('params:'+JSON.stringify(params));
		    mui.ajax(func_url, {
		        data: params,
		        headers:{'Content-Type':'application/json','token':token},
		        dataType:'json',
		        type:'post',
		        timeout:12000,
		        //async:false,
		        crossDomain:true, //ajax跨域请(ios系统必须这样用，否则https无法正确通信)
		        success:function(data){
		        	//console.log(funcUrlName+'请求响应数据:'+JSON.stringify(data));
		        	//请求成功
		        	if(data.returnCode === 11008) {
		        		//清除本地登录缓存
						UserInfo.clear();
						
						//跳转到登录页面
						var loginPage = plus.webview.getWebviewById('login.html');
						if(loginPage != null) {
							loginPage.close();
						}
						loginPage = plus.webview.create('/pages/biz/login.html', 'login.html');
						loginPage.show();
						
    					mui.toast('交易界面登录超时,请重新登录')
		        	} else {
		        		//请求成功
		        		onSuccess(data);
		        	}
		        },
		        error:function(xhr, type, errorThrown){
		        	//console.log(funcUrlName+'请求超时:'+getNowFormatDateFmd());
		        	//alert('error:'+retry+'  xhr-status:'+xhr.status+' '+xhr.statusText+'  type:'+type+'  errorThrown:'+errorThrown);
		            retry--;
		            if(retry > 0) {
		              return mui.web_query_post(funcUrlName, params, onSuccess, onError, retry);
		            }
		            mui.toast('网络异常');
		            var errorMsg = '[网络异常   xhr-status:'+xhr.status+' '+xhr.statusText+'  type:'+type+'  errorThrown:'+errorThrown+']';
		            onError(errorMsg);
		        }
		    })
		}
		
	};   
	
	
	//重写mui.ajax GET请求, 函数('url', 传参, 调用成功函数, 调用失败函数, 重试次数)
	mui.web_query_get = function(funcUrlName, onSuccess, onError, retry){
		/* 验证是否已退出(用户失效) */
		var token = UserInfo.token(); 
		if(!token && 'system/login' != funcUrlName) { //token是否存在
			//token 为空, 返回登录页面
			/** 跳转到登录页面 */
			skipToLoginPage();
			return ; 
		} else {
		    var onSuccess = arguments[1]?arguments[1]:function(){}; //调用成功函数
		    var onError = arguments[2]?arguments[2]:function(){}; //调用失败函数
		    var retry = arguments[3]?arguments[3]:3; //重试次数
		    func_url = appWebUrl + funcUrlName; //请求地址
		    mui.ajax(func_url, {
		        headers:{'Content-Type':'application/json','token':token},
		        dataType:'json',
		        type:'get',
		        timeout:5000,
		        crossDomain:true, //ajax跨域请(ios系统必须这样用，否则https无法正确通信)
		        success:function(data){
		        	//请求成功
		        	//console.log(funcUrlName+'请求响应数据:'+JSON.stringify(data));
		        	onSuccess(data);
		        },
		        error:function(xhr, type, errorThrown){
		            retry--;
		            if(retry > 0) {
		              return mui.web_query_get(funcUrlName, onSuccess, onError, retry);
		            }
		            mui.toast('网络异常');
		            onError('FAILED_NETWORK');
		        }
		    })
		}
	};   
	
	/** ******** mui的ajax进一步的封装, 对超时进行了自动重试 End ******** */


	/** 验证用户是否已登录 */
	function skipToLoginPage() {
		/** 跳转到登录页面 */
		var loginPage = plus.webview.getWebviewById('login.html');
		if(loginPage != null) {
			loginPage.close();
		}
		loginPage = plus.webview.create('login.html', 'login.html');
		loginPage.show();
	}



	