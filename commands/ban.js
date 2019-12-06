module.exports = {
    name: "ban",
    description: "Ban the selected user.",
    execute(message, giphy) {
        if (message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) {
            if (!message.mentions.members.size) {
                message.reply("Vous devez taguer quelqu'un!");
            } else {
                let member = message.mentions.members.first();
                member.ban("Tu as été banni par la hâche!").then(member => {
                    giphy
                        .search("gifs", { q: "ciao" })
                        .then(response => {
                            var totalResponses = response.data.length;
                            var responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
                            var responseFinal = response.data[responseIndex];

                            message.channel.send(":wave: " + member.displayName + " has been banned!", {
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
