const WizardScene = require('telegraf/scenes/wizard')

const strategyController = require('../contoller/strategy.Controller')
const activityController = require('../contoller/activity.Controller')
const Keyboards = require('../keyboards/keyboards')
const messageFormat = require('../utils/message_format')
const generateMessage = require('../utils/generate_message')
const filters = require('../utils/filters')

async function checkMessage(ctx) {
    await activityController.updateActivityRecord(ctx.chat.id);
    try {
        if (ctx.message.text.length > 30) {
            let generate_ts = messageFormat.getTime();
            ctx.wizard.state.contactData.ts = generate_ts.timestamp;
            ctx.wizard.state.contactData.datemessage = generate_ts.message;
            ctx.wizard.state.contactData.user_id = ctx.message.chat.id;
            ctx.wizard.state.contactData.comment = ctx.message.text;
            let idIdea = await strategyController.getLastRecord();
            let record = generateMessage.returnId(idIdea);
            let upper_message = '<b>Подтвердите отправку идеи:</b>\n'
            let messageSend = messageFormat.generate_message(record, ctx.message.from.username, ctx.wizard.state.contactData.ticker,
                ctx.wizard.state.contactData.url, ctx.wizard.state.contactData.type, ctx.wizard.state.contactData.order, ctx.wizard.state.contactData.price_enter,
                ctx.wizard.state.contactData.TP, ctx.wizard.state.contactData.SL, ctx.wizard.state.contactData.source, ctx.wizard.state.contactData.comment)
            ctx.replyWithHTML(upper_message + messageSend, Keyboards.acceptIdea())
            return true;
        } else {
            await ctx.replyWithHTML('Длина комментария меньше <b>30</b> символов, попробуйте еще раз.');
            return false;
        }
    }
    catch (Error){
        return true;
    }
}


