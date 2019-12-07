const Discord = require("discord.js");

module.exports = {
    name: "test-embed",
    aliases: ["embed"],
    description: "Test embed function",
    cooldown: 5,
    execute(message, args) {
        const exampleEmbed = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle("Some title")
            .setURL("https://discord.js.org/")
            .setDescription("Some description here")
            .addField("Regular field title", "Some value here")
            .addBlankField()
            .setImage("https://i.imgur.com/wSTFkRM.png");

        message.channel.send(exampleEmbed);
    }
};
