const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flip a coin!'),
	async execute(interaction) {
    const coin = Math.floor(Math.random() * 2);
    if (coin) return interaction.reply('HEADS!');
    else return interaction.reply('TAILS!');
	},
};