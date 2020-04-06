const isConfig = require('../index').isConfig;
const userId = isConfig ? require("../config/config.json").userId : process.env.USER_ID;

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
