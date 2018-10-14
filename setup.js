//Prerequisites
var Enquirer = require('enquirer');
var enquirer = new Enquirer();
const fs = require('fs');

//Start
enquirer.question('botname', 'Bot Name (only modifys name shown on website): ');
enquirer.question('owner', 'OwnerID: ');
enquirer.question('prefix', 'Bot Prefix (No Spaces): ');
enquirer.question('token', 'Bot Token: ');
enquirer.question('secret', 'Bot Secret: ');
enquirer.question('ytapi', 'YouTube Api Key: ');
enquirer.question('filedel', 'A config file already exists. Delete it? (Y/N)');



function runQuestions () {

  enquirer.ask('botname')
    .then(function(ouput) {
  enquirer.asl('owner')
    .then(function(ouput) {
  enquirer.ask('prefix')
    .then(function(output) {
  enquirer.ask('token')
    .then(function(output) {
  enquirer.ask('secret')
    .then(function(output) {
  enquirer.ask('ytapi')
    .then(function(output) {
var config = `{
"ownerid": "${output.owner}",
"prefix": "${output.prefix}",
"token": "${output.token}",
"secret": "${output.secret}",
"ytapi": "${output.ytapi}"
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
}


if (fs.existsSync('./config.json')) {
console.log("The file config.js already exists. Please remove this file, then continue");
process.exit(0);
} else {
runQuestions();
}
