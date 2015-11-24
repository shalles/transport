var fs = require('fs'),
    path = require('path'),
    plugin = {},
    utils,
    serverConfig;

plugin.excute = function(params){
    return false;
};

plugin.init = function(config){
    utils = config.__utils;
    serverConfig = config.__serverConfig;
    var varjs = path.join(__dirname, 'start/js/var.js'),
        origin = 'ws://' + serverConfig.hostname + ":" + serverConfig.port + '?appname=transport',
        content = {
            wsLinkStr: origin 
        };

    content = 'window.__ST=' + JSON.stringify(content);
    fs.writeFileSync(varjs, content);

    return {
        dirname: __dirname
    };
};

module.exports = plugin;