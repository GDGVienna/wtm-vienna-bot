var builder = require('botbuilder');
var text = require("./text.json")
var program = require("./program.json")
var moment = require("moment");

module.exports = {
    sendMenu: sendMenu,
    sendItems: sendItems,
    sendDescription: sendDescription
}


function sendMenu(session) {
    var start = moment(program.start, "YYYY-MM-DD HH:mm");
    var end = moment(program.end, "YYYY-MM-DD HH:mm");
    var now = moment();
    var elements = [];
    var day = "";
    if (now.startOf('day') < start.startOf('day')) {
        day = start.format("D.MM") + ", ";
    }
    if (now.isBefore(start)) {
        var registration = {
            title: "Registration and Coffee",
            subtitle: day + "9:00, TU Wien, Gusshausstrasse 25-27, 1040 Vienna",
            image_url: text.images.event,
            buttons: [{
                title: "Map",
                type: "web_url",
                url: text.maps.event,
                webview_height_ratio: "compact"
            }]
        };
        elements.push(registration);
    }
    var programItems = {
        title: "Program",
        subtitle: null,
        image_url: text.images.wtm,
        buttons: [{
            title: "Presentations",
            type: "postback",
            payload: "presentations"
        }, {
            title: "Workshops",
            type: "postback",
            payload: "workshops"
        }]
    };
    var programItems = {
        title: "Team",
        subtitle: null,
        image_url: text.images.memo1,
        buttons: [{
            title: "Organizers",
            type: "web_url",
            url: text.links.organizers,
            webview_height_ratio: "compact"
        }, {
            title: "Speakers",
            type: "web_url",
            url: text.links.speakers,
            webview_height_ratio: "compact"
        }]
    };
    elements.push(programItems);
    //if (now.isAfter(start) && now.isBefore(end)) {
    //var running = {
    //    title: "What's running now?",
    //    subtitle: null,
    //    image_url: text.images.clock,
    //    buttons: [{
    //        title: "Show",
    //        type: "postback",
    //        payload: "next"
    //    }]
    //};
    //elements.push(running);
    //var next = {
    //    title: "What's next?",
    //    subtitle: null,
    //    image_url: text.images.mech,
    //    buttons: [{
    //        title: "Show",
    //        type: "postback",
    //        payload: "now"
    //    }]
    //};
    //elements.push(next);
    //}
    if (now.isAfter(start) && now.isBefore(end)) {
        var venue = {
            title: "Venue",
            subtitle: "TU Wien, Gusshausstrasse 25-27, 1040 Vienna",
            image_url: text.images.event,
            buttons: [{
                title: "Map",
                type: "web_url",
                url: text.maps.event,
                webview_height_ratio: "compact"
            }]
        };
        elements.push(venue);
    }
    if (!now.startOf('day').isAfter(start.startOf('day'))) {
        var afterparty = {
            title: "Awesome Afterparty!",
            subtitle: day + "18:15, Lanea, Rilkeplatz 3, 1040 Vienna",
            image_url: text.images.afterparty,
            buttons: [{
                type: "web_url",
                url: text.maps.afterparty,
                title: "Map",
                webview_height_ratio: "compact"
            }]
        };
        elements.push(afterparty);
    }
    var card = {
        facebook: {
            attachment: {
                type: "template",
                image_aspect_ratio: "square",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
    };
    var msg = new builder.Message(session).sourceEvent(card);
    session.send(msg);
    sendQuickReplies(session, false);
}

function sendItems(session, type) {
    var elements = [];
    var start = moment(program.start, "YYYY-MM-DD HH:mm");
    var now = moment();
    var day = "";
    if (now.startOf('day') < start.startOf('day')) {
        day = start.format("D.MM") + ", ";
    }
    for (var i = 0; i < program.items.length; i++) {
        if (program.items[i].type !== type) {
            continue;
        }
        var element = getElement(program.items[i], i, day);
        elements.push(element);
    }
    var card = {
        facebook: {
            attachment: {
                type: "template",
                image_aspect_ratio: "square",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
    };
    var msg = new builder.Message(session).sourceEvent(card);
    session.send(msg);
    sendQuickReplies(session, true);
}

function getElement(item, i, day) {
    var time = moment(program.start, "YYYY-MM-DD HH:mm").format("H:mm");
    var buttons = [];
    var text = "";
    if (item.speakers !== undefined) {
        var speakers = item.speakers.map(function (x) {
            return x.name;
        });
        text = ", " + speakers.join(" & ");        
    }
    if (item.description !== undefined) {
        var button = {
            title: "Description",
            type: "postback",
            payload: "descrition_" + i
        }
        buttons.push(button);
    }
    if (buttons.length === 0) {
        buttons = null;
    }
    var element = {
        title: item.title,
        subtitle: day + time + text,
        image_url: item.image_url,
        buttons: buttons
    };
    return element;
}

function sendDescription(session) {
    var idx = session.message.text.split("_")[1];
    var item = program.items[idx];
    var text = item.title.toUpperCase() + "\n\n" + item.description;
    session.send(text);
    sendQuickReplies(session, true);
}

function sendQuickReplies(session, back) {
    var start = moment(program.start, "YYYY-MM-DD HH:mm");
    var end = moment(program.end, "YYYY-MM-DD HH:mm");
    var now = moment();
    var replies = [];
    //if (now.isAfter(start) && now.isBefore(end)) {
        var running = {
            title: "Show",
            content_type: "text",
            payload: "now"
        };
        replies.push(running);
        var next = {
            title: "Show",
            content_type: "text",
            payload: "next"
        };        
        replies.push(next);
    //}
    if (back === true) {
        var menu = {
            title: "Back to menu",
            content_type: "text",
            payload: "menu"
        };
        replies.push(menu);
    }
    if (replies.length === 0) {
        return;
    }
    var card = {
        facebook: {
            text: "What do you want to do next?",
            quick_replies: replies
        }
    };
    var msg = new builder.Message(session).sourceEvent(card);
    session.send(msg);
}