var builder = require('botbuilder');
var db = require("./db");
var utils = require("./utils.js")
var text = require("./text.json")
var menu = require("./menu.json")
var program = require("./program.json")
var moment = require("moment");

exports.sendMenu = function (session) {
    var start = moment(program.start, "YYYY-MM-DD HH:mm");
    var end = moment(program.end, "YYYY-MM-DD HH:mm");
    var now = moment();
    var elements = [];
    if (now.isBefore(end)) {
        var registration = {
            title: "Registration",
            subtitle: "9:00",
            image_url: "http://womentechmakers.at/img/sections-background/schedule.jpg",
            buttons: [{
                title: "Show",
                type: "postback",
                payload: "presentations"
            }]
            //buttons: [{
            //    title: "Location",
            //    type: "web_url",
            //    url: "http://goo.gl/maps/e8pWhaSCWe12",
            //    webview_height_ratio: "full",
            //    messenger_extensions: true
            //}]
        };
        elements.push(registration);
    }
    var presentations = {
        title: "Presentations",
        subtitle: "See all presentations",
        image_url: "http://womentechmakers.at/img/posts/call.jpg",
        buttons: [{
            title: "Show",
            type: "postback",
            payload: "presentations"
        }]
    };
    elements.push(presentations);
    var workshops = {
        title: "Workshops",
        subtitle: "See all workshops",
        image_url: "http://womentechmakers.at/img/about-section/workshop.jpg",
        buttons: [{
            title: "Show",
            type: "postback",
            payload: "workshops"
        }]
    };
    elements.push(workshops);
    if (now.isAfter(start) && now.isBefore(end)) {
        var now = {
            title: "What's running now?",
            subtitle: "test",
            image_url: "http://womentechmakers.at/img/about-section/workshop.jpg",
            buttons: [{
                title: "Show",
                type: "postback",
                payload: "next"
            }]
        };
        elements.push(now);
        var next = {
            title: "What's next?",
            subtitle: "test",
            image_url: "http://womentechmakers.at/img/about-section/workshop.jpg",
            buttons: [{
                title: "Show",
                type: "postback",
                payload: "now"
            }]
        };
        elements.push(next);
    }
    if (!now.startOf('day').isAfter(start.startOf('day'))) {
        var afterparty = {
            title: "Afterparty",
            subtitle: "18:15",
            image_url: "http://womentechmakers.at/img/sections-background/schedule.jpg",
            //buttons: [{
            //    title: "Show",
            //    type: "postback",
            //    payload: "presentations"
            //}]
            buttons: [{
                type: "web_url",
                url: "http://www.google.at/maps/place/Lanea/@48.1955122,16.3586215,16z/data=!4m5!3m4!1s0x0:0xa38cbe80be070add!8m2!3d48.1976849!4d16.36775",
                title: "Location",
                webview_height_ratio: "compact",
                messenger_extensions: true
            }]
        };
        elements.push(afterparty);
    }
    var card =  {
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

exports.sendProgram = function(session) {
    var elements = [];
    for (var i = 0; i < 10; i++) {
        var item = program[i];
        var element = {
            title: item.title,
            subtitle: "subtitle",
            image_url: "http://www.womentechmakers.at/img/favicons/mstile-310x310.png",
            buttons: [{
                title: "Speakers",
                type: "postback",
                payload: "test"
            }, {
                title: "More info",
                type: "postback",
                payload: "test"
            }]
        };
        elements.push(element);
    }
    var card =  {
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

exports.sendProgram3 = function(session, k) {
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
            var names = item.speakers.map(function(x) {
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

    var card =  {
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

exports.sendProgram4 = function(session) {
    
}