var builder = require('botbuilder');
var text = require("./text.json")
var program = require("./program.json")
var moment = require("moment");

module.exports = {
    sendMenu: sendMenu,
    sendItems: sendItems,
    sendMenu: sendMenu,
    sendAfterparty: sendAfterparty,
    sendVenue: sendVenue
}

function sendMenu(session, label) {
    session.sendTyping();
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
        subtitle: "Check our program",
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
    var schedule = {
        title: "Schedule",
        subtitle: "Full schedule on WTM site",
        image_url: text.images.clock,
        buttons: [{
            title: "Schedule",
            type: "web_url",
            url: text.links.schedule,
            webview_height_ratio: "compact"
        }]
    };
    elements.push(schedule);
    var team = {
        title: "Team",
        subtitle: "Meet our team",
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
    elements.push(team);
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
    session.send(label);
    var msg = new builder.Message(session).sourceEvent(card);
    session.send(msg);
    sendQuickReplies(session, null, false);
}

function sendVenue(session, label) {
    session.sendTyping();
    var element = {
        title: "TU Vienna, New Electrotechnical Institute building",
        subtitle: "Gusshausstrasse 25-27, 1040 Vienna",
        image_url: text.images.event,
        buttons: [{
            title: "Map",
            type: "web_url",
            url: text.maps.event,
            webview_height_ratio: "compact"
        }]
    };
    var card = {
        facebook: {
            attachment: {
                type: "template",
                image_aspect_ratio: "square",
                payload: {
                    template_type: "generic",
                    elements: [element]
                }
            }
        }
    };
    session.send(label);
    var msg = new builder.Message(session).sourceEvent(card);
    session.send(msg);
    sendQuickReplies(session, null, false);
}

function sendAfterparty(session, label) {
    session.sendTyping();
    var element = {
        title: "Lanea",
        subtitle: "18:15, Rilkeplatz 3, 1040 Vienna",
        image_url: text.images.afterparty,
        buttons: [{
            type: "web_url",
            url: text.maps.afterparty,
            title: "Map",
            webview_height_ratio: "compact"
        }]
    };
    var card = {
        facebook: {
            attachment: {
                type: "template",
                image_aspect_ratio: "square",
                payload: {
                    template_type: "generic",
                    elements: [element]
                }
            }
        }
    };
    session.send(label);
    var msg = new builder.Message(session).sourceEvent(card);
    session.send(msg);
    sendQuickReplies(session, null, false);
}

function sendItems(session, type, running, label) {
    session.sendTyping();
    var elements = [];
    var start = moment(program.start, "YYYY-MM-DD HH:mm");
    var now = moment();
    var items = [];
    if (type !== null) {
        for (var i = 0; i < program.items.length; i++) {
            var item = program.items[i];
            if (program.items[i].type.indexOf(type) !== -1) {
                items.push(item);
            }
        }
    } else if (running === true) {
        for (var i = 0; i < program.items.length; i++) {
            var item = program.items[i];
            var itemStart = moment(item.start, "YYYY-MM-DD HH:mm");
            var itemEnd = moment(item.end, "YYYY-MM-DD HH:mm");
            if (now > itemStart && now < itemEnd) {
                items.push(item);
            }
        }
    } else if (running === false) {
        items = getNextItems();
    }
    var info = null;
    if (items.length > 0) {
        for (var i = 0; i < items.length; i++) {
            var element = getElement(items[i], i);
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
        session.send(label);
        var msg = new builder.Message(session).sourceEvent(card);
        session.send(msg);
    } else {
        if (running === false) {
            info = text.info.eventEnded;
        } else if (running === true) {
            info = text.info.noRunning;
        }
    }
    sendQuickReplies(session, info, true);
}

function getElement(item, i) {
    var time = moment(item.start, "YYYY-MM-DD HH:mm").format("H:mm");
    var subtitle = "";
    if (item.subtitle !== undefined) {
        subtitle = ", " + item.subtitle;
    }
    if (item.speakers !== undefined) {
        var items = item.speakers.map(function (x) {
            return x.name;
        });
        subtitle = ", " + items.join(" & ");
    }
    var buttons = null;
    if (item.map_url !== undefined) {
        buttons = [{
            type: "web_url",
            url: item.maps_url,
            title: "Map",
            webview_height_ratio: "compact"
        }];
    }    
    var element = {
        title: item.title,
        subtitle: time + subtitle,
        image_url: item.image_url,
        buttons: buttons
    };
    return element;
}

function sendQuickReplies(session, info, back) {
    var start = moment(program.start, "YYYY-MM-DD HH:mm");
    var end = moment(program.end, "YYYY-MM-DD HH:mm");
    var now = moment();
    var replies = [];
    if (now.isAfter(start) && now.isBefore(end)) {
        var running = {
            title: text.replies.now,
            content_type: "text",
            payload: "now"
        };
        replies.push(running);
    }
    if (now.isBefore(end)) {
        var next = {
            title: text.replies.next,
            content_type: "text",
            payload: "next"
        };
        replies.push(next);
    }
    if (back === true) {
        var menu = {
            title: text.replies.menu,
            content_type: "text",
            payload: "menu"
        };
        replies.push(menu);
    }
    var bye = {
        title: text.replies.bye,
        content_type: "text",
        payload: "bye"
    };
    replies.push(bye);
    if (info === null) {
        info = text.ask;
    }
    var card = {
        facebook: {
            text: info,
            quick_replies: replies
        }
    };
    var msg = new builder.Message(session).sourceEvent(card);
    session.send(msg);
}

function getNextItems() {
    var now = moment();
    var type = "";
    var nextItems = [];
    var nextBreak;
    var nextStart = moment(program.end, "YYYY-MM-DD HH:mm");
    var breakStart;
    for (var i = 0; i < program.items.length; i++) {
        var item = program.items[i];
        var itemStart = moment(item.start, "YYYY-MM-DD HH:mm");
        if (item.type !== type && itemStart > now) {
            if (itemStart.isBefore(nextStart)) {
                nextStart = itemStart;
            }
            type = item.type;
            if (type === "break") {
                breakStart = itemStart;
                nextBreak = item;
            } else {
                nextItems.push(item);
            }            
        }
    }
    if (nextBreak !== undefined && nextStart.isSame(breakStart)) {
        return [nextBreak];
    } else {
        return nextItems;
    }
}