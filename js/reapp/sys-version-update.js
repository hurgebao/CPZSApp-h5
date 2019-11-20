//系统版本地址
//T1标准环境
var sysVersionUrl = 'http://139.196.84.65:9527/t1/mapp-version/app-version.json';
//T1模拟环境
//var sysVersionUrl = 'http://139.196.84.65:9527/t1/mn-mapp-version/app-version.json';

//检查自动更新     t是你当前正在运行的APP的版本号
function verifySysVersion(t) {   
    var xhr_svn = new plus.net.XMLHttpRequest();  
    xhr_svn.onreadystatechange = function() {   
        if (xhr_svn.readyState == 4) {   
            if (xhr_svn.status == 200) {   
                var res = JSON.parse(xhr_svn.responseText); 
//              console.log('res==============='+res.autostate);
//              console.log('mark==============='+res.mark); 
                if (res.autostate == 'yes') {
                    if (res.mark != t) {
                        plus.nativeUI.confirm( "有新版本发布，是否更新？", function(e){   
                            var upr = (e.index == 0)?"Y":"N";     
                            if(upr=="Y"){   
	                            var wt = plus.nativeUI.showWaiting('更新下载中，请勿关闭'); 
//	                            console.log('wt1----'+wt);
	                            var url = res.url; // 下载文件地址   
	                            var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
//	                            	console.log('wt2----'+wt);
									//关闭下载弹出框
	                                wt.close();
	                                if (status == 200) { // 下载成功
	                                    var path = d.filename;   
	                                    //下载完成后, 安装
	                                    plus.runtime.install(path);
	                                } else {
	                                    alert("下载失败: " + status);   
	                                }
	                            });
	                            dtask.start();   
                            }else{   
                               //console.log('取消更新最新版本');      
                            }   
                        }, "交易客户端(模拟)", ["确认","取消"] );   
                           
                    } else {   
                        //console.log('最新版本');   
                    }   
                }   
            } else {   
                plus.nativeUI.toast( "网络连接错误！");   
            }   
        }   
    }   
    xhr_svn.open("GET", sysVersionUrl);//这里的地址是上面json文件的地址   
    xhr_svn.send(); 
}   




//检查自动更新     t是你当前正在运行的APP的版本号
function verifySysVersionIos(t) {   
    var xhr_svn = new plus.net.XMLHttpRequest();  
    xhr_svn.onreadystatechange = function() {   
        if (xhr_svn.readyState == 4) {   
            if (xhr_svn.status == 200) {   
                var res = JSON.parse(xhr_svn.responseText); 
                if (res.autostate == 'yes') {
                    if (res.mark != t) {
                    	//mui.alert("有新版本发布,请扫描二维码更新\n(旧版本过低会影响正常交易)");
                    	var iosurl = res.iosurl; // 下载文件地址  
                    	plus.nativeUI.confirm( "有新版本发布，是否现在升级？\n(旧版本过低会影响正常交易)", function(e){   
                            var upr = (e.index == 0)?"Y":"N";     
                            if(upr=="Y"){   
//	                            location.href = "itms-services://?action=download-manifest&url=https://gitee.com/faircy/mapp/raw/master/t1/mapp.plist";
	                            location.href = "itms-services://?action=download-manifest&url="+iosurl;
                            } 
                        }, "交易客户端(模拟)", ["确认","取消"] );   
                    }
                }   
            } else {   
                plus.nativeUI.toast( "网络连接错误！");   
            }   
        }   
    }   
    xhr_svn.open("GET", sysVersionUrl);//这里的地址是上面json文件的地址   
    xhr_svn.send(); 
}   
