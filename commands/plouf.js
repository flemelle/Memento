const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('plouf')
		.setDescription('plouf plouf plouf!'),
	async execute(interaction) {
		interaction.reply('PLOUUF!!!');
	},
};
