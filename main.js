const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')

require('dotenv').config()

const userController = require('/root/strategy_bot/contoller/user.Controller')
const strategyController = require('/root/strategy_bot/contoller/strategy.Controller')
const contactDataWizard = require('/root/strategy_bot/scenes/addStrategy').contactDataWizard
const editDataWizard = require('/root/strategy_bot/scenes/editStrategy').editDataWizard
const gradeDataWizard = require('/root/strategy_bot/scenes/addGrade').gradeDataWizard
const generateMessage = require('/root/strategy_bot/utils/generate_message')


const bot = new Telegraf('1765081269:AAGk4jJlz873-zOWwDlGD4AE6lKaMzoP2qU')
const stage = new Stage([contactDataWizard, editDataWizard, gradeDataWizard])
bot.use(session())
bot.use(stage.middleware())



bot.start(async (ctx) => {
    let check_user = await userController.lookUpUser(ctx.message.chat.id);
    let check_status = await userController.checkStatus(ctx.message.chat.id, 'unregister');
    let check_block = await userController.checkStatus(ctx.message.chat.id, 'Отклонить')
    let userFirstName = ctx.message.from.first_name
    console.log(check_user)
    console.log(check_status)
    console.log(check_block)
    console.log(userFirstName)
    if (check_user.length == 0){
        await generateMessage.registerUser(ctx)
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


bot.action(/updateStatus (.+)/, async (ctx) => {
    let message = ctx.callbackQuery.data;
    await generateMessage.updateUser(ctx, message);
});

bot.action(/grade (.+)/, ctx => {
    ctx.scene.enter('add_grade');
});

bot.action(/channel (.+)/, async (ctx) =>{
    ctx.deleteMessage()
    let uuid = ctx.callbackQuery.data.split(' ')[1];
    let idea = await strategyController.updateStatusStrategy(uuid, 'Канал')
    let title = 'Новая идея'
    await generateMessage.publishIdea(ctx, idea, title)
    console.log(idea)
    ctx.reply(`Размещена в канал ID: ${uuid}`)
});

bot.action(/watchlist (.+)/, async (ctx) =>{
    ctx.deleteMessage()
    let uuid = ctx.callbackQuery.data.split(' ')[1];
    let idea = await strategyController.updateStatusStrategy(uuid, 'WatchList')
    ctx.reply(`Размещена в WL ID: ${uuid}`)
});

bot.action(/cancel (.+)/, async (ctx) =>{
    ctx.deleteMessage()
    let uuid = ctx.callbackQuery.data.split(' ')[1];
    let idea = await strategyController.updateStatusStrategy(uuid, 'Отказ')
    ctx.reply(`Отказ ID: ${uuid}`)
});


bot.launch()