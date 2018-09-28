//Bring in config file
var config = require('./config.json');

//Setup Modules
const Discord = require('discord.js');
const client = new Discord.Client();
const Sequelize = require('sequelize');
const chalk = require('chalk');
const Music = require('discord.js-musicbot-addon');
var opus = require('opusscript');
var moment = require('moment-timezone');
var moment = require('moment');
moment().format();
moment().tz("Australia/Melbourne").format();

//Variables
var googleColours = ['0x4681f3', '0xdf2f35', '0xf6c400', '0x477ff5', '0x36bc50', '0xdf2f35'];
var chatCommands = ['**Coin**\n Flip a coin!', '**Echo**\n Copy whatever you say!'];
var musicCommands = ["**Play** `[Url / Term]`\n Adds The URL / Search Term To The Queue", "**Skip** `[Number]`\n Skips One Song (or the specified ammount to skip)", "**Queue**\n Shows The Queue", "**Pause / Resume**\n Pauses Or Resumes Music Playback", "**Volume** `[Level]`\n Sets Playback Volume (0 - 200)", "**Leave**\n Removes The Bot From The Voice Channel", "**Clearqueue**\n Clears The Queue"];
var adminCommands = ['**Setup**\n Setup the servers settings. These can be modified after setup', '**Ban / Kick** `[User] [Reason]`\n Punishes the given user for the given reason', '**Ci** `[Value]`\n Clears the amount of messages you specify'];

//Login the bot
client.login(config.token);

//Console Stylizing
function cError (parseError) {
  console.log(chalk.bgRed.bold('ERROR') + ' ' + parseError);
}

function cWarn (parseWarn) {
  console.log(chalk.bgYellow.bold('Warn') + ' ' + parseWarn);
}

function cInfo (parseInfo) {
  console.log(chalk.bgGreen.bold('Info') + ' ' + parseInfo);
}

function uError (uParseError) {
  console.log(chalk.bgMagenta.bold('User Error') + ' ' + uParseError);
}

//Startup Database
const sequelize = new Sequelize('serverDatabase', 'Username', 'Password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'serverData.sqlite',
});

const serverData = sequelize.define('serverDataTable', {
    serverid:{
        type: Sequelize.INTEGER,
        unique: true,
    },
    ownerid: Sequelize.INTEGER,
    modlog: Sequelize.TEXT,
    servername: Sequelize.TEXT,
    welcomemessage: Sequelize.TEXT
});

//Musicbot
Music.start(client, {
    prefix: config.prefix,
    maxQueueSize: "100",
    disableLoop: false,
    enableQueueStat: true,
    leaveCmd: 'leave',
    ownerOverMember: true,
    botOwner: config.ownerid,
    youtubeKey: config.ytapi
});

//On Bot Startup
client.once('ready', () => {
    console.log(`${chalk.cyan(`\nOkay, `)}${chalk.cyan.bold(`${client.user.tag}!\n`)}`);
    serverData.sync();
});

//When user joins guild send them welcome message if avaliable
client.on("guildMemberAdd", async member => {

  try {
    const guildWelcome = await serverData.findOne({ where: { serverid: message.member.guild.id } });
  } catch (e) { }

});

