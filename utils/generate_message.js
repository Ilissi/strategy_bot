const Telegraf = require('telegraf')
const userController = require('../contoller/user.Controller')
const gradeController = require('../contoller/grade.Controller')
const strategyController = require('../contoller/strategy.Controller')
const activityController = require('../contoller/activity.Controller')
const Keyboards = require('../keyboards/keyboards')
const messageFormat = require('../utils/message_format')
const parse = require('postgres-date')



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
    await ctx.reply('Действие подтверждено!');
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
    const users = await userController.getAllUsers();
    for (let i = 0; i < users.length; i++) {
        if (users[i].id_telegram != ctx.chat.id) {
            await bot.telegram.sendMessage(users[i].id_telegram, message, Keyboards.acceptGrade(idea_uuid, ticker) );
        }
    }
    await setTimeout(notificationAlert, 5 * 60000, ctx, idea_uuid)
    await setTimeout(notificationFinish, 20 * 60000, ctx, idea_uuid)
}


const notificationAlert = async (ctx, idea_uuid) => {
    const getStrategyApprove = await strategyController.checkApprove(idea_uuid);
    const getTime = await activityController.getActivityRecord()
    if (getStrategyApprove.length == 0) {
        let message = 'Осталось 15 минут для оценки идеи'
        for (let i = 0; i < getTime.length; i++) {
            let click = parse(getTime[i].user_activity)
            let dateNow = Date.now()
            let beetwen = dateNow - click;
            let timeInMS = 300000;
            if (beetwen >= timeInMS) {
                if (getTime[i].user_id != ctx.chat.id) {
                    await bot.telegram.sendMessage(getTime[i].user_id, message)
                }
            }
        }
    }
}


const notificationFinish = async (ctx, idea_uuid) => {
    const getStrategyApprove = await strategyController.checkApprove(idea_uuid);
    if (getStrategyApprove.length == 0) {
        await strategyController.updateApprove(true, idea_uuid);
        await returnGrades(ctx, idea_uuid)
    }
}


const returnGrades = async (ctx, idea_uuid) => {
    const grades = await gradeController.returnGrades(idea_uuid);
    const idea = await strategyController.getStrategyByUUID(idea_uuid);
    let user = await userController.lookUpUser(idea[0].id_telegram)
    let idea_message = messageFormat.generate_message(idea_uuid.toString(), user[0].nickname, idea[0].ticker, idea[0].url, idea[0].type, idea[0].order_type,
        idea[0].entry_price, idea[0].tp, idea[0].sl, idea[0].source, idea[0].comment);
    if (grades.length == 0) {
        const admins = await userController.getUsers('Администратор');
        for (let i = 0; i < admins.length; i++) {
            await bot.telegram.sendMessage(admins[i].id_telegram, idea_message, {parse_mode: 'HTML'});
            await bot.telegram.sendMessage(admins[i].id_telegram, 'Никто не оставили оценки идее',
                Keyboards.acceptIdeaChannel(idea_uuid));
        }
    }
    else {
        const users = await userController.getAllUsers();
        let format_message = []
        format_message.push(messageFormat.generateFinishMessage(grades.length, users.length - 1));
        let firstCriterion = 0;
        let secondCriterion = 0;
        for (let i = 0; i < grades.length; i++) {
            firstCriterion += grades[i].first_criterion;
            secondCriterion += grades[i].second_criterion;
        }
        let order = await gradeController.CheckOrder(idea_uuid)
        let portfolio = await gradeController.CheckPortfolio(idea_uuid);
        format_message.push(messageFormat.generateString('Оценка торговой идеи:',(firstCriterion/grades.length).toFixed(1)));
        format_message.push(messageFormat.generateString('Оценка точки входа:',(secondCriterion/grades.length).toFixed(1)));
        format_message.push(messageFormat.generateStringSummary('Соответствие портфель:', order.length, grades.length))
        format_message.push(messageFormat.generateStringSummary('Сколько возьмут себе:', portfolio.length, grades.length))
        for (let i = 0; i < grades.length; i++) {
            format_message.push(messageFormat.generateComment(grades[i].nickname, grades[i].comment))
            format_message.push(messageFormat.generatePrice(grades[i].price_entity))

        }
        let finishMessage = format_message.join('\n')
        let author_message = 'Идея отправлена администраторам.'
        await bot.telegram.sendMessage(idea[0].id_telegram, author_message);
        const admins = await userController.getUsers('Администратор');
        for (let i = 0; i < admins.length; i++) {
            let acceptMessage = 'Примите решение по идее:'
            await bot.telegram.sendMessage(admins[i].id_telegram, idea_message, {parse_mode: 'HTML'});
            await bot.telegram.sendMessage(admins[i].id_telegram, finishMessage, {parse_mode: 'HTML'});
            await bot.telegram.sendMessage(admins[i].id_telegram, acceptMessage, Keyboards.acceptIdeaChannel(idea_uuid));
        }
    }
}


