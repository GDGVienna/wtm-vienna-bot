var builder = require('botbuilder');
var ctrl = require('./internal/ctrl')
var moment = require('moment');
var restify = require('restify');
var text = require("./internal/text.json");
var utils = require('./internal/utils')

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector, { persistConversationData: true });
server.post('/api/messages', connector.listen());

bot.dialog('/', function (session) {
    var msg = "hi";
    session.send(msg);    
});