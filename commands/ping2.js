let { sendMessage } = require("../index.js");

module.exports = {
    name: "ping2",
    description: "Ping!",
    cooldown: 5,
    execute(message, args) {
        let start = Date.now();
        message.channel.send("Ping").then(m => m.edit(`Pong : ${Date.now() - start} ms`));
    }
};
