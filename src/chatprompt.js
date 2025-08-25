const { GetCurrentSchedule } = require("./schedulechecker.js");

function CheckChat(msg)
{
    if(msg.content.toLowerCase() == 'lig' && msg.author.globalName == "MaxXx")
    {
        let i = 0;
        let messages = ["LEAGUE", "NA", "MGA", "BOBO", "MAY", "URF OH", "@everyone"];
        const clk = setInterval(()=>{
            if(i >= messages.length) return;
            msg.channel.send(messages[i]);
            i++;
        },Math.floor(Math.random() * 5000))
    }
    if(msg.content.toLowerCase() == "ggs" || msg.content.toLowerCase() == "gg")
    {
        msg.channel.send("ggs");
    }
    if(msg.content.toLowerCase() == "laro")
    {
        msg.channel.send("laro daw @everyone");
    }
    if(msg.content.toLowerCase() == "sup")
    {
        msg.channel.send("sup mah nigga");
    }
}

module.exports = {CheckChat}