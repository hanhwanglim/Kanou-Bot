const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flip a coin!')
		.addIntegerOption(flips => flips.setName('flips')
																		.setDescription('Number of flips (Max. 50)')
																		.setRequired(false)),
	async execute(interaction) {
		let flips = interaction.options.getInteger('flips');

		if (flips == null) flips = 1
		if (flips > 50) flips = 50;

		let coins = "";
		for (let i = 0; i < flips; i++) {
			const coin = Math.floor(Math.random() * 2);
			if (coin) coins += "HEADS, "
			else coins += "TAILS, "
		}

		coins = coins.slice(0, -2);
		return interaction.reply(coins);
	},
};