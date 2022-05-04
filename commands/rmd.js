const { SlashCommandBuilder } = require('@discordjs/builders');
var fs = require('fs');
let table = [];
fs.readFile('./reminders.json', 'utf-8', (err, jsonString) => {
    if (err) {
        console.log(err);
    } else {
        try {
            const data = JSON.parse(jsonString);
            //console.log(data);
            
        } catch {
            console.log('Error parsing JSON', err);
        }
        table = JSON.parse(jsonString);
    }
})

class Entry{
	constructor(userId, userTag, Id, title, unit, number, rmdDate) {
		this.title = title;
		this.userTag = userTag;
		this.userId = userId;
		this.presentDate = new Date();
		this.unit = unit;
		this.number = number;
		this.Id = Id;
		this.rmdDate = rmdDate;
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
				.addNumberOption(option =>
					option.setName('day')
						.setDescription('...')
						.setRequired(true))
				.addNumberOption(option =>
					option.setName('month')
						.setDescription('...')
						.setRequired(true))
				.addNumberOption(option =>
					option.setName('year')
						.setDescription('...'))
				.addNumberOption(option =>
					option.setName('hour')
						.setDescription('...'))
				.addNumberOption(option =>
					option.setName('minute')
						.setDescription('...'))
				.addNumberOption(option =>
					option.setName('second')
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
		//console.log(Date.now());
		let Id = Date.now();
		let title = interaction.options.getString('title');
		if (interaction.options.getSubcommand() === 'date') {
			let day = interaction.options.getNumber('day');
			let month = interaction.options.getNumber('month') - 1;
			let year = interaction.options.getNumber('year');
			let hour = interaction.options.getNumber('hour');
			let minute = interaction.options.getNumber('minute');
			let second = interaction.options.getNumber('second');
			let rmdDate = new Date(year, month, day, hour, minute, second);
			let remind = new Entry(interaction.user.id, interaction.user.tag, Id, title, null, null, rmdDate);
			console.log('The command rmd date as been called by ', interaction.user.tag, ' Reminder set for : ', rmdDate);
			interaction.reply('The reminder ' + title + ' is set for : ' + rmdDate);
			table.push(remind);
		}
		else if (interaction.options.getSubcommand() === 'time') {
			let unit = interaction.options.getString('unit');
			let number = interaction.options.getNumber('number');
			let rmdDate = deltaT(number, unit);
			let remind = new Entry(interaction.user.id, interaction.user.tag, Id, title, unit, number, rmdDate);
			console.log('The command rmd date as been called by ', interaction.user.tag, ' Reminder set for : ', rmdDate);
			interaction.reply('The reminder ' + title + ' is set for : ' + rmdDate);
			table.push(remind);
		}
		else if (interaction.options.getSubcommand() === 'periodic') {
			let frequency = interaction.options.getNumber('frequency');
			let unit = interaction.options.getString('unit');
			let rmdDate = deltaT(frequency, unit);
			let remind = new Entry(interaction.user.id, interaction.user.tag, Id, title, unit, frequency, rmdDate);
			console.log('The command rmd date as been called by ', interaction.user.tag, ' Reminder set for : ', rmdDate);
			interaction.reply('The reminder ' + title + ' is set for : ' + rmdDate);
			table.push(remind);
			//incomplete
		}
		
		
		//interaction.reply('The liste of reminders is : \n' + tableString);
        //console.log('The liste of reminder is ', tableString);
		//console.log('rmd has been called');
		//interaction.reply('Reminder ' + title + ' set for ' + number + frequency + ' ' + unit);
		//console.log(title, 'with Id', Id, 'set for', number, frequency, unit);
		
        tableString = JSON.stringify(table, null, 2);
		fs.writeFile('./reminders.json', tableString, err => {
			if (err) {
				console.log(err);
			} else {
				console.log('file successfully written');
			}
		});
	},
};

function deltaT(number, unit) {
	let currentDate = new Date();
	let currentYear = currentDate.getFullYear();
	let currentMonth = currentDate.getMonth();
	let currentDayOfMonth = currentDate.getDate();
	let currentHour = currentDate.getHours();
	let currentMinute = currentDate.getMinutes();
	let currentSecond = currentDate.getSeconds();
	let rmdDate = new Date();
	let rmdYear = rmdDate.getFullYear();
	let rmdMonth = rmdDate.getMonth();
	let rmdDayOfMonth = rmdDate.getDate();
	let rmdHour = rmdDate.getHours();
	let rmdMinute = rmdDate.getMinutes();
	let rmdSecond = rmdDate.getSeconds();
	
	
	//console.log(unit, rmdDate.getTimezoneOffset());
	switch (unit) {
		case "seconds":
			rmdSecond = currentSecond + number;
			break;
		case 'minutes':
			rmdMinute = currentMinute + number;
			break;
		case 'hours':
			rmdHour = currentHour + number;
			break;
		case 'days':
			rmdDayOfMonth = currentDayOfMonth + number;
			break;
		case 'weeks':
			rmdDayOfMonth = currentDayOfMonth + 7 * number;
			break;
		case 'months':
			rmdMonth = currentMonth + number;
			break;
		case 'years':
			rmdYear = currentYear + number;
			break;
		}
	rmdDate = new Date(rmdYear, rmdMonth, rmdDayOfMonth, rmdHour, rmdMinute, rmdSecond);
	console.log('The reminder is set at : ', currentDate, ' for : ', rmdDate);
	//interaction.reply('The reminder is set for : ' + rmdDate);
	return rmdDate;
	
}