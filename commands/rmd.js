const { SlashCommandBuilder } = require('@discordjs/builders');
var fs = require('fs');
let table = [];
fs.readFile('./reminders.json', 'utf-8', (err, jsonString) => {
    if (err) {
        console.log(err);
    } else {
        try {
            const data = JSON.parse(jsonString);
            console.log(data);
            
        } catch {
            console.log('Error parsing JSON', err);
        }
        table = JSON.parse(jsonString);
    }
})

class Entry{
	constructor(userId, userTag, Id, title, unit, number){
		this.userId = userId;
		this.userTag = userTag;
		this.title = title;
		this.unit = unit;
		this.number = number;
		this.Id = Id;
	}
}
class Reminder{
	constructor(Id, title, userId, userTag, name, date){
		this.Id = Id;
		this.title = title;
		this.userId = userId;
		this.userTag = userTag;
		this.name = name;
		this.date = date;
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rmd')
		.setDescription('To set a reminder')
		.addSubcommand(subcommand =>
			subcommand.setName('date')
				.setDescription('...')
				.addStringOption(option =>
				option.setName('title')
						.setDescription('reminder\'s title')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('day')
						.setDescription('...')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('month')
						.setDescription('...')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('year')
						.setDescription('...')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('periodic')
				.setDescription('...')
				.addStringOption(option =>
					option.setName('title')
						.setDescription('reminder\'s title')
						.setRequired(true))
				.addNumberOption(option =>
					option.setName('frequency')
						.setDescription('...')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('unit')
						.setDescription('...')
						.setRequired(true)
						.addChoice('seconds', 'seconds')
						.addChoice('minutes', 'minutes')
						.addChoice('hours', 'hours')
						.addChoice('days', 'days')
						.addChoice('weeks', 'weeks')
						.addChoice('months', 'months')
						.addChoice('quadrimester', 'quadrimester')
						.addChoice('trimester', 'trimester')
						.addChoice('semester', 'semester')
						.addChoice('year', 'year')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('time')
				.setDescription('...')
				.addStringOption(option =>
					option.setName('title')
						.setDescription('reminder\'s title')
						.setRequired(true))
				.addNumberOption(option =>
					option.setName('number')
						.setDescription('...')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('unit')
						.setDescription('...')
						.setRequired(true)
						.addChoice('seconds', 'seconds')
						.addChoice('minutes', 'minutes')
						.addChoice('hours', 'hours')
						.addChoice('days', 'days')
						.addChoice('weeks', 'weeks')
						.addChoice('months', 'months')
						.addChoice('quadrimester', 'quadrimester')
						.addChoice('trimester', 'trimester')
						.addChoice('semester', 'semester')
						.addChoice('year', 'year'))),
	async execute(interaction) {
		console.log(Date.now());
		let Id = Date.now();
		const title = interaction.options.getString('title');
		const unit = interaction.options.getString('unit');
		const number = interaction.options.getNumber('number');
		const remind = new Entry(interaction.user.id, interaction.user.tag, Id, title, unit, number,);
		table.push(remind);
        tableString = JSON.stringify(table, null, 2);
        fs.writeFile('./reminders.json', tableString, err => {
            if (err) {
                console.log(err);
            } else {
                console.log('file successfully written');
            }
        } )
		console.log('rmd has been called');
		interaction.reply('Reminder ' + title + ' set for ' + number + ' ' + unit);
        interaction.reply('The liste of reminders is : \n' + tableString);
        console.log('The liste of reminder is ', tableString);
		console.log(title, 'with Id', Id, 'set for', number, unit);
	},
};
