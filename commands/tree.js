const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('tree')
        .setDescription('Make a tree')
        .addSubcommand(subcommand =>
            subcommand
                .setName('bracheone')
                .setDescription('Make leafs'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('branchetwo')
                .setDescription('Make leafs'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('branchethree')
                .setDescription('Make leafs')),
    async execute(interaction) {
        interaction.reply('Tree has been called');
        console.log('Tree has been called');
    },
};