const { sendMessage } = require("../index.js");

module.exports = {
    name: "ctsur",
    description: "MAIS C'ETAIT SUR EN FAIT, C'ETAIT SUR!!.",
    cooldown: 5,
    execute(message, args) {
        const { voiceChannel } = message.member;

        if (!voiceChannel) {
            return sendMessage(message, "Please join a voice channel first!", true);
        }

        voiceChannel
            .join()
            .then(connection => {
                const audio = "../ressource/sardoche-cetait-sur.mp3";
                const dispatcher = connection.playStream(audio);
                message.reply("cetait sur");

                dispatcher.on("end", () => {
                    voiceChannel.leave();
                });
            })
            .catch(console.error);
    }
};
