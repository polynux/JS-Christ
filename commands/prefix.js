var config = require("../config/config.json");
const fs = require("fs");

module.exports = {
    name: "prefix",
    description: "Change prefix.",
    execute(message, args) {
        var old = config.prefix;
        config.prefix = args[0];
        fs.writeFileSync("config.json", config);
        message.channel.send("Change prefix from " + old + " to " + config.prefix);
        return config.prefix;
    }
};
