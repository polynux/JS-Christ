let { sendMessage } = require("../index.js");

module.exports = {
    name: "ping",
    description: "Ping!",
    cooldown: 5,
    execute(message, args) {
        sendMessage(message, "Pong!");
    }
};
