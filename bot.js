// TODO:
// !commands should describe commands. Store this in the cmdList array.
// Which channel does the bot type to? It repsonds to where the command was created. have parameter to specify specific channel

// Someone wrote this library to use the discord api.
const Discord = require('discord.js');
const client = new Discord.Client();

/* local files */
const config = require('./config.json'); // contains prefix and token
const cmdFunc = require('./cmdFunc.js'); // contains all the functions called in core switch statement

const ANNOUNCEMENT_CHANNELID = '402209944658772000';

// Use this to start up scripts to be run by the bot.
// Do not use this for technical details of the bot.
function startupCommands(){
    let msgObj;
    let args;

    // Weekly reminder for Saturday FCC meeting.
    msgObj = client.channels.get(ANNOUNCEMENT_CHANNELID);
    args = "MarkhamFCCReminder * 19 * * wed,fri Friendly reminder that we will be having our usual meetup at 10am-1pm this Saturday at the Aaniin Community Centre. Hope to @everyone there!".split(' ');
    cmdFunc.createCronJob(msgObj, args);
}

// Prints "I am ready" when the bot is on
client.on('ready', () => {
    console.log('I am ready!');
    startupCommands();
});

/* An array of all the commands.
Having this list is useful to have more descriptive/longer variable names,
but still have a short command for the user.
This is also used to list all the commands to the user.
*/
let cmdList = {
    commandList: "commands",
    createCron: "createCronJob",
    startCron: "startCronJob",
    stopCron: "stopCronJob"
};

/* This is a list of roles in the discord server.
If the roles change in the discord server, this list will need to be updated
*/
let roles = {
    Admin: "Admin"
}

function verifyRole(msgObj, role){
    return msgObj.member.roles.find("name", role);
}

// Watches the messages in chat
client.on('message', (msgObj) => {
    // prevents wasting bot resources on messages that don't have the prefix, or on other bots
    if (msgObj.content.indexOf(config.prefix) !== 0 || msgObj.author.bot)
        return;

    // Stores the commands/arguments in easily accessible variables
    const args = msgObj.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    switch (command){
        case 'ping': // Example response
            msgObj.reply('pong');
            break;

        case cmdList.commandList:
            cmdFunc.printCommandList(msgObj, args);
            break;

        case cmdList.createCron:
            !verifyRole(msgObj, roles.Admin) ? cmdFunc.errPermission(msgObj) : cmdFunc.createCronJob(msgObj, args);
            break;

        case cmdList.startCron:
            !verifyRole(msgObj, roles.Admin) ? cmdFunc.errPermission(msgObj) : cmdFunc.startCronJob(msgObj, args);
            break;

        case cmdList.stopCron:
            !verifyRole(msgObj, roles.Admin) ? cmdFunc.errPermission(msgObj) : cmdFunc.stopCronJob(msgObj, args);
            break;

        default:
            cmdFunc.show(msgObj, command + " is not a valid command.");
    }
});

// makes the bot go online
client.login(config.token);
