//Bring in config file
var config = require('./config.json');

/**
205811939861856257
!ok
NDcxMjEzNzkwNzMwMzg3NDg2.Dm4agQ.5DF0fH-oI-Akmo-9V_AErJo24Xo
sqfyniUqIc0qQSCJb-o3ec6PzxJhMt5l
AIzaSyB3jgopG-pE-hWZhC5MavzDAmwq3aVtkZE
**/

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
    prefix: config.prefix + ' ',
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

client.on('message', message => {

//Variables & Constants
var now = moment();
var tmcnt;
var target;
var mode;

//Make sure the object sending the message is allowed to use the bot
if (message.author.bot) return;
if (message.content.toLowerCase().indexOf(config.prefix) !== 0) return;

//Command and args setup
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();


//Commands
if (command === "test") {
  cError('Okay Google');
  cWarn('Okay Google');
  cPass('Okay Google');
  uError('Okay Google');
}

if (command === "help") {

}

});
