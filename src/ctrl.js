var builder = require('botbuilder');
var text = require("./text.json")
var program = require("./program.json")
var moment = require("moment");

exports.sendMenu = function (session) {
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
    var presentations = {
        title: "Presentations",
        subtitle: null,
        image_url: text.images.mic2,
        buttons: [{
            title: "See all",
            type: "postback",
            payload: "presentations"
        }]
    };
    elements.push(presentations);
    var workshops = {
        title: "Workshops",
        subtitle: null,
        image_url: text.images.lego,
        buttons: [{
            title: "See all",
            type: "postback",
            payload: "workshops"
        }]
    };
    elements.push(workshops);
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

exports.sendPresentations = function (session) {
    var elements = [];
    for (var i = 0; i < program.items.length; i++) {
        var item = program.items[i];
        if (item.type !== "presentation") {
            continue;
        }
        var time = moment(program.start, "YYYY-MM-DD HH:mm").format("H:mm");
        var buttons = [];        
        var text = "";
        if (item.speakers !== undefined) {
            var speakers = item.speakers.map(function (x) {
                return x.name;
            });
            text = ", " + speakers.join(" & ");
            var action_name = "Speaker";
            if (item.speakers.length > 1) {
                action_name = "Speakers";
            }
            buttons.push(builder.CardAction.imBack(session, "speaker_" + i, action_name));
        }
        if (item.description !== undefined) {
            buttons.push(builder.CardAction.imBack(session, "item_" + i, "More info"));
        }
        var element = {
            title: item.title,
            subtitle: time + text,
            image_url: item.image_url,
            buttons: buttons
        };
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

exports.sendProgram3 = function (session, k) {
    var elements = [];
    var cards = []
    for (var i = 0; i < program.length; i++) {
        var item = program[i];
        var buttons = [];
        if (item.description !== undefined) {
            var button = {
                title: 'More info',
                type: 'postback',
                payload: i + "_description"
            };
            buttons.push(button);
        }
        var speakers = "";
        if (item.speakers !== undefined) {
            var names = item.speakers.map(function (x) {
                return x.name;
            });
            speakers = names.join();
            var title = "Speaker";
            if (item.speakers.length > 1) {
                title = "Speakers";
            }
            var button = {
                title: title,
                type: 'postback',
                payload: i + "_speaker"
            };
            //buttons.push(button);
        }
        var image = null;
        if (item.image !== undefined) {
            image = item.image;
        } else if (item.speakers !== undefined && item.speakers.length === 1) {
            image = item.speakers[0].image;
        }
        var time = moment(item.start, "YYYY-MM-DD HH:mm").format('H:mm');
        var element = {
            title: item.name,
            image_url: image,
            subtitle: time + " " + speakers,
            buttons: buttons
        }
        if (j)
            elements.push(element);
    }

    var card = {
        facebook: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "list",
                    top_element_style: "compact",
                    elements: elements
                }
            }
        }
    };
    var msg = new builder.Message(session).sourceEvent(card);
    session.send(msg);
    // var attachments = [];
    // for (var i = 0; i < program.length; i++) {
    //     var item = program[i];
    //     var buttons = [];
    //     if (item.description !== undefined) {
    //         buttons.push(builder.CardAction.imBack(session, i + "_description", "More info"));
    //     }
    //     var text = "";
    //     if (item.speakers !== undefined) {
    //         var speakers = item.speakers.map(function(x) {
    //             return x.name;
    //         });
    //         text = speakers.join();
    //         var action_name = "Speaker";
    //         if (item.speakers.length > 1) {
    //             action_name = "Speakers";
    //         }
    //         buttons.push(builder.CardAction.imBack(session, i + "_speaker", action_name));
    //     }
    //     var images = [];
    //     if (item.image !== undefined) {
    //         images.push(builder.CardImage.create(session, item.image));
    //     } else if (item.speakers !== undefined) {
    //         for (var j = 0; j < item.speakers.length; j++) {
    //             images.push(builder.CardImage.create(session, item.speakers[j].image))
    //         }
    //     } else {
    //         images.push(builder.CardImage.create(session, "https://www.womentechmakers.at/img/favicons/mstile-310x310.png"));
    //     }
    //     var time = moment(item.start, "YYYY-MM-DD HH:mm").format('H:mm');
    //     var duration = moment.duration({'minutes' : item.duration});
    //     var card = new builder.HeroCard(session)
    //         .title(item.name)
    //         .subtitle(time)
    //         .text(text)
    //         .buttons(buttons)
    //         .images(images);

    //     attachments.push(card);
    // }
    // var x = attachments;
    // var reply = new builder.Message(session)
    //     .attachmentLayout(builder.AttachmentLayout.carousel)
    //     .attachments(attachments);
    // session.send(reply);
}

exports.sendProgram4 = function (session) {

}