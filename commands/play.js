const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music')
    .addStringOption(query => query.setName('query').setDescription('URL or song name').setRequired(true)),
  async execute(interaction) {
    // Error handling if user is not in voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply('You need to be in a channel to play music!');

    // Error handling if wrong permission
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
      return interaction.reply('You do not have the correct permissions to play music!');

    const serverQueue = queue.get(interaction.guild.id);

    let song = {};
    const query = interaction.options.getString('query');
    if (ytdl.validateURL(query)) {
      const songInfo = await ytdl.getInfo(query);
      song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };
    } else {
      // If the song is not a valid URL, use keywords to find that video
      const videoFinder = async (query) => {
        const videoResult = await ytSearch(query);
        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
      }

      const video = await videoFinder(query);

      if (video) song = { title: video.title, url: video.url };
      else interaction.reply('Cannot find video.');
    }

    if (!serverQueue) {
      const queueConstructor = {
        voiceChannel: voiceChannel,
        textChannel: interaction.channel,
        connection: null,
        songs: [],
      }

      queue.set(interaction.guild.id, queueConstructor);
      queueConstructor.songs.push(song);

      try {
        const connection = joinVoiceChannel({
          channelId: voiceChannel,
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator
        });

        queueConstructor.connection = connection;
        videoPlayer(interaction.guild, queueConstructor.songs[0]);
      } catch (error) {
        queue.delete(interaction.guild.id);
        interaction.reply('Cannot find video.');
        console.log(error);
      }
    } else {
      serverQueue.songs.push(song);
      return interaction.reply(`${song.title} added to queue!`);
    }
  }
};

const videoPlayer = async (guild, song) => {
  const songQueue = queue.get(guild.id);

  if (!song) {
    songQueue.connection.destroy();
    queue.delete(guild.id);
    return;
  }

  const stream = ytdl(song.url, { filter: 'audioonly' });
  const player = createAudioPlayer();
  const resource = createAudioResource(stream);
  player.play(resource);

  songQueue.connection.subscribe(player);

  await songQueue.textChannel.send(`Now playing ${song.title}`);
}