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
            module.fn(require, module.exports, module, window);
            delete module.fn;
        }
        return module.exports;
    }
    
    // file "/start/js/dev/callback.js" to module[startjsdevcallbackjs]
    __G__.__M__["startjsdevcallbackjs"] = {
        path: "/start/js/dev/callback.js",
        fn: function(require, exports, module, window, undefined) {
            
            /**
			 * Callbacks 
			 * author: shalles
			 * email:shalles@163.com
			 * create time: 2015.01.02
			 * refer to jquery callbacks
			 */
			
			function validateFn(fn){
			    return typeof fn === 'function';
			}
			
			function Callbacks(options) {
			    this.list = []
			}
			
			Callbacks.prototype = {
			
			    // Add a callback or a collection of callbacks to the list
			    add: function (fn) {
			        if(validateFn(fn)){
			            this.list.push(fn);
			        }else if(Object.prototype.toString.call(fn) === "[object Array]"){
			            for(var i = 0, len = fn.length; i < len; i++){
			                 arguments.callee.call(this, fn[i]);   
			            }
			        }
			
			        return this;
			    },
			
			    // Remove a callback from the list
			    remove: function (fn) {
			        var list = this.list,
			            idx;
			        if(validateFn(fn)){
			            idx = list.indexOf(fn);
			            list.splice(idx, 1);
			        }
			        
			        return this;
			    },
			
			    // Check if a given callback is in the list.
			    has: function (fn) {
			        return validateFn(fn) && (this.list.indexOf(fn) > -1);
			    },
			
			    // Remove all callbacks from the list
			    empty: function () {
			        if (this.list) {
			            this.list = [];
			        }
			        return this;
			    },
			
			    // Call all callbacks with the given context and arguments
			    fireWith: function (context, args) {
			        var list = this.list;
			        for(var i = 0, len; i < list.length; i++){
			            list[i].apply(context, args.slice ? args.slice() : args);
			        }
			        
			        return this;
			    },
			
			    // Call all the callbacks with the given arguments
			    fire: function () {
			        this.fireWith(this, arguments);
			        return this;
			    }
			};
			
			module.exports = Callbacks;
            
        }
    };

    // file "/start/js/dev/ws.js" to module[startjsdevwsjs]
    __G__.__M__["startjsdevwsjs"] = {
        path: "/start/js/dev/ws.js",
        fn: function(require, exports, module, window, undefined) {
            
            var Callback = require("/start/js/dev/callback.js");
			
			var wsLinkStr = __ST.wsLinkStr || 'ws://127.0.0.1',
			    websocket = new WebSocket(wsLinkStr),
			    WS = {
			        receiver: function(){},
			        sender: websocket.send
			    };
			
			websocket.onopen = function(evt) {
			    console.log('[transport start success]');
			};
			websocket.onclose = function(evt) {
			    console.log('[transport closed please check the server or refresh this page]');
			};
			websocket.onmessage = function(evt) {
			    WS.receiver(evt.data, evt);
			};
			websocket.onerror = function(evt) {
			    console.log('[transport closed please check the server or refresh this page]');
			};
			
			module.exports = WS;
            
        }
    };

    // file "/start/js/dev/index.js" to module[startjsdevindexjs]
    __G__.__M__["startjsdevindexjs"] = {
        path: "/start/js/dev/index.js",
        fn: function(require, exports, module, window, undefined) {
            
            var WS = require("/start/js/dev/ws.js");
			
			// At the time of this writing, Firefox and Webkit disagree on the 
			// name of the createObjectURL() function
			var getBlobURL = (window.URL && URL.createObjectURL.bind(URL)) ||
			    (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) ||
			    window.createObjectURL;
			var revokeBlobURL = (window.URL && URL.revokeObjectURL.bind(URL)) ||
			    (window.webkitURL && webkitURL.revokeObjectURL.bind(webkitURL)) || window.revokeObjectURL;
			// When the document is loaded, add event handlers to the sender element 
			// so that it can handle drops of files
			window.onload = function() {
			    // Find the element we want to add handlers to.
			    var sender = document.getElementById('sender'),
			        receiver = document.getElementById('receiver'),
			        senderSelector = document.getElementById('senderSelector'),
			        selectTxt = sender.getElementsByClassName('file-name')[0];
			    // When the user starts dragging files over the sender, highlight it. 
			    sender.ondragenter = function(e) {
			        // If the drag is something other than files, ignore it.
			        // The HTML5 dropzone attribute will simplify this when implemented. 
			        var types = e.dataTransfer.types;
			        if (!types ||
			            (types.contains && types.contains('Files')) ||
			            (types.indexOf && types.indexOf('Files') != -1)) {
			            sender.classList.add('active'); // Highlight sender
			            return false; // We're interested in the drag
			        }
			    };
			    // Unhighlight the drop zone if the user moves out of it 
			    sender.ondragleave = function() {
			        sender.classList.remove('active');
			    };
			    // This handler just tells the browser to keep sending notifications 
			    sender.ondragover = function(e) {
			        return false;
			    };
			    // When the user drops files on us, get their URLs and display thumbnails. 
			    sender.ondrop = function(e) {
			        var files = e.dataTransfer.files;
			        fileHandler(files);
			        sender.classList.remove('active');
			        return false;
			    }
			
			    function fileHandler(files){
			        for (var i = 0; i < files.length; i++) {
			            var file = files[i],
			                type = file.type.split('/')[0],
			                filePath = getBlobURL(file),
			                self = this;
			            switch(type){
			                case 'image':
			                    var img = document.createElement('img');
			                    img.src = filePath;
			                    img.onload = function() {
			                        self.width = img.width;
			                        self.height = img.height;
			                        document.body.appendChild(img);
			                        revokeBlobURL(filePath);
			                    }
			                default:
			                    // readfile(file);
			                    var worker = new Worker('js/fileworker.js');      // Create worker
			                    worker.postMessage(file);                     // Copy and send pixels
			
			                    // Register a handler to get the worker's response
			                    worker.onmessage = function(e) {
			                        WS.sender(e.data);
			                        console.log(e);
			                    }
			                    break;
			            }
			        }
			    }
			
			    WS.receiver = function(data){
			        receiver.innerHTML = data;
			    }
			
			    senderSelector.onchange = function(){
			        var files = this.files, len = files.length, i = 0;
			        if(len > 0){
			            var txt = '已选中';
			            while(i < len){
			                txt += files[i].name + ' ';
			                i++;
			            }
			            txt += (len > 1 ? '... ' : '') + this.files.length + '个文件';
			            selectTxt.innerHTML = txt;
			        }
			        fileHandler(files);
			    }
			};
			
			
            
        }
    };

        // 主文件执行
    require("/start/js/dev/index.js");
    
})(this);