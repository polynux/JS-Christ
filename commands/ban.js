const { giphyToken, language } = require("../config/config.json");
const { banned, noPerms, needTag, axeBan } = require("../lang/" + language + ".json");
var GphApiClient = require("giphy-js-sdk-core");
giphy = GphApiClient(giphyToken);

module.exports = {
    name: "ban",
    description: "Ban the selected user.",
    execute(message, args) {
        if (message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) {
            if (!message.mentions.members.size) {
                message.reply(needTag);
            } else {
                let member = message.mentions.members.first();
                member.ban(axeBan).then(member => {
                    giphy
                        .search("gifs", { q: "ciao" })
                        .then(response => {
                            var totalResponses = response.data.length;
                            var responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
                            var responseFinal = response.data[responseIndex];

                            message.channel.send(":wave: " + member.displayName + " " + banned, {
                                files: [responseFinal.images.fixed_height.url]
                            });
                        })
                        .catch(() => {
                            message.channel.send("Error");
                        });
                });
            }
        } else {
            message.channel.send(noPerms);
        }
    }
};
