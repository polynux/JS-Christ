const fs = require("fs");
const Discord = require("discord.js");
const { language, userId, token, giphyToken } = require("./config/config.json");
var { prefix } = require("./config/config.json");
var lang = require("./lang/" + language + ".json");
const fetch = require("node-fetch");
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

var GphApiClient = require("giphy-js-sdk-core");
giphy = GphApiClient(giphyToken);

client.once("ready", () => {
    console.log(lang.ready);
    console.log(lang.logIsOn);
});

client.on("message", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    console.log("(" + message.guild.name + ") " + message.author.tag + " : " + message.content);
    //kick method
    if (command === "kick") {
        client.commands.get("kick").execute(message, giphy);
    }
    //ban method
    else if (command === "ban") {
        client.commands.get("ban").execute(message, giphy);
    }
    //ping pong
    else if (command === "ping") {
        client.commands.get("ping").execute(message);
    }
    //kill bot
    else if (command === "exit") {
        client.commands.get("exit").execute(message, userId);
    }
    //avatar
    else if (command === "avatar") {
        client.commands.get("avatar").execute(message);
    }
    //meow
    else if (command === "meow") {
        client.commands.get("meow").execute(message);
    }
    //change prefix
    else if (command === "prefix") {
        prefix = client.commands.get("prefix").execute(message, args);
    }
    //change language
    else if (command === "lang") {
        lang = client.commands.get("lang").execute(message, args);
    }
    //erreur de commande
    else {
        message.reply(lang.unknowCommand.replace("*", `${prefix}`));
    }
});

client.login(token);
