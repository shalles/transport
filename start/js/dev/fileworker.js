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