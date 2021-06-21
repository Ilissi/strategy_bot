const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const fs = require( "fs" );

require('dotenv').config()

const userController = require('./contoller/user.Controller')
const activityController = require('./contoller/activity.Controller')
const contactDataWizard = require('./scenes/addStrategy').contactDataWizard
const gradeDataWizard = require('./scenes/addGrade').gradeDataWizard
const searchIdea = require('./scenes/searchIdea').searchIdeaWizard
const editPermission = require('./scenes/editPermissions').editPermissionsWizard
const publishWatchList = require('./scenes/approveWatchList').publishWatchListWizard
const adminAccept = require('./scenes/adminAccept').adminAcceptWizard
const generateMessage = require('./utils/generate_message')
const Keyboards = require('./keyboards/keyboards')


const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Stage([contactDataWizard, gradeDataWizard, searchIdea, editPermission, publishWatchList, adminAccept]);
bot.use(session());
bot.use(stage.middleware());



bot.start(async (ctx) => {
    let check_user = await userController.lookUpUser(ctx.message.chat.id);
    let check_status = await userController.checkStatus(ctx.message.chat.id, 'unregister');
    let check_block = await userController.checkStatus(ctx.message.chat.id, 'Отклонить');
    let userFirstName = ctx.message.from.first_name
    if (check_user.length == 0){
        await generateMessage.registerUser(ctx);
        await activityController.createActivityRecord(ctx.chat.id);

        await ctx.reply(`Привет, ${userFirstName}, дождись подтверждения регистрации у администратора! `);
    }
    else if(check_block.length == 1){
        await activityController.updateActivityRecord(ctx.chat.id);
        await ctx.reply(`Привет, ${userFirstName}. Администратор октлонил Вашу регистрацию. `);
    }
    else if (check_status.length > 0){
        await activityController.updateActivityRecord(ctx.chat.id);
        await ctx.reply(`Привет, ${userFirstName}, администратор еще не подтвердил твою регистрацию! `);
    }
    else {
        await activityController.updateActivityRecord(ctx.chat.id);
        await ctx.reply(`С возвращением, ${userFirstName}!`);
    }
});


bot.command('add', async (ctx) => {
    await activityController.updateActivityRecord(ctx.chat.id);
    if (await userController.checkPermission(ctx.chat.id, 'Администратор')){
        ctx.scene.enter('add_strategy');
    }
    else if (await userController.checkPermission(ctx.chat.id, 'Аналитик')){
        ctx.scene.enter('add_strategy');
    }
    else ctx.reply('У вас нет прав для этого!');
});

bot.command('search', async (ctx) => {
    await activityController.updateActivityRecord(ctx.chat.id);
    if (await userController.checkPermission(ctx.chat.id, 'Администратор')){
        ctx.scene.enter('search_idea');
    }
    else ctx.reply('У вас нет прав для этого!');
});

bot.command('edit', async (ctx) => {
    await activityController.updateActivityRecord(ctx.chat.id);
    if (await userController.checkPermission(ctx.chat.id, 'Администратор')){
        ctx.scene.enter('edit_permissions');
    }
    else await ctx.reply('У вас нет прав для этого!');
});

bot.command('users', async (ctx) => {
    await activityController.updateActivityRecord(ctx.chat.id);
    if (await userController.checkPermission(ctx.chat.id, 'Администратор')){
        await generateMessage.returnUsers(ctx)
    }
    else ctx.reply('У вас нет прав для этого!');
});

bot.action(/change (.+)/, async (ctx) =>{
    await activityController.updateActivityRecord(ctx.chat.id);
    await ctx.deleteMessage();
    let action = 'editStatus';
    let user_id = ctx.callbackQuery.data.split(' ')[1];
    await ctx.reply('Выберите роль', Keyboards.addUser(action, user_id));
});

bot.action(/updateStatus (.+)/, async (ctx) => {
    await activityController.updateActivityRecord(ctx.chat.id);
    let response = ctx.callbackQuery.data.split(' ');
    let user_id = response[1];
    let user = await userController.lookUpUser(user_id);
    if (user[0].permissions == 'unregister') {
        let message = ctx.callbackQuery.data;
        let admin_id = ctx.callbackQuery.message.chat.id;
        await generateMessage.updateUser(ctx, message, admin_id);
    }
    else await ctx.reply('Действие закрыто другим админом.')
});

bot.action(/editStatus (.+)/, async (ctx) =>{
    await activityController.updateActivityRecord(ctx.chat.id);
    let message = ctx.callbackQuery.data;
    let admin_id = ctx.callbackQuery.message.chat.id;
    await generateMessage.updateUser(ctx, message, admin_id);
})


bot.action(/grade (.+)/, async (ctx) => {
    await activityController.updateActivityRecord(ctx.chat.id);
    ctx.scene.enter('add_grade');
});

bot.action(/channel (.+)/, async (ctx) =>{
    await activityController.updateActivityRecord(ctx.chat.id);
    await generateMessage.approveAdminIdea(ctx, ctx.callbackQuery.data);
});

bot.action(/watchlist (.+)/, async (ctx) =>{
    await activityController.updateActivityRecord(ctx.chat.id);
    await generateMessage.approveAdminIdea(ctx, ctx.callbackQuery.data);
});

bot.action(/cancels (.+)/, async (ctx) =>{
    await activityController.updateActivityRecord(ctx.chat.id);
    await generateMessage.approveAdminIdea(ctx, ctx.callbackQuery.data);
});

bot.action(/tp (.+)/, async (ctx) =>{
    await activityController.updateActivityRecord(ctx.chat.id);
    ctx.scene.enter('generate_watchlist');
});

bot.action(/sl (.+)/, async (ctx) =>{
    await activityController.updateActivityRecord(ctx.chat.id);
    ctx.scene.enter('generate_watchlist');
});

bot.action(/average (.+)/, async (ctx) =>{
    await activityController.updateActivityRecord(ctx.chat.id);
    ctx.scene.enter('generate_watchlist');
});


let tlsOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/analytics-research-bot.ru/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/analytics-research-bot.ru/fullchain.pem")

};


bot.telegram.setWebhook('https://analytics-research-bot.ru/about');
bot.startWebhook('/about', null, 3000);


