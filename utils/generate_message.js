const Telegraf = require('telegraf')
const userController = require('../contoller/user.Controller')
const gradeController = require('../contoller/grade.Controller')
const strategyController = require('../contoller/strategy.Controller')
const Keyboards = require('../keyboards/keyboards')
const messageFormat = require('../utils/message_format')
const utils = require('../utils/message_format')

const bot = new Telegraf(process.env.BOT_TOKEN)
require('dotenv').config()


const registerUser = async (ctx) => {
    const user_id = ctx.message.from.id;
    const username = ctx.message.from.username;
    await userController.addUser(user_id, username, 'unregister');
    const admins = await userController.getUsers('Администратор');
    let action = 'updateStatus'
    for (let i=0; i<admins.length; i++) {
        await bot.telegram.sendMessage(admins[i].id_telegram, `Привет! Новый пользователь пытается зарегистрироваться!\n` +
            `Для подтверждения регистрации пользователя @${username} нажмите кнопку!`, Keyboards.addUser(action, user_id));
    }
};


async function userRegister (ctx, user_id, permissions, admin_id, message, notification_message){
    if (permissions == 'Отклонить') {
        await userController.updateStatus(user_id, permissions);
        await bot.telegram.sendMessage(user_id, 'Администратор отклонил Вашу регистрацию');
    } else {
        await userController.updateStatus(user_id, permissions);
        await bot.telegram.sendMessage(user_id, `${message} Вы - ${permissions}.`);
    }
    ctx.deleteMessage();
    await notificationAdmin(ctx, user_id, admin_id, notification_message);
    ctx.reply('Действие подтверждено!');
}


const updateUser = async (ctx, message, admin_id) => {
    let response = message.split(' ');
    let user_id = response[1];
    let permissions = response[2];
    let user = await userController.lookUpUser(user_id);
    if (user[0].permissions == 'unregister') {
        let user_message = 'Администратор подтвердил Вашу регистрацию.';
        let notification_message = `Привет! Новый пользователь @${user[0].nickname} зарегистрирован!`;
        await userRegister(ctx, user_id, permissions, admin_id, user_message, notification_message);
    }
    else {
        let user_message = 'Администратор изменил Ваши права.';
        let notification_message = `Привет! Права пользователя @${user[0].nickname} изменены!`;
        await userRegister(ctx, user_id, permissions, admin_id, user_message, notification_message);
    }
}


const notificationAdmin = async (ctx, user_id, admin_id, notification_message) =>{
    let admins = await userController.getUsers('Администратор');
    for (let i=0; i<admins.length; i++) {
        if (admins[i].id_telegram != admin_id) {
            await bot.telegram.sendMessage(admins[i].id_telegram, notification_message,
                Keyboards.changePermissions(user_id));
        }
    }
}


const sendIdea = async (ctx, message, idea_uuid, ticker) => {
    const riskManagers = await userController.getUsers('Риск-менеджер');
    for (let i = 0; i < riskManagers.length; i++) {
        await bot.telegram.sendMessage(riskManagers[i].id_telegram, message, Keyboards.acceptGrade(idea_uuid, ticker));
    }
    await setTimeout(notificationAlert, 1 * 60000, ctx, idea_uuid)
    await setTimeout(notificationFinish, 2 * 60000, ctx, idea_uuid)
}


const notificationAlert = async (ctx, idea_uuid) => {
    const getStrategyApprove = await strategyController.checkApprove(idea_uuid);
    if (getStrategyApprove.length == 0) {
        const riskManagers = await userController.getUsers('Риск-менеджер');
        const approveRiskManagers = await gradeController.returnManagersApproved(idea_uuid)
        let alertManager = utils.generateList(riskManagers, approveRiskManagers)
        let message = 'Осталось 15 минут для оценки идеи'
        for (let i = 0; i < alertManager.length; i++){
            await bot.telegram.sendMessage(alertManager[i].id_telegram, message)
        }
    }
}


const notificationFinish = async (ctx, idea_uuid) => {
    const getStrategyApprove = await strategyController.checkApprove(idea_uuid);
    if (getStrategyApprove.length == 0){
        await strategyController.updateApprove(true, idea_uuid);
        await returnGrades(ctx, idea_uuid)
    }
}


const returnGrades = async (ctx, idea_uuid) => {
    const grades = await gradeController.returnGrades(idea_uuid);
    const idea = await strategyController.getStrategyByUUID(idea_uuid);
    let idea_message = messageFormat.generate_message_alert(idea_uuid, idea[0].ticker, idea[0].type, idea[0].order_type,
        idea[0].percent, idea[0].entry_price, idea[0].tp, idea[0].sl, idea[0].timemodifier, idea[0].source, idea[0].risk,
        idea[0].comment);
    if (grades.length == 0){
        await bot.telegram.sendMessage(idea[0].id_telegram, idea_message);
        await bot.telegram.sendMessage(idea[0].id_telegram, 'Риск-менеджеры не оставили оценки Вашей стратегии',
            Keyboards.acceptIdeaChannel(idea_uuid));
    }
    else {
        const riskManagers = await userController.getUsers('Риск-менеджер');
        let format_message = []
        format_message.push(messageFormat.generateFinishMessage(grades.length, riskManagers.length));
        format_message.push(messageFormat.generateTitle());
        let firstCriterion = 0;
        let secondCriterion = 0;
        let thirdCriterion = 0;
        for (let i = 0; i < grades.length; i++){
            let sum_string = grades[i].first_criterion + grades[i].second_criterion + grades[i].third_criterion;
            format_message.push(messageFormat.generateString(grades[i].nickname, grades[i].first_criterion,
                grades[i].second_criterion, grades[i].third_criterion, sum_string));
            firstCriterion += grades[i].first_criterion;
            secondCriterion += grades[i].second_criterion;
            thirdCriterion += grades[i].third_criterion;
        }
        for (let i = 0; i < grades.length; i++) {
            format_message.push(messageFormat.generateComment(grades[i].nickname, grades[i].comment))
        }
        let finishSum = firstCriterion + secondCriterion + thirdCriterion;
        format_message.push(messageFormat.finishString('Итого:', firstCriterion, secondCriterion, thirdCriterion, finishSum))
        let finishMessage = format_message.join('\n')
        let acceptMessage = 'Примите решение по идее:'
        await bot.telegram.sendMessage(idea[0].id_telegram, idea_message);
        await bot.telegram.sendMessage(idea[0].id_telegram, finishMessage);
        await bot.telegram.sendMessage(idea[0].id_telegram, acceptMessage, Keyboards.acceptIdeaChannel(idea_uuid));
    }
}


const publishIdea = async (ctx, idea, title_message) => {
    let username = ctx.callbackQuery.from.username;
    let message = messageFormat.publishIdea(idea[0], title_message, username);
    await bot.telegram.sendMessage(process.env.GROUP_ID, message);
}

function checkMessage(ctx, message) {
    try {
        if (message.text == '/cancel') {
            return true;
        }
    }
    catch (err){}
}

module.exports = { registerUser, updateUser, sendIdea, returnGrades, publishIdea, checkMessage }