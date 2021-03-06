const {sendMessage, sendErrMessage, isConfig} = require("../index.js");
const userId = isConfig ? require('../config/config.json').userId : process.env.USER_ID;

module.exports = {
    name: "reload",
    description: "Reloads a command",
    args: true,
    execute(message, args) {
        if (message.author.id !== userId) {
            return sendErrMessage(message, "You can't permorm this command!");
        }

        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (! command) {
            return sendErrMessage(message, `There is no command with name or alias \`${commandName}\`, ${
                message.author
            }!`);
        }

        delete require.cache[require.resolve(`./${commandName}.js`)];

        try {
            const newCommand = require(`./${commandName}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.log(error);
            return sendErrMessage(message, `There was an error while reloading a command \`${commandName}\`:\n\`${
                error.message
            }\``);
        }
        if (message.channel.type !== "dm") {
            sendMessage(message, `Command \`${commandName}\` was reloaded!`);
        } else {
            sendMessage(message, `Command \`${commandName}\` was reloaded!`, false);
        }
    }
};
