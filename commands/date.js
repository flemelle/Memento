const { SlashCommandBuilder } = require('@discordjs/builders');

const cron = require('node-cron');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('date')
		.setDescription('The date'),
	async execute(interaction) {
		let date = new Date();
		interaction.reply('The date is ' + date);
		console.log('The date is ', date);
		//console.log('the hour is :', date.getHours());

		var task = cron.schedule('*/1 * * * * *', () => {
			console.log('Printing this line every day at 1750 Hours London Time.');
			//interaction.channel.send('<@310010275866607616>');
		}, {
		scheduled: false,
		timezone: "Europe/France"
		});

		// start method is called to start the above defined cron job
		task.start();
	},
};
