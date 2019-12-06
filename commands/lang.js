var config = require("../config/config.json");
const fs = require("fs");

module.exports = {
    name: "lang",
    description: "Change language.",
    execute(message, args) {
        config.language = args[0];
        fs.writeFileSync("config.json", config);
        return require("../lang/" + config.language + ".json");
    }
};
