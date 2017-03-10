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
    sendQuickReplies(session, null, false);
}

function sendItems(session, type, running) {
    var elements = [];
    var start = moment(program.start, "YYYY-MM-DD HH:mm");
    var now = moment();
    var day = "";
    if (now.startOf('day') < start.startOf('day')) {
        day = start.format("D.MM") + " ";
    }
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
    var error = null;
    if (items.length > 0) {
        for (var i = 0; i < items.length; i++) {
            var element = getElement(items[i], i, day);
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
    } else {
        if (running === false) {
            error = text.errors.next;
        } else if (running === true) {
            error = text.errors.now;
        }
    }
    sendQuickReplies(session, error, true);
}

function getElement(item, i, day) {
    var time = moment(program.start, "YYYY-MM-DD HH:mm").format("H:mm");
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
    var element = {
        title: item.title,
        subtitle: day + time + subtitle,
        image_url: item.image_url,
        buttons: null
    };
    return element;
}

function sendQuickReplies(session, error, back) {
    var start = moment(program.start, "YYYY-MM-DD HH:mm");
    var end = moment(program.end, "YYYY-MM-DD HH:mm");
    var now = moment();
    var replies = [];
    if (now.isAfter(start) && now.isBefore(end)) {
        var running = {
            title: "What's up now?",
            content_type: "text",
            payload: "now"
        };
        replies.push(running);
    }
    if (now.isBefore(end)) {
        var next = {
            title: "What's next?",
            content_type: "text",
            payload: "next"
        };
        replies.push(next);
    }
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
    if (error === null) {
        error = text.ask;
    }
    var card = {
        facebook: {
            text: error,
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