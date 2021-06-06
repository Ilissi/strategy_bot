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
    let check_block = await userController.checkStatus(ctx.message.chat.id, 'Отклонить');
    let userFirstName = ctx.message.from.first_name
    if (check_user.length == 0){
        await generateMessage.registerUser(ctx)
        ctx.reply(`Привет, ${userFirstName}, дождись подтверждения регистрации у администратора! `);
    }
    else if(check_block.length == 1){
        ctx.reply(`Привет, ${userFirstName}. Администратор октлонил Вашу регистрацию. `);
    }
    else if (check_status.length > 0){
        ctx.reply(`Привет, ${userFirstName}, администратор еще не подтвердил твою регистрацию! `);
    }
    else {
        ctx.reply(`С возвращением, ${userFirstName}!`);
    }
});


bot.command('add', async (ctx) => {
    if (await userController.checkPermission(ctx.message.chat.id, 'Риск-менеджер')){
        ctx.scene.enter('add_strategy');
    }
    else ctx.reply('У вас нет прав для этого!');


});

bot.command('search', async (ctx) => {
    if (await userController.checkPermission(ctx.message.chat.id, 'Администратор')){
        ctx.scene.enter('search_idea');
    }
    else ctx.reply('У вас нет прав для этого!');
});

bot.command('edit', async (ctx) => {
    if (await userController.checkPermission(ctx.message.chat.id, 'Администратор')){
        ctx.scene.enter('edit_permissions');
    }
    else ctx.reply('У вас нет прав для этого!');
});

bot.action(/change (.+)/, async (ctx) =>{
    ctx.deleteMessage()
    let user_id = ctx.callbackQuery.data.split(' ')[1];
    ctx.reply('Выберите роль', Keyboards.addUser(user_id))
});

bot.action(/updateStatus (.+)/, async (ctx) => {
    let message = ctx.callbackQuery.data;
    let admin_id = ctx.callbackQuery.message.chat.id;
    await generateMessage.updateUser(ctx, message, admin_id);
});

bot.action(/grade (.+)/, ctx => {
    ctx.scene.enter('add_grade');
});

bot.action(/channel (.+)/, async (ctx) =>{
    ctx.deleteMessage()
    let uuid = ctx.callbackQuery.data.split(' ')[1];
    let idea = await strategyController.updateStatusStrategy(uuid, 'Канал');
    let title = 'Новая идея';
    await generateMessage.publishIdea(ctx, idea, title);
    ctx.reply(`Размещена в канал ID: ${uuid}`);
});

bot.action(/watchlist (.+)/, async (ctx) =>{
    ctx.deleteMessage()
    let uuid = ctx.callbackQuery.data.split(' ')[1];
    let idea = await strategyController.updateStatusStrategy(uuid, 'WatchList');
    ctx.reply(`Размещена в WL ID: ${uuid}`);
});

bot.action(/cancel (.+)/, async (ctx) =>{
    ctx.deleteMessage();
    let uuid = ctx.callbackQuery.data.split(' ')[1];
    let idea = await strategyController.updateStatusStrategy(uuid, 'Отказ')
    ctx.reply(`Отказ ID: ${uuid}`);
});


bot.launch()