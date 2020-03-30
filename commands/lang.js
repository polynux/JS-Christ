const index = require("../index.js");

module.exports = {
    name: "lang",
    description: "Change language. You have fr_FR, en_EN",
    execute(message, args) {
        if (args[0] in index.languages) {
            index.editDatabase("guild/" + message.guild.id + "/language", args[0]);
            index.readDatabase("guild/" + message.guild.id + "/language").then(data => {
                message.reply(index.languages[data.val()].langChanged);
            });
        } else {
            index.readDatabase("guild/" + message.guild.id + "/language").then(data => {
                message.reply(index.languages[data.val()].langNotChanged);
            });
        }
    }
};
