const { SlashCommandBuilder } = require('@discordjs/builders');
var fs = require('fs');
const cron = require('node-cron');
let table = [];
let date = new Date()
let offset = date.getTimezoneOffset();
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
	constructor(userId, userTag, Id, title, deltaT, rmdDate, repeat = false) {
		this.title = title;
		this.userTag = userTag;
		this.userId = userId;
		this.presentDate = new Date();
		this.Id = Id;
		this.rmdDate = rmdDate;
		this.deltaT = deltaT;
		this.repeat = repeat;
		this.done = new Boolean(false);
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
						.setDescription('...')
						.setRequired(true)
						.addChoice('2022', 2022))
				.addNumberOption(option =>
					option.setName('hour')
						.setDescription('...')
						.setRequired(true)
						.addChoice('15', 15))
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
			let month = interaction.options.getNumber('month');
			let year = interaction.options.getNumber('year');
			let hour = interaction.options.getNumber('hour');
			let minute = interaction.options.getNumber('minute');
			let second = interaction.options.getNumber('second');
			let rmdDate = new Date(year, month, day, hour, minute, second);
			rmdDate = rmdDate + offset;
			let remind = new Entry(interaction.user.id, interaction.user.tag, Id, title, null, null, rmdDate, false);
			console.log('The command rmd date has been called by', interaction.user.tag);
			console.log('Reminder set for :', rmdDate);
			interaction.reply('The reminder ' + title + ' is set for : ' + rmdDate);
			table.push(remind);
			let currentDate = new Date();
			currentDate = currentDate + offset;
			//let deltaT = new Date(year - currentDate.getFullYear(), month - currentDate.getMonth(), day - currentDate.getDate(), hour - currentDate.getHours(), minute - currentDate.getMinutes(), second - currentDate.getSeconds());
			console.log('CurrentDate :', currentDate);
			console.log('RmdDate :',rmdDate);
			//console.log('New deltaT :', deltaT);
			console.log('Reminder set');
			console.log('.................');
		}
		else if (interaction.options.getSubcommand() === 'time') {
			let unit = interaction.options.getString('unit');
			let number = interaction.options.getNumber('number');
			let rmdDate = deltaT(number, unit, offset);
			let remind = new Entry(interaction.user.id, interaction.user.tag, Id, title, unit, number, rmdDate, false);
			console.log('The command rmd time has been called by', interaction.user.tag);
			console.log('Reminder set for :', rmdDate);
			interaction.reply('The reminder ' + title + ' is set for : ' + rmdDate);
			table.push(remind);
			console.log('Reminder set');
			console.log('.................');
		}
		else if (interaction.options.getSubcommand() === 'periodic') {
			let frequency = interaction.options.getNumber('frequency');
			let unit = interaction.options.getString('unit');
			let rmdDate = deltaT(frequency, unit, offset);
			let remind = new Entry(interaction.user.id, interaction.user.tag, Id, title, unit, frequency, rmdDate, true);
			console.log('The command rmd periodic has been called by', interaction.user.tag);
			console.log('Reminder set for :', rmdDate);
			interaction.reply('The reminder ' + title + ' is set for : ' + rmdDate);
			table.push(remind);
			console.log('Reminder set');
			console.log('.................');
			//reminderSetting(table);
			//incomplete
		}
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
function deltaT(number, unit, offset) {
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
	rmdDate = new Date(rmdYear, rmdMonth, rmdDayOfMonth, rmdHour, rmdMinute, rmdSecond)
	currentDate = currentDate + offset;
	rmdDate = rmdDate + offset;;
	console.log('The reminder is set at : ', currentDate, ' for : ', rmdDate);
	//interaction.reply('The reminder is set for : ' + rmdDate);
	return rmdDate;
}
function reminderSetting(tab) {
	for (let i = 0; i < tab.length; i++) {
		let Y = tab[i].rmdDate.getFullYear();
		let Mo = tab[i].rmdDate.getMonth();
		let D = tab[i].rmdDate.getDate();
		let H = tab[i].rmdDate.getHours();
		let Mi = tab[i].rmdDate.getMinutes();
		let S = tab[i].rmdDate.getSeconds();
		console.log(tab[i]);
		var task = cron.schedule('S Mi H D Mo Y', () => {
			console.log('Cron set up for :', rmdDate);
		}, {
			scheduled: false,
			timezone: "Europe/Paris"
		});
		task.start();
	}
}