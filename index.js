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
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log(lang.ready);
    console.log(lang.logIsOn);
});

client.on("message", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    console.log("(" + message.guild.name + ") " + message.author.tag + " : " + message.content);

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(lang.unknowCommand.replace("*", `${prefix}`));
    }
});

client.login(token);
