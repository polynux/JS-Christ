const { readDatabase, editDatabase, sendMessage } = require("../index.js");

function delMessage(messages, message) {
    for (let key in messages) {
        message.channel
            .fetchMessage(messages[key].messageId)
            .then(text => text.delete())
            .catch(err => console.log(err));
    }
    message.delete();
}

module.exports = {
    name: "clean",
    description: "Cleaning up message in a specific channel.",
    execute(message, args) {
        readDatabase("guild/" + message.guild.id + "/log/" + message.channel.id).then(messages => {
            delMessage(messages.val(), message);
            let len = Object.keys(messages.val()).length + 1;
            sendMessage(message, "Cleaning up " + len + " messages", false, 3000);
            editDatabase("guild/" + message.guild.id + "/log/" + message.channel.id, {});
        });
    }
};