const publishIdea = async (ctx, idea, title_message) => {
    let user = await userController.lookUpUser(idea[0].id_telegram);
    let username = user[0].nickname;
    let message = messageFormat.publishIdea(idea[0], title_message, username);
    await bot.telegram.sendMessage(process.env.GROUP_ID, message, {parse_mode: 'HTML'});
}


const approveAdminIdea = async (ctx, callbackData) =>{
    let response = callbackData.split(' ');
    let uuid = response[1];
    let status = response[0];
    let idea = await strategyController.getStrategyByUUID(uuid);
    if (idea[0].status == null){
        if (status == 'cancels'){
            let messageAdmin = `<b>Отказ </b> <b>№${messageFormat.PrefInt(uuid, 4)}</b>\n<b>Тикер:</b> 💼 <a href="${idea[0].url}">${idea[0].ticker}</a>\n<b>Решение принял:</b> @${ctx.chat.username}`;
            await strategyController.updateStatusStrategy(uuid, 'Отказ');
            await strategyController.updateWatchListStrategy(uuid, false);
            await ctx.replyWithHTML(messageAdmin);
            if (ctx.chat.id != idea[0].id_telegram) await bot.telegram.sendMessage(idea[0].id_telegram, messageAdmin,{parse_mode: 'HTML'});
        }
        else if(status == 'watchlist'){
            await ctx.scene.enter('admin_accept');
        }
        else if(status == 'channel'){
            await ctx.scene.enter('admin_accept')
        }
    }
    else {
        ctx.reply('Решение по этой идеи уже принято.')
    }
}


const returnUsers = async (ctx) =>{
    let users = await userController.getAllUsersAllParam();
    for (let i =0; i < users.length; i++){
        let message = messageFormat.showUser(users[i]);
        await ctx.replyWithHTML(message, Keyboards.changePermissions(users[i].id_telegram));
    }
}


function checkMessage(ctx, message){
    try {
        if (message.text == '/cancel') {
            return true;
        }
    }
    catch (err) {
    }
}


function checkDigitDiapason(message){
    let digit = /^[0-9]*.[0-9]*$/;
    let digitDiapazon = /^[0-9]*.[0-9]*-[0-9]*.[0-9]*$/
    try {
        if (digit.test(message) || digitDiapazon.test(message)){
            return true;
        }
        else false;
    }
    catch (err){}
}

function checkDigit(message) {
    let digit = /^[0-9]*.[0-9]*$/;
    try {
        if (message == '-'){
            return true;
        }
        else if (digit.test(message)){
            return true;
        }
        else false;
    }
    catch (err){}
}


function returnId(idIdea){
    let record;
    if (typeof idIdea[0] == 'undefined') {
        record = '1'
    }
    else {
        record = (parseInt(idIdea[0].id) + 1).toString();
    }
    return record;
}

module.exports = { registerUser, updateUser, sendIdea, returnGrades, publishIdea, returnId,
    checkMessage, approveAdminIdea, returnUsers, checkDigitDiapason, checkDigit }