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
bot.beginDialogAction('presentations', '/presentations', { matches: /^presentations/i });
bot.beginDialogAction('workshops', '/workshops', { matches: /^workshops/i });
bot.beginDialogAction('menu', '/menu', { matches: /^menu/i });
bot.beginDialogAction('now', '/now', { matches: /^now/i });
bot.beginDialogAction('next', '/next', { matches: /^next/i });
bot.beginDialogAction('description', '/description', { matches: /^description/i });

bot.dialog('/', function (session) {
    session.send(text.hi);
    session.sendTyping();
    session.beginDialog('/menu');
});

bot.dialog('/menu', function (session) {
    session.sendTyping();
    ctrl.sendMenu(session);
});

bot.dialog('/presentations', function (session) {
    session.sendTyping();
    ctrl.sendItems(session, "presentation");
});

bot.dialog('/workshops', function (session) {
    session.sendTyping();
    ctrl.sendItems(session, "workshop");
});

bot.dialog('/now', function (session) {
    session.sendTyping();
    ctrl.sendItems(session, null, true);
});

bot.dialog('/next', function (session) {
    session.sendTyping();
    ctrl.sendItems(session, null, false);
});

bot.dialog('/description', function (session) {
    session.sendTyping();
    ctrl.sendDescription(session);
});