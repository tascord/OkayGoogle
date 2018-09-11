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
var chatCommands = [''];
var musicCommands = ["**Play** `[Url / Term]`\n Adds The URL / Search Term To The Queue", "**Skip** `[number]`\n  Skips One Song (or the specified ammount to skip)", "**Queue**\n Shows The Queue", "**Pause / Resume**\n Pauses Or Resumes Music Playback", "**Volume** `[Level]`\n Sets Playback Volume (0 - 200)", "**Leave**\n Removes The Bot From The Voice Channel", "**Clearqueue**\n Clears The Queue"];
var adminCommands = [''];

//Console Stylizing
function cError (parseError) {
  console.log(chalk.bgRed.bold('ERROR') + ' ' + parseError);
}

function cWarn (parseWarn) {
  console.log(chalk.bgYellow.bold('Warn') + ' ' + parseWarn);
}

function cPass (parsePass) {
  console.log(chalk.bgGreen.bold('Pass') + ' ' + parsePass);
}

function uError (uParseError) {
  console.log(chalk.bgMagenta.bold('User Error') + ' ' + uParseError);
}

//Startup Database
const sequelize = new Sequelize('database', 'Username', 'Password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'googleDB.sqlite',
});

const UserDataPS = sequelize.define('tags', {
    serverid: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    userid: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    warns: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    }
});

const ServerData = sequelize.define('tags', {
    serverid: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    ownerid: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    modlog: Sequelize.TEXT,
    servername: Sequelize.TEXT,
    swearfilter: Sequelize.TEXT
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
    UserDataPS.sync();
    ServerData.sync();
});

//Login
client.login(config.token);

client.on('message', async message => {
//Get Database Info
try {
const userDataa = await ServerData.findOne({ where: { serverid: message.member.guild.id } });
const serverDataa = await UserDataPS.findOne({ where: { serverid: message.member.guild.id } });
} catch (e) { }


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

//Used for testing
if (command === "test") {
  cError('Okay Google');
  cWarn('Okay Google');
  cPass('Okay Google');
  uError('Okay Google');
}

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
                   value: 'e'
               },
               {
                   name: "Music Commands",
                   value: musicCommands.join('\n')
               },
               {
                   name: "Admin Commands",
                   value: 'e'
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
  if (serverDataa) {
   const embed = new Discord.RichEmbed()
     .setTitle("Kick Log")
     .setColor(0xdf2f35)
     .addField("Member Kicked", `${member.user.tag}`, true)
     .addField("Kicked By", `${message.author.tag}`, true)
     .addField("Reason", `${reason}`, true);
     return message.guild.channels.find("name", serverDataa.get('modlog')).send({ embed });
   }
 } catch (e) { return message.reply(`Member Kicked. Set up the servrer to have a kick message shown! ${config.prefix}setup`); }

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
  if (serverDataa) {
   const embed = new Discord.RichEmbed()
     .setTitle("Ban Log")
     .setColor(0xdf2f35)
     .addField("Member Kicked", `${member.user.tag}`, true)
     .addField("Kicked By", `${message.author.tag}`, true)
     .addField("Reason", `${reason}`, true);
     return message.guild.channels.find("name", serverDataa.get('modlog')).send({ embed });
   }
 } catch (e) { return message.reply(`Member Banned. Set up the servrer to have a kick message shown! ${config.prefix}setup`); }

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

//Setup Command
if (command === "setup") {
    try {
        const ServerDatab = await ServerData.create({
            serverid: message.member.guild.id,
            ownerid: message.member.guild.ownerID,
            modlog: `None Set. Go to the modlog channel and type ${config.prefix}modlog`,
            servername: message.member.guild.name,
            swearfilter: "true",
        });
        return message.reply(`Server ${tag.servername} added.`);
    }
    catch (e) {
      cError(`Error saving data to database, possible data corruption! Error Name: ${e.name}`);
      message.reply('Error saving data.');
    }
}

});