const contactDataWizard = new WizardScene(
    'add_strategy', // first argument is Scene_ID, same as for BaseScene
    async (ctx) => {
        await ctx.reply('Выберите тип стратегии:', Keyboards.getStrategy());
        ctx.wizard.state.contactData = {};
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
        else if (filters.checkText(ctx)){
            return ctx.scene.leave();
        }
        else {
            ctx.deleteMessage()
            ctx.wizard.state.contactData.type = ctx.callbackQuery.data;
            await ctx.reply('Какой источник стратегии?', Keyboards.strategySource());
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
        else if (ctx.callbackQuery.data == 'Личная') {
            ctx.deleteMessage()
            await ctx.reply('Тикер:')
            ctx.wizard.state.contactData.source = ctx.callbackQuery.data;
            return ctx.wizard.next();
        }
        else if (ctx.callbackQuery.data == 'Платный источник') {
            ctx.deleteMessage()
            ctx.reply('Название источника:');
        }
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
        if (typeof ctx.wizard.state.contactData.source == 'undefined'){
            ctx.wizard.state.contactData.source = ctx.message.text;
            ctx.reply('Тикер:');
            return ctx.wizard.next();
        }
        else {
            ctx.wizard.state.contactData.ticker = ctx.message.text;
            ctx.wizard.state.contactData.url = `https://finviz.com/quote.ashx?t=${ctx.wizard.state.contactData.ticker}`;
            ctx.reply('Какое действие?', Keyboards.getOrder());
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
        else if (typeof ctx.wizard.state.contactData.ticker == 'undefined'){
            if (filters.checkCallback(ctx)){
                return ctx.scene.leave();
            }
            else {
                ctx.wizard.state.contactData.ticker = ctx.message.text;
                ctx.wizard.state.contactData.url = `https://finviz.com/quote.ashx?t=${ctx.wizard.state.contactData.ticker}`;
                ctx.reply('Какое действие?', Keyboards.getOrder());
                return ctx.wizard.next()
            }
        }
        else {
            if (filters.checkText(ctx)){
                return ctx.scene.leave();
            }
            else {
                ctx.deleteMessage()
                ctx.wizard.state.contactData.order = ctx.callbackQuery.data;
                ctx.reply('🟢Вход');
                return ctx.wizard.next();
            }
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
        else if (typeof ctx.wizard.state.contactData.order == 'undefined'){
            if (filters.checkText(ctx)){
                return ctx.scene.leave();
            }
            else {
                ctx.deleteMessage()
                ctx.wizard.state.contactData.order = ctx.callbackQuery.data;
                ctx.reply('🟢Вход');
                return ctx.wizard.next();
            }
        }
        else {
            if (filters.checkCallback(ctx)){
                return ctx.scene.leave();
            }
            else {
                if (generateMessage.checkDigitDiapason(ctx.message.text)) {
                    ctx.wizard.state.contactData.price_enter = ctx.message.text;
                    ctx.reply('🟠Цель');
                    return ctx.wizard.next();
                }
                else {
                    ctx.reply('Ошибка формата ввода.');
                    return ctx.scene.leave();
                }
            }
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
        else if (typeof ctx.wizard.state.contactData.price_enter == 'undefined'){
            ctx.wizard.state.contactData.price_enter = ctx.message.text;
            if (generateMessage.checkDigitDiapason(ctx.message.text)) {
                ctx.wizard.state.contactData.price_enter = ctx.message.text;
                ctx.reply('🟠Цель');
                return ctx.wizard.next();
            }
            else {
                ctx.reply('Ошибка формата ввода.');
                return ctx.scene.leave();
            }
        }
        else {
            if (generateMessage.checkDigit(ctx.message.text)) {
                ctx.wizard.state.contactData.TP = ctx.message.text;
                ctx.reply('🔴Стоп');
                return ctx.wizard.next();
            }
            else {
                ctx.reply('Ошибка формата ввода.');
                return ctx.scene.leave();
            }
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
        else if (typeof ctx.wizard.state.contactData.TP == 'undefined'){
            if (generateMessage.checkDigit(ctx.message.text)) {
                ctx.wizard.state.contactData.TP = ctx.message.text;
                ctx.reply('🔴Стоп');
                return ctx.wizard.next();
            }
            else {
                ctx.reply('Ошибка формата ввода.');
                return ctx.scene.leave();
            }
        }
        else {
            if (typeof ctx.wizard.state.contactData.SL == 'undefined'){
                ctx.wizard.state.contactData.SL = ctx.message.text;
            }
            await ctx.reply('Опишите торговую идею:');
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
        else if (typeof ctx.wizard.state.contactData.SL == 'undefined'){
            ctx.wizard.state.contactData.SL = ctx.message.text;
            await ctx.reply('Опишите торговую идею:');
            return ctx.wizard.next();
        }
        else {
            if (await checkMessage(ctx) == true) {
                return ctx.wizard.next();
            }
            else {
                ctx.wizard.back();
                return ctx.wizard.steps[ctx.wizard.cursor](ctx);
            }}
        },
    async (ctx) => {
        await activityController.updateActivityRecord(ctx.chat.id);
        if (filters.checkCommand(ctx)){
            return ctx.scene.leave();
        }
        else if (filters.checkAction(ctx)){
            return ctx.scene.leave();
        }
        else if (typeof ctx.wizard.state.contactData.comment == 'undefined'){
            if (await checkMessage(ctx) == true)
            {
                return ctx.wizard.next();
            }
            else {
                return ctx.wizard.back();
            }}
        else {
            if (filters.checkText(ctx)){
                return ctx.scene.leave();
            }
            else if(ctx.callbackQuery.data == 'ОК'){
                ctx.deleteMessage()
                let record_list = [ctx.wizard.state.contactData.type, ctx.wizard.state.contactData.url, ctx.wizard.state.contactData.source, ctx.wizard.state.contactData.ticker,
                    ctx.wizard.state.contactData.order, ctx.wizard.state.contactData.price_enter, ctx.wizard.state.contactData.TP, ctx.wizard.state.contactData.SL,
                    ctx.wizard.state.contactData.user_id, ctx.wizard.state.contactData.comment, ctx.chat.username]
                let response = await strategyController.createStrategy(record_list);
                if (response.severity == 'ERROR'){
                    ctx.reply('Ошибка формата текста! Сообщение не отправлено!')
                    return ctx.scene.leave();
                }
            else {
                let messageSend = messageFormat.generate_message((response[0].id).toString(), ctx.callbackQuery.from.username, ctx.wizard.state.contactData.ticker,
                    ctx.wizard.state.contactData.url, ctx.wizard.state.contactData.type, ctx.wizard.state.contactData.order, ctx.wizard.state.contactData.price_enter,
                    ctx.wizard.state.contactData.TP, ctx.wizard.state.contactData.SL, ctx.wizard.state.contactData.source, ctx.wizard.state.contactData.comment)
                await generateMessage.sendIdea(ctx, messageSend, response[0].id, ctx.wizard.state.contactData.ticker)
                ctx.reply('Идея отправлена на оценку.')
            }
            }
            else if(ctx.callbackQuery.data == 'ОТМЕНА'){
                ctx.deleteMessage()
                ctx.reply('Отправка идеи отменена.')
            }
            return ctx.scene.leave();
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
        else if(ctx.callbackQuery.data == 'ОК'){
            ctx.deleteMessage()
            let record_list = [ctx.wizard.state.contactData.type, ctx.wizard.state.contactData.url, ctx.wizard.state.contactData.source, ctx.wizard.state.contactData.ticker,
                ctx.wizard.state.contactData.order, ctx.wizard.state.contactData.price_enter, ctx.wizard.state.contactData.TP, ctx.wizard.state.contactData.SL,
                ctx.wizard.state.contactData.user_id, ctx.wizard.state.contactData.comment, ctx.chat.username]
            console.log(record_list)
            console.log(record_list.length)
            let response = await strategyController.createStrategy(record_list);
            if (typeof response == 'undefined'){
                ctx.reply('Ошибка формата текста! Сообщение не отправлено!')
            }
            else {
                let messageSend = messageFormat.generate_message((response[0].id).toString(), ctx.callbackQuery.from.username, ctx.wizard.state.contactData.ticker,
                    ctx.wizard.state.contactData.url, ctx.wizard.state.contactData.type, ctx.wizard.state.contactData.order, ctx.wizard.state.contactData.price_enter,
                    ctx.wizard.state.contactData.TP, ctx.wizard.state.contactData.SL, ctx.wizard.state.contactData.source, ctx.wizard.state.contactData.comment)
                await generateMessage.sendIdea(ctx, messageSend, response[0].id, ctx.wizard.state.contactData.ticker)
                ctx.reply('Идея отправлена на оценку.')
            }
        }
        else if(ctx.callbackQuery.data == 'ОТМЕНА'){
            ctx.deleteMessage()
            ctx.reply('Отправка идеи отменена.')
        }
        return ctx.scene.leave();
    },
);


module.exports = { contactDataWizard }