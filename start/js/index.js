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
        receiver = document.getElementById('receiver');
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
                    var worker = new Worker('js/readfileWorker.js');      // Create worker
                    worker.postMessage(file);                     // Copy and send pixels

                    // Register a handler to get the worker's response
                    worker.onmessage = function(e) {
                        receiver.innerHTML = e.data;
                        console.log(e);
                    }
                    break;
            }
        }
        sender.classList.remove('active');
        return false;
    }
};

