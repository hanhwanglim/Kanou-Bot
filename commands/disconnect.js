const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnects the bot from the voice channel and clears the queue.'),
  async execute(interaction) {
    const { player } = require('../index');

    // await interaction.deferUpdate();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) 
      return interaction.reply({ content: '❌ | No music is being played!' });

    queue.destroy();
    return interaction.reply({ content: '🛑 | Stopped the player!' });
  },
};