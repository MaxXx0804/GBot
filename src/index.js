require('dotenv').config();

const { Client, IntentsBitField, EmbedBuilder, Events} = require("discord.js");
const { EpicFreeGames } = require('epic-free-games');
const { GetCurrentSchedule, GetNextSchedule } = require("./schedulechecker.js");
const { CheckChat } = require("./chatprompt.js");
const keep_alive = require('./keep_alive.js')
const postedGameTitles = new Set();
const emojiQuiz = require('./emojiquiz.js');
const emojiQuizScores = require('./emojiquizScores.js');
const mathCommand = require('./mathcommand.js');
const wordle = require('./wordle.js');

const efg = new EpicFreeGames({country: "US", locale: "en-US", })

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

function CheckEpicGames()
{
    const channelId = process.env.EPICGAMESCHANNELUPDATE;
    setInterval(async () => {
    try {
      const res = await efg.getGames();
      const channel = await client.channels.fetch(channelId);

      res.currentGames.forEach((game) => {
        if (!postedGameTitles.has(game.title)) {
          postedGameTitles.add(game.title);

          if (channel && channel.isTextBased()) {
            channel.send({
              embeds: [
                EpicGamesMessageBuilder(
                  game.title,
                  game.keyImages[0].url,
                  game.description
                ),
              ],
            });
            console.log(`Posted new free game: ${game.title}`);
          }
        }
      });
    } catch (error) {
      console.error("Error checking Epic Games:", error);
    }
  }, 30 * 60 * 1000);
}

client.once(Events.ClientReady, c => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'schedule')
  {
      const currentSchedule = GetCurrentSchedule();
      const nextSchedule = GetNextSchedule();

      // Only include valid embeds
      const embeds = [];
      if (currentSchedule) embeds.push(currentSchedule);
      if (nextSchedule) embeds.push(nextSchedule);

      if (embeds.length === 0) {
        await interaction.reply({
          content: "No schedule available at the moment.",
          ephemeral: true
        });
      } else {
        await interaction.reply({ embeds });
      }
  }
  if (interaction.commandName === "laro")
  {
    await interaction.reply("Laro daw " + interaction.options.getString('game') + " @everyone");
  }

  if (interaction.commandName === "emojiquiz") {
    const quiz = await emojiQuiz.getRandomQuiz();
    await interaction.reply(`Guess the League champion from these emojis: ${quiz.emojis}\nReply with \`^your answer\` to guess!`);
    return;
  }

  if (interaction.commandName === "8ball") {
    const responses = [
      "It is certain.",
      "Without a doubt.",
      "You may rely on it.",
      "Yes – definitely.",
      "Most likely.",
      "Outlook good.",
      "Yes.",
      "Signs point to yes.",
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now.",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful."
    ];
    const question = interaction.options.getString('question');
    const answer = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(`**Question:** ${question}\n**Answer:** ${answer}`);
    return;
  }
  if (interaction.commandName === "math") {
    const expr = interaction.options.getString('expression');
    const result = mathCommand.calculate(expr);
    await interaction.reply(result);
    return;
  }
  if (interaction.commandName === "wordle") {
  const guess = interaction.options.getString('guess');
  const res = await wordle.checkGuess(guess);
  if (!res.valid) {
    await interaction.reply(res.message);
  } else if (res.win) {
    await interaction.reply(`🟩🟩🟩🟩🟩\nYou guessed it! The word was **${res.word}**!`);
  } else {
    await interaction.reply(`${res.result}\nTry again!`);
  }
  return;
}
  if (interaction.commandName === "cls") {
  if (interaction.user.id !== process.env.ADMIN_ID) {
    await interaction.reply({ content: "You are not allowed to use this command.", ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  // Get the amount option, default to 5
  const amount = interaction.options.getInteger('amount') || 5;

  // Fetch last 100 messages in the channel
  const messages = await interaction.channel.messages.fetch({ limit: 100 });
  // Filter to bot messages only, and take the last N
  const botMessages = messages
    .filter(m => m.author.id === interaction.client.user.id)
    .first(amount);

  for (const msg of botMessages) {
    try {
      await msg.delete();
    } catch (e) {
      // Ignore errors (e.g., missing permissions)
    }
  }

  await interaction.editReply({ content: `Cleared the bot’s last ${botMessages.length} messages!` });
  return;
}
});

client.on('ready', async (c) => {
    console.log(`${c.user.username} is now ready!`);
    
    CheckEpicGames();
});


client.on("messageCreate", async (msg) =>
{
    const channelID = process.env.EPICGAMESCHANNELUPDATE;
    const channel = client.channels.cache.get(channelID);
    if(msg.author.bot) return;

    CheckChat(msg);
    
    // if(msg.author.globalName == "NardHodo")
    // {
    //     msg.reply("matulog ka na kinginamo");
    // }    

    // Emoji quiz answer check
    if (
      emojiQuiz.hasActiveQuiz() &&
      msg.content.startsWith("^") &&
      !msg.author.bot
    ) {
      if (await emojiQuiz.checkAnswer(msg.content)) {
        emojiQuizScores.recordAnswer(msg.author.id, true);
        const score = emojiQuizScores.getUserScore(msg.author.id);
        await msg.reply(`Correct! You guessed the meaning!\nYour score:${score.correct} ${score.wrong}`);
        emojiQuiz.clearQuiz();
      } else {
        emojiQuizScores.recordAnswer(msg.author.id, false);
        const score = emojiQuizScores.getUserScore(msg.author.id);
        await msg.reply(`Incorrect. Try again!\nYour score:${score.correct} ${score.wrong}`);
      }
      return;
    }
})

function EpicGamesMessageBuilder(title, thumbnail, description, date)
{
    let messageBuilder = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setURL('https://store.epicgames.com/en-US/free-games')
        .setImage(thumbnail)
        .setDescription(description)
    return messageBuilder;
}

client.login(process.env.TOKEN);