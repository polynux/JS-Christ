const index = require("../index.js");

function help(message, prefix, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
        data.push("Here's a list of all my commands:");
        data.push(commands.map(command => command.name).join(", "));
        data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

        return message.author
            .send(data, { split: true })
            .then(() => {
                if (message.channel.type === "dm") return;
                index.sendMessage(message, "I've sent you a DM with all my commands!");
            })
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                index.sendMessage(message, "it seems like I can't DM you! Do you have DMs disabled?", true);
            });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
        return index.sendMessage(message, "That's not a valid command!", true);
    }

    data.push(`**Name:** ${command.name}`);

    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    if (command.description) data.push(`**Description:** ${command.description}`);
    if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

    message.channel.send(data, { split: true });
}

module.exports = {
    name: "help",
    description: "List all of my commands or info about a specific command.",
    aliases: ["commands"],
    usage: "[command name]",
    cooldown: 5,
    execute(message, args) {
        if (message.channel.type === "dm") {
            help(message, index.prefix, args);
        } else {
            index.readDatabase("guild/" + message.guild.id + "/prefix").then(prefix => {
                help(message, prefix.val(), args);
            });
        }
    }
};
