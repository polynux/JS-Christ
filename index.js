const fs = require("fs");
const Discord = require("discord.js");
const { token, firebase_config } = require("./config/config.json");
let { language, prefix } = require("./config/config.json");
let lang = require("./lang/" + language + ".json");
const client = new Discord.Client();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
global.languages = {};

//collaspe lang files in one
const langFiles = fs.readdirSync("./lang").filter(file => file.endsWith(".json"));
for (let i = 0; i < langFiles.length; i++) {
    languages[langFiles[i].slice(0, 5)] = require("./lang/" + langFiles[i]);
}

const firebase = require("firebase");

//firebase init
firebase.initializeApp(firebase_config);
let database = firebase.database();

//function for database edit in module
module.exports = {
    editDatabase: function(ref, value) {
        database.ref(ref).set(value);
    },
    readDatabase: function(ref) {
        return database.ref(ref).once("value");
    },
    addToDatabase: function(ref, value) {
        database.ref(ref).push(value);
    }
};

client.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.on("ready", () => {
    console.log(lang.ready);
    console.log(lang.logIsOn);
});

client.on("guildCreate", guild => {
    let ref = database.ref("guild");
    let settings = { id: guild.id, name: guild.name, language: language, prefix: prefix, ownerId: guild.ownerID, log: {} };
    ref.once("value", snap => {
        ref.child(guild.id)
            .set(settings)
            .then(console.log("Succesfully added " + guild.name + " to the database."));
    });
});

client.on("guildDelete", guild => {
    let ref = database.ref("guild");
    ref.once("value", snap => {
        ref.child(guild.id)
            .remove()
            .then(console.log("Succesfully removed " + guild.name + " from the database."));
    });
});

client.on("message", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (message.channel.type === "text") {
        console.log("(" + message.guild.name + " - " + message.guild.id + ") " + message.author.tag + " : " + message.content);
        let date = Date.now();
        database
            .ref("guild")
            .child(message.guild.id)
            .child("log")
            .child(date)
            .set({
                id: message.author.id,
                name: message.author.tag,
                content: message.content,
                time: date
            });
    }

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== "text") {
        let langHere = database.ref("guilds/" + message.guild.id + "/language");
        return message.reply(languages[langHere].onlyGuild);
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