//Commands
client.on('message', async message => {

if(!message.member.hasPermission("EMBED_LINKS") || !message.member.hasPermission("MANAGE_MESSAGES")) {
if(message.content.toLowerCase().includes('www.') || message.content.toLowerCase().includes('http')) {
message.delete();
message.reply("Please no URLS in chat");
}
}



//Variables & Constants
var now = moment();
var tmcnt;
var target;
var mode;

//Colour
var currentColour = googleColours[Math.floor(Math.random() * googleColours.length)];

//Make sure the object sending the message is allowed to use the bot
if (message.author.bot) return;
if (message.content.toLowerCase().indexOf(config.prefix) !== 0) return;

//Command and args setup
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

//Commands
var issue;

//Help command
if (command === "help") {
       message.channel.send({
           embed: {
               color: parseInt(currentColour),
               author: {
                   name: client.user.username,
                   icon_url: client.user.avatarURL
               },
               description: `**Help For ${client.user.tag}**`,
               fields: [{
                   name: "Chat Commands",
                   value: chatCommands.join('\n')
               },
               {
                   name: "Music Commands",
                   value: musicCommands.join('\n')
               },
               {
                   name: "Admin Commands",
                   value: adminCommands.join('\n')
               },
               {
                   name: "Bug Reporting",
                   value: "**Report** `[command] [issue, including how to replicate]`\n E.g: Report help dosn't show help."
               }
               ]
           }
       });
   }


//Report Command
if (command === "report"){
  if(!args || !args[0] || !args[1]){
    message.channel.send("Please Provide The Command, Issue & How To Replicate It.")
  } else {
    issue = args.splice(1).join(' ');
    message.channel.send("Issue Reported!");
    client.users.get(config.ownerid).send(`Issue Report From ${message.author.tag}. Command: ${args[0]}, Issue: ${issue}`);
    uError(`Issue Report From ${message.author.tag}. Command: ${args[0]}, Issue: ${issue}`);
  }
}

//Kick Command
if (command === "kick") {

if (!message.member.hasPermission("KICK_MEMBER"))
  return message.reply(`You don't have permission!`);
let member = message.mentions.members.first();
if(!member)
 return message.reply(`Invalid User!`);
if(!member.bannable)
 return message.reply(`Can't Kick User. They may have higher perms than me, or I might not have permission to kick.`);
 let reason = args.slice(1).join(' ');
if(!reason) reason = "The Kicking Boot Has Speeked!";
 await member.kick(reason)
 .catch(error => message.reply(`${error}`));
 try {
  if (serverDataTMP) {
   const embed = new Discord.RichEmbed()
     .setTitle("Kick Log")
     .setColor(0xdf2f35)
     .addField("Member Kicked", `${member.user.tag}`, true)
     .addField("Kicked By", `${message.author.tag}`, true)
     .addField("Reason", `${reason}`, true);
     return message.guild.channels.find("name", serverDataTMP.get('modlog')).send({ embed });
   }
 } catch (e) { return message.reply(`Member Kicked. Set up the server to have a kick message shown! ${config.prefix}setup`); }

}

//Ban Command
if (command === "ban") {

if (!message.member.hasPermission("BAN_MEMBER"))
  return message.reply(`You don't have permission!`);
let member = message.mentions.members.first();
if(!member)
 return message.reply(`Invalid User!`);
if(!member.bannable)
 return message.reply(`Can't Ban User. They may have higher perms than me, or I might not have permission to ban.`);
 let reason = args.slice(1).join(' ');
if(!reason) reason = "The Ban Hammer Has Spoken!";
 await member.ban(reason)
 .catch(error => message.reply(`${error}`));
 try {
  if (serverDataTMP) {
   const embed = new Discord.RichEmbed()
     .setTitle("Ban Log")
     .setColor(0xdf2f35)
     .addField("Member Kicked", `${member.user.tag}`, true)
     .addField("Kicked By", `${message.author.tag}`, true)
     .addField("Reason", `${reason}`, true);
     return message.guild.channels.find("name", serverDataTMP.get('modlog')).send({ embed });
   }
 } catch (e) { return message.reply(`Member Banned. Set up the server to have a ban message shown! ${config.prefix}setup`); }

}

//Coinflip command
if (command === "coin") {
    var flipres = Math.random() * (100 - 1) + 1;
    if (flipres > 51) {
        message.channel.send("**Heads!**");
    } else if (flipres < 49) {
        message.channel.send("**Tails!**");
    } else {
        message.channel.send("**It Landed On The Side!**");
    }
}

//Server data setup Command
if (command === "setup") {
    try {
        const serverDataSetup = await serverData.create({
            serverid: message.member.guild.id,
            ownerid: message.member.guild.ownerID,
            modlog: `None Set. Go to the modlog channel and type ${config.prefix}settings set modlog`,
            servername: message.member.guild.name,
            welcomemessage: `Hello, Welcome to ${message.member.guild.name}!`,
        });
        return message.reply(`Server ${serverDataSetup.servername} added.`);
        cInfo(`New Server Added To Database: ${serverDataSetup.servername}`);
    }
    catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return message.reply(`This server already has data. Run ${config.prefix}data to see it.`);
        }
        message.reply('Something went wrong with adding the server data.');
    }
}

//Server data recalling and re-setting command command
if (command === "settings") {
if (!args[0]) {
  try {
    serverDataTMP = await serverData.findOne({ where: { serverid: message.member.guild.id } });
    if (serverDataTMP) {
        const embed = new Discord.RichEmbed()
        .setTitle(`${serverDataTMP.get('servername')} Stored Data`)
        .setColor(currentColour)
        .addField(`Server Name:`, `${serverDataTMP.get('servername')} `)
        .addField(`Server ID:`, `${serverDataTMP.get('serverid')} `)
        .addField(`ModLog Channel:`, `#${serverDataTMP.get('modlog')} `)
        .addField(`Welcome Message:`, `${serverDataTMP.get('welcomemessage')} `)
        .addField(`Owner ID:`, `${serverDataTMP.get('ownerid')} `);
        return message.channel.send({embed});
      }
    } catch (e) {
      message.reply(`Could not find any server info!`);
    }
} else if (args[0] === "set") {

} else {
  message.reply(`Invalid Command Arguments. E.g \`${config.prefix}settings set modlog\``);
}

}

//Echo command
if (command === "echo") {
  if (!args[0]) return message.reply("No message provided");
  message.channel.send(args.join(' ') + '˖');
}

//Clear chat command
if (command === "ci") {
  if (!args[0]) return message.reply("Please specify an amount of messages to remove");
  if (args[0].isNaN) return message.reply("Value provided is not a number");
  if (args[0] >= 100) return message.reply("Value must be less than 100");

  let messagecount = parseInt(args[0]);
  message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
  message.reply(`:recycle: Cleared ${args[0]} messages.`);

}

});
