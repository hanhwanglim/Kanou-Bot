const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('choose')
		.setDescription('Chooses an option')
		.addStringOption(choices => choices.setName('choices')
                                        .setDescription('Choices ([choice 1];[choice 2];[choice 3];...')
                                        .setRequired(true)),
	async execute(interaction) {
    const choices = interaction.options.getString('choices');
    // Split by ';' and remove empty choices
    const choicesArray = choices.split(";").filter(choice => choice !== "");
    const choiceNumber = Math.floor(Math.random() * choicesArray.length);
    return interaction.reply(`I choose ${choicesArray[choiceNumber]}`);
	},
};