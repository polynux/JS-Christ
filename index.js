const fs = require('fs');
const Discord = require('discord.js');
const isConfig = fs.existsSync('./config/config.json');
const token = isConfig ? require('./config/config.json').token : process.env.TOKEN,
    language = isConfig ? require('./config/config.json').language : process.env.LANGUAGE,
    prefix = isConfig ? require('./config/config.json').prefix : process.env.PREFIX,
    firebase_config = isConfig ? require('./config/config.json').firebase_config : {
        "apiKey": process.env.FIREBASE_API_KEY,
        "authDomain": process.env.FIREBASE_AUTH_DOMAIN,
        "databaseURL": process.env.FIREBASE_DATABASE_URL,
        "storageBucket": process.env.FIREBASE_STORAGE_BUCKET
    };
const lang = require("./lang/" + language + ".json");
const client = new Discord.Client();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
let languages = {};

// collaspe lang files in one
const langFiles = fs.readdirSync("./lang").filter(file => file.endsWith(".json"));
for (let i = 0; i < langFiles.length; i++) {
    languages[langFiles[i].slice(0, 5)] = require("./lang/" + langFiles[i]);
}

const firebase = require('firebase');

// firebase init
firebase.initializeApp(firebase_config);
let database = firebase.database();

// function for database edit in module
function editDatabase(ref, value) {
    database.ref(ref).set(value);
}
function readDatabase(ref) {
    return database.ref(ref).once("value");
}
function addToDatabase(ref, value) {
    database.ref(ref).push(value);
}
function logId(message) {
    let messages = {
        messageId: message.id
    };
    editDatabase("guild/" + message.guild.id + "/log/" + message.channel.id + "/" + message.id, messages);
}
function sendMessage(message, text, notDm = true) {
    let embed;
    if (notDm) {
        embed = new Discord.RichEmbed().setColor(message.guild.me.displayColor).setDescription(text);
    } else {
        embed = new Discord.RichEmbed().setColor("#FFFF00").setDescription(text);
    } message.channel.send(embed).then(botMessage => {
        if (notDm) {
            logId(botMessage);
            logId(message);
        }
    });
}
function sendErrMessage(message, text, notDm = true) {
    message.channel.send({
        embed: {
            color: 16711680,
            description: text
        }
    }).then(botMessage => {
        if (notDm) {
            logId(botMessage);
            logId(message);
        }
    });
}
function sendTimeoutMessage(message, text, timeout) {
    let embed = new Discord.RichEmbed().setColor(message.guild.me.displayColor).setDescription(text);
    message.channel.send(embed).then(botMessage => {
        botMessage.delete(timeout);
    });
}

// export func
module.exports = {
    isConfig,
    editDatabase,
    readDatabase,
    addToDatabase,
    languages,
    prefix,
    sendMessage,
    sendErrMessage,
    sendTimeoutMessage
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
    client.user.setActivity("!help", {type: "PLAYING"});
});

client.on("guildCreate", guild => {
    let ref = database.ref("guild");
    let settings = {
        id: guild.id,
        name: guild.name,
        language: language,
        prefix: prefix,
        ownerId: guild.ownerID
    };
    ref.once("value", snap => {
        ref.child(guild.id).set(settings).then(console.log("Succesfully added " + guild.name + " to the database."));
    });
});

client.on("guildDelete", guild => {
    let ref = database.ref("guild");
    ref.once("value", snap => {
        ref.child(guild.id).remove().then(console.log("Succesfully removed " + guild.name + " from the database."));
    });
});

function log(message) {
    if (message.channel.type === "text") {
        console.log("(" + message.guild.name + " - " + message.guild.id + ") " + message.author.tag + " : " + message.content);
        let date = Date.now();
        editDatabase("guild/" + message.guild.id + "/log/" + date, {
            id: message.author.id,
            name: message.author.tag,
            content: message.content,
            time: date
        });
        editDatabase("user/" + message.author.id + "/name", message.author.tag);
        editDatabase("user/" + message.author.id + "/id", message.author.id);
        editDatabase("user/" + message.author.id + "/log/" + date, {
            server: message.guild.id,
            content: message.content,
            time: date
        });
    }
    if (message.channel.type === "dm") {
        console.log("(" + message.author.id + ") " + message.author.tag + " : " + message.content);
        let date = Date.now();
        editDatabase("user/" + message.author.id + "/name", message.author.tag);
        editDatabase("user/" + message.author.id + "/id", message.author.id);
        editDatabase("user/" + message.author.id + "/log/" + date, {
            server: "dm",
            content: message.content,
            time: date
        });
    }
}

function cmdMessage(message, prefix) {
    if (! message.content.startsWith(prefix) || message.author.bot) 
        return;
    


    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (! command) 
        return;
    


    if (command.guildOnly && message.channel.type !== "text") {
        let langHere = "en_EN";
        return sendErrMessage(message, languages[langHere].onlyGuild, false);
    }

    if (command.args && ! args.length) {
        let reply = `You didn't provide any arguments, ${
            message.author
        }!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${
                command.name
            } ${
                command.usage
            }\``;
        }

        return sendErrMessage(message, reply);
    }

    if (! cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${
                timeLeft.toFixed(1)
            } more second(s) before reusing the \`${
                command.name
            }\` command.`);
        }
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(lang.unknowCommand.replace("*", `${prefix}`));
    }
}

client.on("message", async message => {
    if (message.channel.type === "dm") {
        cmdMessage(message, prefix);
    } else {
        readDatabase("guild/" + message.guild.id + "/prefix").then(prefix => {
            cmdMessage(message, prefix.val());
        });
    }
});

client.login(token);
