var builder = require('botbuilder');
var db = require("./db");
var utils = require("./utils.js")
var text = require("./text.json")
var menu = require("./menu.json")
var program = require("./program.json")
var moment = require("moment");

exports.sendMenu = function(session) {
    var menu_buttons = [];
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].enabled === true) {            
            menu_buttons.push(new builder.CardAction.dialogAction(session, menu[i].postback, null,  menu[i].name))
        }
    }
    var msg = new builder.Message(session)
        .attachments([
            new builder.HeroCard(session)
                //.title("Test")
                .buttons(menu_buttons)
        ]);
    session.send(msg);
}

exports.sendProgram = function(session) {
    var elements = [];
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
        var image = "";
        if (item.image !== undefined) {
            image = item.image;
        } else if (item.speakers !== undefined && item.speakers.length === 1) {
            image = item.speakers[0].image;
        } else {
            image = "https://www.womentechmakers.at/img/favicons/mstile-310x310.png";
        }
        var time = moment(item.start, "YYYY-MM-DD HH:mm").format('H:mm');
        var element = {
            title: item.name,
            image_url: image,
            subtitle: time + " " + speakers,
            buttons: buttons
        }        
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