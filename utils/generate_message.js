const Telegraf = require('telegraf')
const userController = require('/root/strategy_bot/contoller/user.Controller')
const gradeController = require('/root/strategy_bot/contoller/grade.Controller')
const strategyController = require('/root/strategy_bot/contoller/strategy.Controller')
const Keyboards = require('/root/strategy_bot/keyboards/keyboards')
const messageFormat = require('/root/strategy_bot/utils/message_format')
const utils = require('/root/strategy_bot/utils/message_format')

const bot = new Telegraf('1765081269:AAGk4jJlz873-zOWwDlGD4AE6lKaMzoP2qU\n')
require('dotenv').config()


const registerUser = async (ctx) => {
    const user_id = ctx.message.from.id;
    const username = ctx.message.from.username;
    await userController.addUser(user_id, username, 'unregister');
    const admins = await userController.getUsers('Администратор');
    console.log(admins)

    for (let i=0; i<admins.length; i++) {
        console.log(admins[i].id_telegram)
        await bot.telegram.sendMessage(admins[i].id_telegram, `Привет! Новый пользователь пытается зарегистрироваться!\n` +
            `Для подтверждения регистрации пользователя @${username} нажмите кнопку!`, Keyboards.addUser(user_id));
    }
};

const updateUser = async (ctx, message) => {
    let response = message.split(' ');
    let user_id = response[1]
    let permissions = response[2]
    if (permissions == 'Отклонить'){
        await userController.updateStatus(user_id, permissions)
        await bot.telegram.sendMessage(user_id, 'Администратор отклонил Вашу регистрацию')
    }
    else {
        await userController.updateStatus(user_id, permissions)
        await bot.telegram.sendMessage(user_id, `Администратор подтвердил Вашу регистрацию. Вы - ${permissions}.`)
    }
    ctx.deleteMessage()
    ctx.reply('Действие подтверждено!')
}

const sendIdea = async (ctx, message, idea_uuid, ticker) => {
    const riskManagers = await userController.getUsers('Риск-менеджер');
    for (let i = 0; i < riskManagers.length; i++) {
        bot.telegram.sendMessage(riskManagers[i].id_telegram, message, Keyboards.acceptGrade(idea_uuid, ticker));
    }
    await setTimeout(notificationAlert, 1 * 60000, ctx, idea_uuid)
    await setTimeout(notificationFinish, 2*60000, ctx, idea_uuid)
}

const notificationAlert = async (ctx, idea_uuid) => {
    const getStrategyApprove = await strategyController.checkApprove(idea_uuid);
    if (getStrategyApprove.length == 0) {
        const riskManagers = await userController.getUsers('Риск-менеджер');
        const approveRiskManagers = await gradeController.returnManagersApproved(idea_uuid)
        let alertManager = utils.generateList(riskManagers, approveRiskManagers)
        let message = 'Осталось 15 минут для оценки идеи'
        for (let i = 0; i < alertManager.length; i++){
            bot.telegram.sendMessage(alertManager[i].id_telegram, message)
        }
    }
}

const notificationFinish = async (ctx, idea_uuid) => {
    const getStrategyApprove = await strategyController.checkApprove(idea_uuid);
    if (getStrategyApprove.length == 0){
        await strategyController.updateApprove(idea_uuid);
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
        bot.telegram.sendMessage(idea[0].id_telegram, idea_message);
        bot.telegram.sendMessage(idea[0].id_telegram, 'Риск-менеджеры не оставили оценки Вашей стратегии',
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
    await bot.telegram.sendMessage('-1001227140659', message);
}


module.exports = { registerUser, updateUser, sendIdea, returnGrades, publishIdea }