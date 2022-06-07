const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip current song'),
  async execute(interaction) {
    const { player } = require('../index');

    // await interaction.deferUpdate();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) 
      return interaction.reply({ content: '❌ | No music is being played!' });

    const currentTrack = queue.current;
    const success = queue.skip();
    return interaction.reply({ content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!' });
  },
};