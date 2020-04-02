const index = require("../index.js");

module.exports = {
    name: "prefix",
    description: "Change prefix.",
    guildOnly: true,
    execute(message, args) {
        index.readDatabase("guild/" + message.guild.id + "/prefix").then(data => {
            let old = data.val();
            index.editDatabase("guild/" + message.guild.id + "/prefix", args[0]);
            index.sendMessage(message, "Change prefix from " + old + " to " + args[0]);
        });
    }
};
