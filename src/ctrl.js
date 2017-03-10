var builder = require('botbuilder');
var text = require("./text.json")
var program = require("./program.json")
var moment = require("moment");

module.exports = {
    sendMenu: sendMenu,
    sendItems: sendItems
}

function sendMenu(session) {
    var start = moment(program.start, "YYYY-MM-DD HH:mm");
    var end = moment(program.end, "YYYY-MM-DD HH:mm");
    var now = moment();
    var elements = [];
    if (now.isBefore(start)) {
        var registration = {
            title: "Registration and Coffee",
            subtitle: "9:00, TU Wien, Gusshausstrasse 25-27, 1040 Vienna",
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
    elements.push(programItems);
    //if (now.isAfter(start) && now.isBefore(end)) {
    var running = {
        title: "What's running now?",
        subtitle: null,
        image_url: text.images.clock,
        buttons: [{
            title: "Show",
            type: "postback",
            payload: "next"
        }]
    };
    elements.push(running);
    var next = {
        title: "What's next?",
        subtitle: null,
        image_url: text.images.mech,
        buttons: [{
            title: "Show",
            type: "postback",
            payload: "now"
        }]
    };
    elements.push(next);
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
            subtitle: "18:15, Lanea, Rilkeplatz 3, 1040 Vienna",
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
}

function sendItems(session, type) {
    var elements = [];
    for (var i = 0; i < program.items.length; i++) {
        if (program.items[i].type !== type) {
            continue;
        }
        var element = getElement(program.items[i], i);
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
}

function getElement(item, i) {
    var time = moment(program.start, "YYYY-MM-DD HH:mm").format("H:mm");
    var buttons = [];
    var text = "";
    if (item.speakers !== undefined) {
        var speakers = item.speakers.map(function (x) {
            return x.name;
        });
        text = ", " + speakers.join(" & ");
        var button = {
            title: "Speakers",
            type: "postback",
            payload: "speaker_" + i
        }
        buttons.push(button);
    }
    if (item.description !== undefined) {
        var button = {
            title: "More info",
            type: "postback",
            payload: "descrition_" + i
        }
        buttons.push(button);
    }
    var element = {
        title: item.title,
        subtitle: time + text,
        image_url: item.image_url,
        buttons: buttons
    };
    return element;
}