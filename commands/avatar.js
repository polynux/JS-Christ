module.exports = {
    name: "avatar",
    description: "Display user avatar.",
    execute(message) {
        return message.channel.send(`Your avatar: <${message.author.displayAvatarURL}>`);
    }
};
