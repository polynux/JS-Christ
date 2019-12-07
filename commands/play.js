const ytdl = require("ytdl-core");

module.exports = {
    name: "play",
    description: "Play audio from youtube url.",
    cooldown: 5,
    execute(message, args) {
        const { voiceChannel } = message.member;

        if (!voiceChannel) {
            return message.reply("please join a voice channel first!");
        }

        voiceChannel.join().then(connection => {
            const stream = ytdl(args[0], { filter: "audioonly" });
            const dispatcher = connection.playStream(stream);

            dispatcher.on("end", () => voiceChannel.leave());
        });
    }
};
