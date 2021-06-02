const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')

require('dotenv').config()

const userController = require('../contoller/user.Controller')
const contactDataWizard = require('./scenes/addStrategy').contactDataWizard
const editDataWizard = require('./scenes/editStrategy').editDataWizard
const gradeDataWizard = require('./scenes/addGrade').gradeDataWizard
const sendAdmin = require('./utils/generate_message')


const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Stage([contactDataWizard, editDataWizard, gradeDataWizard])
bot.use(session())
bot.use(stage.middleware())



bot.start(async (ctx) => {
    let check_user = await userController.lookUpUser(ctx.message.chat.id);
    let check_status = await userController.checkStatus(ctx.message.chat.id, 'unregister');
    let check_block = await userController.checkStatus(ctx.message.chat.id, 'Отклонить')
    let userFirstName = ctx.message.from.first_name
    if (check_user.length == 0){
        await sendAdmin.registerUser(ctx)
        ctx.reply(`Привет, ${userFirstName}, дождись подтверждения регистрации у администратора! `)
    }
    else if(check_block.length == 1){
        ctx.reply(`Привет, ${userFirstName}. Администратор октлонил Вашу регистрацию. `)
    }
    else if (check_status.length > 0){
        ctx.reply(`Привет, ${userFirstName}, администратор еще не подтвердил твою регистрацию! `)
    }
    else {
        ctx.reply(`С возвращением, ${userFirstName}!`)
    }
})


bot.command('add', ctx => {
    ctx.scene.enter('add_strategy');
});


bot.action(/updateStatus (.+)/, ctx => {
    let message = ctx.callbackQuery.data;
    sendAdmin.updateUser(ctx, message);
});

bot.action(/grade (.+)/, ctx => {
    ctx.scene.enter('add_grade');
});



bot.launch()