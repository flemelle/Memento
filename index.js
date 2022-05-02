const { Client, Collection, Intents } = require('discord.js');
const fs = require('node:fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const { token } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

const commands = [];
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);