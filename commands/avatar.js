module.exports = {
    name: "avatar",
    description: "Display user avatar.",
    execute(message, avatar) {
        return message.channel.send(`Your avatar: <${message.author.displayAvatarURL}>`);
    }
};
