const {sendMessage, readDatabase, isConfig} = require("../index.js");
const pastebinKey = isConfig ? require("../config/config.json").pastebinKey : process.env.PASTEBIN_KEY;
const PastebinAPI = require("pastebin-js");
let pastebin = new PastebinAPI(pastebinKey);

module.exports = {
    name: "log",
    description: "Get all logs from the server.",
    cooldown: 5,
    execute(message, args) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            readDatabase("guild/" + message.guild.id).then(data => {
                pastebin.createPaste(JSON.stringify(data.val())).then(paste => {
                    message.channel.send(paste);
                }).fail(err => console.log(err));
            });
        } else {
            sendMessage(message, "Insufficient permissions!", true);
        }
    }
};
