/* To improve code readability, all bot commands will be wrapped around in a function
and the switch statement in the main file will call the function

This file will also contain helper functions
*/

const cron = require('node-cron');

// TODO: use SQLite
// This variable is used to store all the cronJobs. If the bot is turned off, all current jobs will be deleted.
let cronJobArr = [];

module.exports = {
    /*******************
    * HELPER FUNCTIONS *
    ********************/

    // Prints to the console as well as replies to the user with the text
    show: function (msgObj, text) {
        if (msgObj.type === 'text')
            msgObj.send(text)
        else if (msgObj === 'DEFAULT')
            msgObj.reply(text);
        console.log(text);
    },

    // common error message for invalid inputs
    errInput: function (msgObj) {
        msgObj.reply("Sorry, there seems to be an error in your input.");
    },

    // common error message for invalid permissions
    errPermission: function (msgObj) 
        msgObj.reply("insufficient permissions to use this command.");
    },


    /********************
    * COMMAND FUNCTIONS *
    *********************/

    printCommandList: function (msgObj) {
        let tempStr = "Here are the current commands: \n```\n";
        for (let cmd in cmdList){
            tempStr += config.prefix + cmdList[cmd] + "\n";
        }
        tempStr += "```";
        msgObj.channel.send(tempStr);
    },

    /* !createCron Cron_Job_Name minute hour day_of_month month day_of_week Message
    e.g. !createCron test * * * * * This message will display every minute
    see link for instructions on the arguments:
    https://github.com/merencia/node-cron */

    createCronJob: function (msgObj, args){
        if (args.length < 7){
            module.exports.errInput(msgObj);
            return;
        }

        let cronName = args[0];

        // Ensure job has not already been created
        if (cronName in cronJobArr){
            if (msgObj.type === 'DEFAULT') {
                module.exports.show(msgObj, "There is already a job named " + cronName);
            } else if (msgObj.type === 'text'){
                console.log("There is already a job named " + cronName);
            }
            return;
        }

        let cronVal = args.slice(1, 6).join(' ');
        let cronMsg = args.slice(6).join(' ');
        if (cron.validate(cronVal)){
            if (msgObj.type === 'DEFAULT'){
                cronJobArr[cronName] = cron.schedule(cronVal, function() {
                    msgObj.channel.send(cronMsg);
                }, false);
                module.exports.show(msgObj, "created cron job: " + cronName);
            } else if (msgObj.type === 'text'){
                cronJobArr[cronName] = cron.schedule(cronVal, function() {
                    msgObj.send(cronMsg);
                }, true);
                console.log("Created and started cron job: " + cronName);
            }
        } else {
            module.exports.errInput(msgObj);
        }
    },

    // !startCronJob Cron_Job_Name
    startCronJob: function (msgObj, args) {
        if (args.length != 1){
            console.log(args.length);
            module.exports.errInput(msgObj);
            return;
        }

        let CronName = args[0];
        if (CronName in cronJobArr) {
            cronJobArr[CronName].start();
            module.exports.show(msgObj, CronName + " started.");
        } else {
            module.exports.show(msgObj, "The cron job " + CronName + " was not found.");
        }
    },

    // !stopCronJob Cron_Job_Name
    stopCronJob: function (msgObj, args) {
        if (args.length != 1){
            module.exports.errInput(msgObj);
            return;
        }

        let CronName = args[0];
        if (CronName in cronJobArr){
            cronJobArr[CronName].stop();
            module.exports.show(msgObj, CronName + " stopped.");
        } else {
            module.exports.show(msgObj, "The cron job '" + CronName + "' was not found.");
        }
    }
};
