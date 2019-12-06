module.exports = {
    name: "kick",
    description: "Kick the selected user.",
    execute(message, giphy) {
        if (message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) {
            if (!message.mentions.members.size) {
                message.reply("Vous devez taguer quelqu'un!");
            } else {
                let member = message.mentions.members.first();
                member.kick().then(member => {
                    giphy
                        .search("gifs", { q: "fail" })
                        .then(response => {
                            var totalResponses = response.data.length;
                            var responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
                            var responseFinal = response.data[responseIndex];

                            message.channel.send(":wave: " + member.displayName + " has been kicked!", {
                                files: [responseFinal.images.fixed_height.url]
                            });
                        })
                        .catch(() => {
                            message.channel.send("Error");
                        });
                });
            }
        } else {
            message.channel.send("Insufficient permissions!");
        }
    }
};
