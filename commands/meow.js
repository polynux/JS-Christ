async function meow(message) {
    const { file } = await fetch("https://aws.random.cat/meow").then(response => response.json());
    message.channel.send(file);
}

module.exports = {
    name: "meow",
    description: "Search cat picture.",
    execute(message) {
        meow(message);
    }
};
