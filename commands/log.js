const index = require("../index.js");
const { pastebinKey } = require("../config/config.json");
const PastebinAPI = require("pastebin-js");
let pastebin = new PastebinAPI(pastebinKey);

module.exports = {
    name: "log",
    description: "Get all logs from the server.",
    cooldown: 5,
    execute(message, args) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            index.readDatabase("guild/" + message.guild.id).then(data => {
                pastebin
                    .createPaste(JSON.stringify(data.val()))
                    .then(paste => {
                        message.channel.send(paste);
                    })
                    .fail(err => console.log(err));
            });
        } else {
            index.sendMessage(message, "Insufficient permissions!", true);
        }
    }
};
