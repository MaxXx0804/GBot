// deploy-commands.js
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Sends current schedule')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('laro')
    .addStringOption(
      option => option.setName('game')
      .setDescription("Type of game you want to play.")
      .setRequired(true)
    )
    .setDescription('Mentions everyone')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      // Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), // for testing
      Routes.applicationCommands(process.env.CLIENTID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();