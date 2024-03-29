const WizardScene = require('telegraf/scenes/wizard')
const Telegraf = require('telegraf')

const messageFormat = require('../utils/message_format')
const userController = require('../contoller/user.Controller')
const strategyController = require('../contoller/strategy.Controller')
const Keyboards = require('../keyboards/keyboards')
const generateMessage = require('../utils/generate_message')
const activityController = require('../contoller/activity.Controller')
const filters = require('../utils/filters')

const bot = new Telegraf(process.env.BOT_TOKEN);

const adminAcceptWizard = new WizardScene(
    'admin_accept', async (ctx) => {
        await ctx.reply('Введите цену входа:');
        ctx.wizard.state.contactData = {};
        ctx.wizard.state.contactData.response = ctx.callbackQuery.data;
        return ctx.wizard.next();
    },
    async (ctx) => {
        await activityController.updateActivityRecord(ctx.chat.id);
        if (filters.checkCommand(ctx)){
            return ctx.scene.leave();
        }
        else if (filters.checkAction(ctx)){
            return ctx.scene.leave();
        }
        else if (filters.checkCallback(ctx)){
            return ctx.scene.leave();
        }
        else if (generateMessage.checkDigitDiapason(ctx.message.text)) {
            ctx.wizard.state.contactData.price = ctx.message.text;
            await ctx.reply('Введите комментарий:');
            return ctx.wizard.next();
        }
        else {
            await ctx.reply('Ошибка ввода:');
            return ctx.wizard.leave();
        }
    },
    async (ctx) => {
        await activityController.updateActivityRecord(ctx.chat.id);
        if (filters.checkCommand(ctx)){
            return ctx.scene.leave();
        }
        else if (filters.checkAction(ctx)){
            return ctx.scene.leave();
        }
        else if (filters.checkCallback(ctx)){
            return ctx.scene.leave();
        }
        else {
            ctx.wizard.state.contactData.comment = ctx.message.text;
            let response = ctx.wizard.state.contactData.response.split(' ');
            let source = response[0];
            let uuid = response[1];
            let title;
            let idea = await strategyController.getStrategyByUUID(uuid);
            let user = await userController.lookUpUser(idea[0].id_telegram);
            if (response[0] == 'watchlist'){
                let title = 'Новая идея в WatchList';
                let message = messageFormat.publishIdeaAdmin(idea[0], title, user[0].nickname,
                    ctx.chat.username, ctx.wizard.state.contactData.comment, ctx.wizard.state.contactData.price);
                ctx.replyWithHTML(message, Keyboards.acceptIdea())
            }
            else {
                let title = 'Новая идея';
                let message = messageFormat.publishIdeaAdmin(idea[0], title, user[0].nickname,
                    ctx.chat.username, ctx.wizard.state.contactData.comment, ctx.wizard.state.contactData.price);
                ctx.replyWithHTML(message, Keyboards.acceptIdea())
            }
            return ctx.wizard.next();
            }
    },
    async (ctx) => {
        await activityController.updateActivityRecord(ctx.chat.id);
        if (filters.checkCommand(ctx)){
            return ctx.scene.leave();
        }
        else if (filters.checkAction(ctx)){
            return ctx.scene.leave();
        }
        else if (filters.checkText(ctx)){
            return ctx.scene.leave();
        }
        else {
            ctx.deleteMessage();
            let response = ctx.wizard.state.contactData.response.split(' ');
            let statusResponse = response[0];
            let uuid = response[1];
            if (ctx.callbackQuery.data == 'ОК') {
                    let idea = await strategyController.getStrategyByUUID(uuid);
                    if (idea[0].status == null) {
                        if (statusResponse == 'watchlist') {
                            let messageAdmin = messageFormat.commentAdmin('WatchList', uuid, idea, ctx.chat.username, ctx.wizard.state.contactData.comment, ctx.wizard.state.contactData.price);
                            await strategyController.updateStatusStrategy(uuid, 'WatchList');
                            await strategyController.updateWatchListStrategy(uuid, true);
                            let title = 'Новая идея в WatchList';
                            let newIdea = await strategyController.updatePriceStrategy(uuid, ctx.wizard.state.contactData.price);
                            let newComment = await strategyController.insertPriceComment(uuid, ctx.wizard.state.contactData.comment);
                            await generateMessage.publishIdea(ctx, newComment, title);
                            await ctx.replyWithHTML(messageAdmin);
                            if (ctx.chat.id != idea[0].id_telegram) await bot.telegram.sendMessage(idea[0].id_telegram, messageAdmin, {parse_mode: 'HTML'});
                        } else if (statusResponse == 'channel') {
                            let messageAdmin = messageFormat.commentAdmin('Канал', uuid, idea, ctx.chat.username, ctx.wizard.state.contactData.comment, ctx.wizard.state.contactData.price);
                            await strategyController.updateStatusStrategy(uuid, 'Канал');
                            await strategyController.updateWatchListStrategy(uuid, true);
                            let title = 'Новая идея';
                            let newIdea = await strategyController.updatePriceStrategy(uuid, ctx.wizard.state.contactData.price);
                            let newComment = await strategyController.insertPriceComment(uuid, ctx.wizard.state.contactData.comment);
                            console.log(newComment)
                            await generateMessage.publishIdea(ctx, newComment, title);
                            await ctx.replyWithHTML(messageAdmin);
                            if (ctx.chat.id != idea[0].id_telegram) await bot.telegram.sendMessage(idea[0].id_telegram, messageAdmin, {parse_mode: 'HTML'});
                        }
                    }
                    else {
                        ctx.reply('Идея закрыта другим админом.')
                    }
            } else if (ctx.callbackQuery.data == 'ОТМЕНА') {
                ctx.reply('Оценка идеи отменена.')
            }
            return ctx.scene.leave();
        }
    });

module.exports = { adminAcceptWizard }