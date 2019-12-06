const Discord = require("discord.js");
const { prefix, token, giphyToken } = require("./config.json");
const client = new Discord.Client();

var GphApiClient = require("giphy-js-sdk-core");
giphy = GphApiClient(giphyToken);

client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", message => {
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        //kick method
        if (command === "kick") {
            if (message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) {
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
            } else {
                message.channel.send("Insufficient permissions!");
            }
        }
        //ban method
        if (command === "ban") {
            if (message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) {
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
            } else {
                message.channel.send("Insufficient permissions!");
            }
        }
        //ping pong
        if (command === "ping") {
            return message.channel.send("Pong.");
        }
        //kill bot
        if (command === "exit") {
            if (message.member.hasPermission(["ADMINISTRATOR"])) {
                console.log("exit bot");
                process.exit();
            }
        }
    }
});

client.login(token);
