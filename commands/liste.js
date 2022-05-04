const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
let liste = [];
fs.readFile('./liste.json', 'utf-8', (err, jsonString) => {
    if (err) {
        console.log(err);
    } else {
        try {
            const data = JSON.parse(jsonString);
            //console.log(data);
            
        } catch {
            console.log('Error parsing JSON', err);
        }
        liste = JSON.parse(jsonString);
    }
})


module.exports = {
	data: new SlashCommandBuilder()
		.setName('liste')
        .setDescription('Add something to te liste')
        .addStringOption(option =>
            option.setName('element')
                .setDescription('element to add to the liste')
            .setRequired(true)),
	async execute(interaction) {
		const element = interaction.options.getString('element');
        liste.push(element);
        listeString = JSON.stringify(liste, null, 2);
        fs.writeFile('./liste.json', listeString, err => {
            if (err) {
                console.log(err);
            } else {
                console.log('file successfully written');
            }
        } )
        interaction.reply('The liste is : \n' + listeString);
        //console.log('The liste is ', listeString);
	},
};