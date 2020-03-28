const index = require("../index.js");

module.exports = {
    name: "lang",
    description: "Change language.",
    execute(message, args) {
        index.editDatabase("guild/" + message.guild.id + "/language", args[0]);
        index.ansMessageInLang(message, "langChanged");
    }
};
