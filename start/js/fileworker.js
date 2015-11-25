;(function(__G__){
    if (!__G__.__M__) {
        __G__.__M__ = {};
    };
    function convertToID(path){
        return path.replace(/[^a-zA-Z0-9]/g, "");
    }
    function require(path){
        var module = __G__.__M__[convertToID(path)];
        if(!module){ console.log("error: 导出文件有问题", path); return;}
        if(module.fn && !module.exports){
            module.exports = {};
            module.fn(require, module.exports, module);
            delete module.fn;
        }
        return module.exports;
    }
    
    // file "/start/js/dev/fileworker.js" to module[startjsdevfileworkerjs]
    __G__.__M__["startjsdevfileworkerjs"] = {
        path: "/start/js/dev/fileworker.js",
        fn: function(require, exports, module, undefined) {
            
            onmessage = function(e) { 
			    readfile(e.data);
			    console.log(e);
			}
			
			function fileSize(b){
			    var map = ['b', 'K', 'M', 'G'], i = 0;
			    while((b / 1024) >= 1){
			        b /= 1024;
			        i++;
			    }
			    return b.toFixed(2) + map[i];
			}
			// Read the specified text file and 
			function readfile(f) {
			    var reader = new FileReader(),
			        loadsuccess = true;
			
			    reader.readAsText(f);
			    // reader.readAsBinaryString(f);
			
			    console.log('file:', f);
			    // reader.readAsArrayBuffer(f);
			    // reader.readAsDataURL(f);
			    reader.onload = function() {
			        var data = reader.result;
			
			        postMessage(reader.result);
			    }
			    reader.onloadstart = function(data){
			
			        console.log('开始加载文件 "' + f.name + '" progress: 0%, type:', f.type, ', size:', fileSize(data.total), data);
			    }
			    reader.onloadend = function(data){
			        loadsuccess && console.log('文件 "' + f.name + '"已加载完成', data);
			    }
			    reader.onprogress = function(data){
			        // 分段发送
			        console.log(reader.result.length);
			        console.log('正在处理文件 "' + f.name + '" progress:', parseInt(data.loaded / data.total * 100) + '%', data);
			    }
			    reader.onabort = function(e){
			        console.log('abort', e);
			    }
			    reader.onerror = function(e) {
			        loadsuccess = false;
			        console.log("error", e);
			    };
			}
            
        }
    };

        // 主文件执行
    require("/start/js/dev/fileworker.js");
    
})(this);