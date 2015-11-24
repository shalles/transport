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
    var wsPath = path.join(__dirname, 'start/js/ws.js'),
        content = utils.readFile(wsPath),
        origin = serverConfig.hostname + ":" + serverConfig.port + '?appname=transport';

    content = utils.simpleTemplate(content, origin);
    fs.writeFileSync(wsPath, content);

    return {
        dirname: __dirname
    };
};

module.exports = plugin;