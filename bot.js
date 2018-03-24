// TODO:
// !commands should describe commands. Store this in the cmdList array.
// Which channel does the bot type to? It repsonds to where the command was created. have parameter to specify specific channel

// Someone wrote this library to use the discord api.
const Discord = require('discord.js');
const client = new Discord.Client();

/* external modules */


/* local files */
const config = require('./config.json'); // contains prefix and token
const cmdFunc = require('./cmdFunc.js'); // contains all the functions called in core switch statement

const pre = config.prefix;

// Prints "I am ready" when the bot is on
client.on('ready', () => {
    console.log('I am ready!');
});

/* An array of all the commands.
Adding another layer is useful to have more descriptive/longer variable names,
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

    // Helper function to verify the number of arguments in the user's input was correct.
    args.validateArgs = function(count){
        if (this.length == count)
            return true;
        else
            return false;
    }

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
            errInput(msgObj);
    }
});

// makes the bot go online
client.login(config.token);
