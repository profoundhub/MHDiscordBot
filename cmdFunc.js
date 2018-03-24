/*
To improve code readability, all bot commands will be wrapped around in a function
and the switch statement in the main file will call the function

This file will also contain helper functions 
*/

const cron = require('node-cron');

// This variable is used to store all the cronJobs
let cronJobArr = [];

module.exports = {
    /*******************
    * HELPER FUNCTIONS *
    ********************/

    // Prints to the console as well as replies to the user with the text
    show: function (msgObj, text) {
        msgObj.reply(text);
        console.log(text);
    },

    //A very common error message for invalid inputs
    printErrMsg: function (msgObj){
        msgObj.reply("Sorry, there seems to be an error in your input.");
    },

    printCommandList: function (msgObj){
        let tempStr = "Here are the current commands: \n```\n";
        for (let cmd in cmdList){
            tempStr += config.prefix + cmdList[cmd] + "\n";
        }
        tempStr += "```";
        msgObj.channel.send(tempStr);
    },

    /********************
    * COMMAND FUNCTIONS *
    *********************/

    /* !createCron Cron_Job_Name Message second minute hour day_of_month month day_of_week
    see link for instructions on the arguments:
    https://github.com/merencia/node-cron */
    createCronJob: function (msgObj, args){
        if (!args.validateArgs(7) && !args.validateArgs(8)){
            module.exports.printErrMsg(msgObj);
            return;
        }

        let cronVal = args.slice(2).join(' ');
        if (cron.validate(cronVal)){
            cronJobArr[args[0]] = cron.schedule(cronVal, function() {
                    msgObj.channel.send("@everyone " + args[1]);
                }, false);
            module.exports.show(msgObj, "created cron job: " + args[0]);
        } else {
            module.exports.printErrMsg(msgObj);
        }
    },

    // !startCronJob Cron_Job_Name
    startCronJob: function (msgObj, args){
        if (!args.validateArgs(1)){
            module.exports.printErrMsg(msgObj);
            return;
        }

        let CronName = args[0];
        if (CronName in cronJobArr){
            cronJobArr[CronName].start();
            module.exports.show(msgObj, CronName + " started.");
        } else {
            module.exports.show(msgObj, "The cron job " + CronName + " was not found.");
        }
    },

    // !stopCronJob Cron_Job_Name
    stopCronJob: function (msgObj, args){
        if (!args.validateArgs(1)){
            module.exports.printErrMsg(msgObj);
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