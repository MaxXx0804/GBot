// deploy-commands.js
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
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
    .toJSON(),
  new SlashCommandBuilder()
    .setName('emojiquiz')
    .setDescription('Start an emoji guessing game')
    .toJSON(),
    new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('Ask the magic 8-ball a question')
  .addStringOption(option =>
    option.setName('question')
      .setDescription('Your question')
      .setRequired(true)
  )
  .toJSON(),
  new SlashCommandBuilder()
  .setName('math')
  .setDescription('Calculate a math expression')
  .addStringOption(option =>
    option.setName('expression')
      .setDescription('The math expression to evaluate')
      .setRequired(true)
  )
  .toJSON(),
  new SlashCommandBuilder()
  .setName('wordle')
  .setDescription('Guess the daily 5-letter word')
  .addStringOption(option =>
    option.setName('guess')
      .setDescription('Your 5-letter guess')
      .setRequired(true)
  )
  .toJSON(),
new SlashCommandBuilder()
  .setName('cls')
  .setDescription('Remove the bot’s last N messages in this channel')
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Number of messages to delete (default: 5)')
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(false)
  )
  .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), // for testing
      // Routes.applicationCommands(process.env.CLIENTID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();