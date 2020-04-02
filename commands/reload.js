const { sendMessage } = require("../index.js");

module.exports = {
    name: "reload",
    description: "Reloads a command",
    args: true,
    execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return sendMessage(message, `There is no command with name or alias \`${commandName}\`, ${message.author}!`, true);
        }

        delete require.cache[require.resolve(`./${commandName}.js`)];

        try {
            const newCommand = require(`./${commandName}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.log(error);
            return sendMessage(message, `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``, true);
        }
        sendMessage(message, `Command \`${commandName}\` was reloaded!`);
    }
};
