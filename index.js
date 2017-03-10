var builder = require('botbuilder');
var ctrl = require('./src/ctrl')
var restify = require('restify');
var text = require("./src/text.json");

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

bot.beginDialogAction('hi', '/', { matches: /^\bhi\b|\bhello\b|\bhey\b|\bhallo\b/i });
bot.beginDialogAction('pres', '/presentations', { matches: /^\bpresentations\b/i });
bot.beginDialogAction('work', '/workshops', { matches: /^\bworkshops\b/i });

bot.dialog('/', function (session) {
    var msg = "hi";
    session.send(msg);
    session.sendTyping();
    session.beginDialog('/menu');
});

bot.dialog('/menu', function (session) {
    session.sendTyping();
    ctrl.sendMenu(session);
    session.endDialog();
});

bot.dialog('/presentations', function (session) {
    session.sendTyping();
    ctrl.sendItems(session, "presentation");
    session.endDialog();
});

bot.dialog('/workshops', function (session) {
    session.sendTyping();
    ctrl.sendItems(session, "workshop");
    session.endDialog();
});