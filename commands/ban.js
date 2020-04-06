const {sendMessage, isConfig} = require("../index.js");
const giphyToken = isConfig ? require('../config/config.json').giphyToken : process.env.GIPHY_TOKEN,
    language = isConfig ? require('../config/config.json').language : process.env.LANGUAGE;

const {banned, noPerms, needTag, axeBan} = require("../lang/" + language + ".json");

let GphApiClient = require("giphy-js-sdk-core");
giphy = GphApiClient(giphyToken);

module.exports = {
    name: "ban",
    description: "Ban the selected user.",
    guildOnly: true,
    execute(message, args) {
        if (message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) {
            if (!message.mentions.members.size) {
                message.reply(needTag);
            } else {
                let member = message.mentions.members.first();
                member.ban(axeBan).then(member => {
                    giphy.search("gifs", {q: "ciao"}).then(response => {
                        let totalResponses = response.data.length;
                        let responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
                        let responseFinal = response.data[responseIndex];

                        message.channel.send(":wave: " + member.displayName + " " + banned, {
                            files: [responseFinal.images.fixed_height.url]
                        });
                    }).catch(() => {
                        sendMessage(message, "Error!", true);
                    });
                });
            }
        } else {
            message.channel.send(noPerms);
        }
    }
};
