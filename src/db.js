var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyAYq14Uwy0KKgtpUVLFAh0RENpPilJBXwM",
    authDomain: "wtm-vienna-bot.firebaseapp.com",
    databaseURL: "https://wtm-vienna-bot.firebaseio.com",
    storageBucket: "wtm-vienna-bot.appspot.com"
  };

firebase.initializeApp(config);
var database = firebase.database();

module.exports = {  
  getProgram: () => {
    return database.ref(`schedule`).once('value')
      .then((snapshot) => {
        let program = snapshot.val();
        return program;
      }).catch(function (error) {
            console.log("ERROR:", error.message || error);
      });
  }
}