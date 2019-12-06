const { userId } = require("../config/config.json");

module.exports = {
    name: "exit",
    description: "Stop the bot!",
    execute(message, args) {
        if (message.member.user.id === userId) {
            console.log("exit bot");
            process.exit();
        }
    }
};
