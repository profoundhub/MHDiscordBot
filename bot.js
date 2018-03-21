// TODO:
// only admins allowed to work with cron jobs
// !commands should describe commands. Store this in the cmdList array.


// require is like an import in python
// Someone wrote this library to use the discord api.
const Discord = require('discord.js');
const client = new Discord.Client();

// external modules
const cron = require('node-cron');

// local files
const config = require('./config.json');

const pre = config.prefix;

// Prints "I am ready" when the bot is on
client.on('ready', () => {
    console.log('I am ready!');
});

// An array of all the commands.
// Adding another layer is useful to have more descriptive/longer variable names,
// but still have a short command for the user.
// This is also used to list all the commands to the user.
let cmdList = {
    commandList: "commands",
    createCron: "createCronJob",
    startCron: "startCronJob",
    stopCron: "stopCronJob"
};

// This variable is used to store all the cronJobs
let cronJobArr = [];


// Watches the messages in chat
client.on('message', (message) => {
    // prevents wasting bot resources on messages that don't have the prefix, or on other bots
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot)
        return;

    // Stores the commands/arguments in easily accessible variables
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    // Allows us to call "validateArgs" to validate the number of arguments for a command
    args.validateArgs = function(count){
        if (this.length == count)
            return true;
        else
            return false;
    }

    // example response
    // TODO: use switch statement for commands for efficiency
    if (command === 'ping'){
        message.reply('pong');
    } else if(command === cmdList.commandList){
        let tempStr = "Here are the current commands: \n```\n";
        for (let cmd in cmdList){
            tempStr += config.prefix + cmdList[cmd] + "\n";
        }
        tempStr += "```";
        message.channel.send(tempStr);
    } else if (command === cmdList.createCron){
        /*
        !createCron Cron_Job_Name Message second minute hour day_of_month month day_of_week
        see link for instructions on the arguments:
        https://github.com/merencia/node-cron
        */
        if (!args.validateArgs(7) && !args.validateArgs(8)){
            printErrMsg(message);
            return;
        }

        let cronVal = args.slice(2).join(' ');
        if (cron.validate(cronVal)){
            cronJobArr[args[0]] = cron.schedule(cronVal, function() {
                    message.channel.send("@everyone " + args[1]);
                }, false);
            print(message, "created cron job: " + args[0]);
        } else {
            printErrMsg(message);
        }
    } else if (command === cmdList.startCron){
        //!startCronJob Cron_Job_Name
        if (!args.validateArgs(1)){
            printErrMsg(message);
            return;
        }

        let CronName = args[0];
        if (CronName in cronJobArr){
            cronJobArr[CronName].start();
            print(message, CronName + " started.");
        } else {
            print(message, "The cron job " + CronName + " was not found.");
        }
    } else if (command === cmdList.stopCron){
        // !stopCronJob Cron_Job_Name
        if (!args.validateArgs(1)){
            printErrMsg(message);
            return;
        }

        let CronName = args[0];
        if (CronName in cronJobArr){
            cronJobArr[CronName].stop();
            print(message, CronName + " stopped.");
        } else {
            print(message, "The cron job '" + CronName + "' was not found.");
        }
    } else {
        printErrMsg(message);
    }
});

/*
A very common error message for invalid inputs
*/
function printErrMsg(message){
    message.reply("Sorry, there seems to be an error in your input.");
}

/*
Prints to the console as well as replies to the user with the text
*/
function print(message, text) {
    message.reply(text);
    console.log(text);
}

// makes the bot go online
client.login(config.token);
