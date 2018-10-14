//Prerequisites
var Enquirer = require('enquirer');
var enquirer = new Enquirer();
const fs = require('fs');

//Start
enquirer.question('owner', 'OwnerID: ');
enquirer.question('prefix', 'Bot Prefix (No Spaces): ');
enquirer.question('token', 'Bot Token: ');
enquirer.question('ytapi', 'YouTube Api Key: ');
enquirer.question('dashboard', "Would you like to use the admin dashboard (Type 'yes' or anything else for no)");
enquirer.question('secret', 'Bot Secret: ');
enquirer.question('clientid', 'Client ID: ');
enquirer.question('redirecturi', 'Redirect URI: ');
enquirer.question('oauthurl', 'OAUTH URL: ');
enquirer.question('filedel', 'A config file already exists. Delete it? (Y/N)');

function runQuestions () {

  enquirer.ask('ytapi')
    .then(function(output) {
  enquirer.ask('owner')
    .then(function(output) {
  enquirer.ask('prefix')
    .then(function(output) {
  enquirer.ask('token')
    .then(function(output) {
  enquirer.ask('dashboard')
    .then(function(output) {
      if(output.dashboard != "yes") {
        var config = `{
"ytapi": "${output.ytapi}",
"ownerid": "${output.owner}",
"prefix": "${output.prefix}",
"token": "${output.token}"
}`;

      fs.writeFile('./config.json', config, (err) => {
        if (err) throw err;
      console.log('The config has been generated!');
      process.exit(0);
      });
    }
  enquirer.ask('secret')
    .then(function(output) {
  enquirer.ask('clientid')
    .then(function(output) {
  enquirer.ask('redirecturi')
    .then(function(output) {
  enquirer.ask('oauthurl')
    .then(function(output) {


var config = `{
"ytapi": "${output.ytapi}",
"ownerid": "${output.owner}",
"prefix": "${output.prefix}",
"token": "${output.token}",
"secret": "${output.secret}",
"clientid": "${output.clientid}",
"redirecturi": "${output.redirecturi}",
"oauthurl": "${output.oauthurl}"
}`


fs.writeFile('./config.json', config, (err) => {
  if (err) throw err;
console.log('The config has been generated!');


});
});
});
});
});
});
});
});
});
});
}


if (fs.existsSync('./config.json')) {
console.log("The file config.js already exists. Please remove this file, then continue");
process.exit(0);
} else {
runQuestions();
}
