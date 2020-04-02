const ytdl = require("ytdl-core");
const { sendMessage } = require("../index.js");

function play(voiceChannel) {
    voiceChannel
        .join()
        .then(connection => {
            const stream = ytdl(args[0], { filter: "audioonly" });
            const dispatcher = connection.playStream(stream);

            dispatcher.on("end", () => voiceChannel.leave());
        })
        .catch(console.error);
}

module.exports = {
    name: "play",
    description: "Play audio from youtube url.",
    cooldown: 5,
    execute(message, args) {
        const { voiceChannel } = message.member;

        if (!voiceChannel) {
            return sendMessage(message, "Please join a voice channel first!", true);
        }
        play(voiceChannel);
    }
};
