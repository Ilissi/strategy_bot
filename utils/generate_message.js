const Telegraf = require('telegraf')
const userController = require('../contoller/user.Controller')
const bot = new Telegraf(process.env.BOT_TOKEN)
const Keyboards = require('../keyboards/keyboards')


const registerUser = async (ctx) => {
    const user_id = ctx.message.from.id;
    const username = ctx.message.from.username;
    await userController.addUser(user_id, username, 'unregister');
    const admins = await userController.getUsers('Администратор');

    for (let i=0; i<admins.length; i++) {
        bot.telegram.sendMessage(admins[i].id_telegram, `Привет! Новый пользователь пытается зарегистрироваться!\n` +
            `Для подтверждения регистрации пользователя @${username} нажмите кнопку!`, Keyboards.addUser(user_id));
    }
};

const updateUser = async (ctx, message) => {
    let response = message.split(' ');
    let user_id = response[1]
    let permissions = response[2]
    if (permissions == 'Отклонить'){
        await userController.updateStatus(user_id, permissions)
        bot.telegram.sendMessage(user_id, 'Администратор отклонил Вашу регистрацию')
    }
    else {
        await userController.updateStatus(user_id, permissions)
        bot.telegram.sendMessage(user_id, `Администратор подтвердил Вашу регистрацию. Вы - ${permissions}.`)
    }
    ctx.deleteMessage()
    ctx.reply('Действие подтверждено!')
}

const sendIdea = async (ctx, message, idea_uuid, ticker) => {
    const riskManagers = await userController.getUsers('Риск-менеджер');
    for (let i = 0; i < riskManagers.length; i++) {
        bot.telegram.sendMessage(riskManagers[i].id_telegram, message, Keyboards.acceptGrade(idea_uuid, ticker), {
            parse_mode: "HTML",
        });

    }
}

module.exports = { registerUser, updateUser, sendIdea }