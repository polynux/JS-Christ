const { sendMessage } = require("../index.js");

module.exports = {
    name: "avatar",
    aliases: ["icon"],
    description: "Display user avatar.",
    execute(message, args) {
        if (args.length == 0) {
            return sendMessage(message, `Your avatar: <${message.author.displayAvatarURL}>`);
        } else {
            return sendMessage(message, message.mentions.users.first().tag + "'s avatar : <" + message.mentions.users.first().displayAvatarURL + ">");
        }
    }
};
