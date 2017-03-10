var builder = require('botbuilder');
var ctrl = require('./src/ctrl')
var restify = require('restify');
var text = require("./src/text.json");
var moment = require("moment");

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
bot.beginDialogAction('venue', '/venue', { matches: /^venue/i });
bot.beginDialogAction('afterparty', '/afterparty', { matches: /^party/i });

bot.endConversationAction('goodbye', text.bye, { matches: /^bye/i });

bot.dialog('/', function (session) {
    session.sendTyping();
    if (session.userData.firstRun === true) {
        session.send(text.hi);
    } else {
        session.send(text.back);
    }
    session.beginDialog('/menu');
});

bot.dialog('/menu', function (session) {
    ctrl.sendMenu(session, text.labels.menu);
});

bot.dialog('/presentations', function (session) {
    ctrl.sendItems(session, "presentation", text.labels.presentations);
});

bot.dialog('/workshops', function (session) {
    ctrl.sendItems(session, "workshop", text.labels.workshops);
});

bot.dialog('/now', function (session) {
    ctrl.sendItems(session, null, true, text.labels.now);
});

bot.dialog('/next', function (session) {
    ctrl.sendItems(session, null, false, text.labels.next);
});

bot.dialog('/venue', function (session) {
    ctrl.sendVenue(session, text.labels.venue);
});

bot.dialog('/afterparty', function (session) {
    ctrl.sendAfterparty(session, text.labels.afterparty);
});

bot.use({
    botbuilder: function (session, callback) {
        if (session.userData.firstRun === undefined) {
            session.userData.firstRun = true;
            session.beginDialog('/');
        } else {
            session.userData.firstRun = false;
            callback();
        }
    }
});