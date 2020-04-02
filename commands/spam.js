const { sendMessage } = require("../index.js");

module.exports = {
    name: "spam",
    description: "It's just a spam.",
    cooldown: 5,
    execute(message, args) {
        for (let i = 0; i < 10; i++) {
            sendMessage(message, "Spam");
            console.log("Spam " + message.guild.name);
        }
    }
};
