//Get config.json
const config = require('./config.json');

//Require, Instantiate & Login Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(config.token);

//Musicbot
const ytdl = require('ytdl-core')
var opus = require('opusscript');
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyClGTsC0x4-n-RJCSEGV63dlWVsGzQjltU');
var servers = [];

/** Bot Prefs **/

var chatCommands = ["None yet!"];
var musicCommands = ["None Yet!"];
var adminCommands = ["None yet!"];

var overideIds = [];

/** End Bot Prefs **/

//On bot ready
client.once('ready', () => {
  console.log(`Logged In As: ${client.user.tag}`);
  client.user.setActivity(`for commands (${config.prefix})`, {type: "WATCHING"});
});

//When a message is received
client.on('message', async message => {
  //Make sure the account running a command is a user
  if(message.author.bot) return;

  //Make Sure Message Has Prefix
  if (message.content.toLowerCase().indexOf(config.prefix) !== 0) return;

  //Split the message into commands and arguments
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const argsString = args.slice(1).join(' ');
  const command = args.shift().toLowerCase();

  if (!servers[message.member.guild.id]) servers[message.member.guild.id] = {queue: [], loop: false};
  var server = servers[message.member.guild.id];

  function playSong(connection, message) {
  
    server.dispacher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
    server.current = server.queue[0]; 
  
    if (server.loop == false) server.queue.shift();
  
    server.dispacher.on("end", function(message) {
      if(server.queue[0]) {
        playSong(connection);
        message.member.voiceChannel.join().then(function(connection) { playSong(connection) });
      }
      else {
        connection.disconnect();
        server.current;
      }
    })
  
  }

  switch (command) {
    //Test command
    case "test":
      console.log(server.dispacher);
      break;
    //Help command
    case "help": 
      var embed = new Discord.RichEmbed()
        .setTitle(`**${client.user.username} Help**\nBot prefix is '${config.prefix}'`)
        .setColor(0xff006a)
        .addField('Ch at Commands', chatCommands.join('\n'))
        .addField('Music Commands', musicCommands.join('\n'))
        .addField('Admin Commands', adminCommands.join('\n'));
      message.channel.send({ embed });
      break;

    //Musicbot commands
    case "play":
    
      if (!args[0]) return message.reply("Invalid URL / Search Term Provided");
      if (!message.member.voiceChannel) return message.reply("**You Aren't In A Voice Channel**");

      if (args[0].indexOf('youtube.com/watch?v=') > -1) {

        var searchTerm = args[0].slice(args[0].search("/watch") + 9);
        var title = "Searching with URL";

      } else {

        var searchTerm = args.join(" ");
        if (args.join(" ").length > 15) {
          var title = `Searching For: "${args.join(" ").slice(0, 20)}..."`;
        } else {
          var title = `Searching For: "${args.join(" ")}"`;
        }
      }

        youTube.search(searchTerm, 2, function(error, result) {

          if (!result.items[0]) return message.reply("Search Failed. Either Invalid URL Provided Or No Results Found");

          var hit = result.items[0].snippet;

          var songTitle = hit.title;

          var embed = new Discord.RichEmbed()
            .setTitle(title)
            .setColor(0xff006a)
            .setThumbnail(hit.thumbnails.default.url)
            .addField("Title:", songTitle)
            .addField("Channel:", hit.channelTitle)
            .addField("Link:", `https://www.youtube.com/watch?v=${result.items[0].id.videoId}`)
            message.channel.send({ embed });

            server.queue.push(`https://www.youtube.com/watch?v=${result.items[0].id.videoId}`);

            if (!message.guild.voiceConnection) {
              message.member.voiceChannel.join()
                .then(function(connection) {
                playSong(connection, message);
                var embed = new Discord.RichEmbed()
                  .setTitle(":headphones: Queue updated")
                  .setColor(0xff006a)
                  .addField("Added to queue:", songTitle)
                message.channel.send({ embed });
              })
            }

      });

      break;
      
    case "skip":
      if(server.loop) return message.reply("Looping is enabled! Disable before skipping");
      if(server.current) {
        var embed = new Discord.RichEmbed()
          .setTitle(":track_next: Song skipped")
          .setColor(0xff006a)
        message.channel.send({ embed });
        server.dispacher.end();
      } else {
        message.channel.send("Nothing is playing!");
      }  
        
      break;
    
    case "loop":
      if(server.loop == false) server.loop = true;
      else server.loop = false;
      var embed = new Discord.RichEmbed()
        .setTitle(`:repeat_one: Looping is now **${server.loop}**`)
        .setColor(0xff006a)
      message.channel.send({ embed });
      break;

    case "summon":
      if(!message.member.voiceChannel) return message.reply("You're not in a voice channel!");
      if(!server.current) return message.reply('Im not playing anything!');
      try { message.member.voiceChannel.join(); } catch (e) {return message.reply('Error joing channel! Likely no permission')}
      var embed = new Discord.RichEmbed()
      .setTitle(`:headphones: Joined **${message.member.voiceChannel.name}**`)
      .setColor(0xff006a)
      message.channel.send({ embed });
      break;

    case "queue":
      if(!server.current) return message.reply('Nothing is playing');
      if(!server.queue[0]) {
        var embed = new Discord.RichEmbed()
          .setTitle(`:headphones: ${message.member.guild.name}'s Queue`)
          .addField("Currently playing:" `[](${server.current})`)
          .setColor(0xff006a)
        }
      break;
  }
});