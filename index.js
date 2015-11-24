var path = require('path'),
    Mock = require('./lib/mock.js'),
    plugin = {},
    serverConfig;

plugin.excute = function(params){
    return false;
}

plugin.init = function(config){
    return {
        dirname: __dirname
    }
}

module.exports = plugin;