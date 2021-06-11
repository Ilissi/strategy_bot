const Telegraf = require('telegraf')

const messageFormat = require('../utils/message_format')
const userController = require('../contoller/user.Controller')
const strategyController = require('../contoller/strategy.Controller')
const keyboards = require('../keyboards/keyboards')

require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);

async function sendTP(ideaObject) {
    let title = 'Закрытие сделки по TP';
    let username = await userController.lookUpUser(ideaObject.id_telegram);
    let message = messageFormat.publishIdea(ideaObject, title, username[0].nickname);
    await strategyController.updateApprove(false, ideaObject.id);
    await bot.telegram.sendMessage(ideaObject.id_telegram, message, keyboards.takeProfit(ideaObject.id));
}

async function sendSL(ideaObject){
    let title = 'Закрытия сделки по SL';
    let username = await userController.lookUpUser(ideaObject.id_telegram);
    let message = messageFormat.publishIdea(ideaObject, title, username[0].nickname);
    await strategyController.updateApprove(false, ideaObject.id);
    await bot.telegram.sendMessage(ideaObject.id_telegram, message, keyboards.stopLoss(ideaObject.id));
}

async function averageIdea(ideaObject){
    let title = 'Усреднение';
    let username = await userController.lookUpUser(ideaObject.id_telegram);
    let message = messageFormat.publishIdea(ideaObject, title, username[0].nickname);
    await strategyController.updateApprove(false, ideaObject.id);
    await bot.telegram.sendMessage(ideaObject.id_telegram, message, keyboards.averageIdea(ideaObject.id));
}

module.exports = { sendTP, sendSL, averageIdea }