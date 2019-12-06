module.exports = {
    name: "exit",
    description: "Stop the bot!",
    execute(message, userId) {
        if (message.member.user.id === userId) {
            console.log("exit bot");
            process.exit();
        }
    }
};
