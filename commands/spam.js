module.exports = {
    name: "spam",
    description: "It's just a spam.",
    cooldown: 5,
    execute(message, args) {
        for (let i = 0; i < 10; i++) {
            message.channel.send("Spam");
            console.log("Spam " + message.guild.name);
        }
    }
};
