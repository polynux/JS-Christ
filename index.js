const Discord = require("discord.js");
const { prefix, token, giphyToken } = require("./config.json");
const fetch = require("node-fetch");
const client = new Discord.Client();

var GphApiClient = require("giphy-js-sdk-core");
giphy = GphApiClient(giphyToken);

client.once("ready", () => {
    console.log("Bot is ready!");
    console.log("Ready to log command.");
});

client.on("message", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    console.log(message.author.tag + " : " + message.content);
    //kick method
    if (command === "kick") {
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
    //ban method
    else if (command === "ban") {
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
    //ping pong
    else if (command === "ping") {
        return message.channel.send("Pong.");
    }
    //kill bot
    else if (command === "exit") {
        if (message.member.hasPermission(["ADMINISTRATOR"])) {
            console.log("exit bot");
            process.exit();
        }
    }
    //avatar
    else if (command === "avatar") {
        return message.channel.send(`Your avatar: <${message.author.displayAvatarURL}>`);
    }
    //meow
    else if (command === "meow") {
        const { file } = await fetch("https://aws.random.cat/meow").then(response => response.json());
        message.channel.send(file);
    } else {
        message.reply("Commande inconnue! Apprend à écrire ou essaie !help !");
    }
});

client.login(token);
