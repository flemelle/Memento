const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('date')
		.setDescription('The date'),
	async execute(interaction) {
		let date = new Date();
		interaction.reply('The date is ' + date);
		console.log('The date is ', date);
		console.log('the hour is :', date.getHours());
	},
};
