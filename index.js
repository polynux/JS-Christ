const fs = require("fs");
const Discord = require("discord.js");
const { language, token, prefix } = require("./config/config.json");
const lang = require("./lang/" + language + ".json");
const client = new Discord.Client();
var settings = require("./config/server-settings.json");
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once("ready", () => {
    console.log(lang.ready);
    console.log(lang.logIsOn);

    client.guilds.forEach(guild => {
        if (!(guild.id in settings.guild)) {
            settings.guild[guild.id] = { id: guild.id, name: guild.name };
            console.log("write");
        }
    });
    fs.writeFile("./config/server-settings.json", JSON.stringify(settings, null, 4), err => {
        if (err) return console.log(err);
        console.log(JSON.stringify(settings));
    });
});

client.on("message", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (message.channel.type === "text") {
        console.log("(" + message.guild.name + " - " + message.guild.id + ") " + message.author.tag + " : " + message.content);
    }

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== "text") {
        return message.reply("I can't execute that command inside DMs!");
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(lang.unknowCommand.replace("*", `${prefix}`));
    }
});

client.login(token);
