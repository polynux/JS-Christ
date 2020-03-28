module.exports = {
    name: "ctsur",
    description: "MAIS C'ETAIT SUR EN FAIT, C'ETAIT SUR!!.",
    cooldown: 5,
    execute(message, args) {
        const { voiceChannel } = message.member;

        if (!voiceChannel) {
            return message.reply("please join a voice channel first!");
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
