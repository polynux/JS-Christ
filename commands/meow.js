const fetch = require("node-fetch");

async function meow(message) {
    const { file } = await fetch("https://aws.random.cat/meow").then(response => response.json());
    message.channel.send(file);
}

module.exports = {
    name: "meow",
    aliases: ["miaou"],
    description: "Search cat picture.",
    cooldown: 5,
    execute(message, args) {
        meow(message);
    }
};
