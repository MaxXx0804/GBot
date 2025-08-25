require('dotenv').config();

const { Client, IntentsBitField, EmbedBuilder, Events} = require("discord.js");
const { EpicFreeGames } = require('epic-free-games');
const { GetCurrentSchedule, GetNextSchedule } = require("./schedulechecker.js");
const { CheckChat } = require("./chatprompt.js");

const postedGameTitles = new Set();

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
});

client.on('ready', async (c) => {
    console.log(`${c.user.username} is now ready!`);
    
    CheckEpicGames();
});


client.on("messageCreate", async (msg)=>
{
    const channelID = process.env.EPICGAMESCHANNELUPDATE;
    const channel = client.channels.cache.get(channelID);
    if(msg.author.bot) return;

    CheckChat(msg);
    
    // if(msg.author.globalName == "NardHodo")
    // {
    //     msg.reply("matulog ka na kinginamo");
    // }    
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