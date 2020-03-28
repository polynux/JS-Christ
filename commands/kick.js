const { giphyToken, language } = require("../config/config.json");
const { kicked, noPerms, needTag } = require("../lang/" + language + ".json");
var GphApiClient = require("giphy-js-sdk-core");
giphy = GphApiClient(giphyToken);

module.exports = {
    name: "kick",
    description: "Kick the selected user.",
    guildOnly: true,
    execute(message, args) {
        if (message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) {
            if (!message.mentions.members.size) {
                message.reply(languages.en_EN.needTag);
            } else {
                let member = message.mentions.members.first();
                member.kick().then(member => {
                    giphy
                        .search("gifs", { q: "fail" })
                        .then(response => {
                            var totalResponses = response.data.length;
                            var responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
                            var responseFinal = response.data[responseIndex];

                            message.channel.send(":wave: " + member.displayName + " " + kicked, {
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
