const WizardScene = require('telegraf/scenes/wizard')

const strategyController = require('../contoller/strategy.Controller')

const Keyboards = require('../keyboards/keyboards')
const messageFormat = require('../utils/message_format')
const generateMessage = require('../utils/generate_message')



const contactDataWizard = new WizardScene(
    'add_strategy', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
        ctx.reply('Выберите тип стратегии:', Keyboards.getStrategy());
        ctx.wizard.state.contactData = {};
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.deleteMessage()
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.reply('Отмена')
            return ctx.scene.leave();
        }
        else if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНапиши /add еще раз!')
            return ctx.scene.leave();
        }
        else {
            ctx.wizard.state.contactData.type = ctx.callbackQuery.data;
            ctx.reply('Какой источник стратегии?', Keyboards.strategySource());
            return ctx.wizard.next();
        }
    },
    (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.deleteMessage()
            ctx.reply('Отмена')
            return ctx.scene.leave();
        }
        else if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНапиши /add еще раз!')
            return ctx.scene.leave();
        }
        else if (ctx.callbackQuery.data == 'Платный источник') {
            ctx.deleteMessage()
            ctx.reply('Название источника')

        }
        else if (ctx.callbackQuery.data == 'Личная') {
            ctx.deleteMessage()
            ctx.wizard.state.contactData.source = ctx.callbackQuery.data;
            ctx.reply('Подтвердите действие:', Keyboards.confirmStrategy());
        }
        return ctx.wizard.next();
    },
    (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.deleteMessage()
            ctx.reply('Отмена')
            return ctx.scene.leave();
        }
        else if (ctx.updateType == 'message'){
            ctx.wizard.state.contactData.source = ctx.message.text;
        }
        else {
            ctx.deleteMessage()
        }
        ctx.reply('Тикер:')
        return ctx.wizard.next();
    },
    (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.deleteMessage()
            ctx.reply('Отмена')
            return ctx.scene.leave();
        }
        ctx.wizard.state.contactData.ticker = ctx.message.text;
        ctx.wizard.state.contactData.url = `https://finviz.com/quote.ashx?t=${ctx.wizard.state.contactData.ticker}`;
        ctx.reply('Какое действие?', Keyboards.getOrder());
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.deleteMessage()
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.reply('Отмена')
            return ctx.scene.leave();
        }
        else if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНапиши /add еще раз!')
            return ctx.scene.leave();
        }
        else {
            ctx.wizard.state.contactData.order = ctx.callbackQuery.data;
            ctx.reply('🟢Вход');
            return ctx.wizard.next();
        }
    },
    (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.deleteMessage()
            ctx.reply('Отмена')
            return ctx.scene.leave();
        }
        else if(generateMessage.checkDigitDiapason(ctx.message.text)) {
            ctx.wizard.state.contactData.price_enter = ctx.message.text;
            ctx.reply('🟠Цель');
            return ctx.wizard.next();
        }
        else {
            ctx.reply('Ошибка формата текста');
            return ctx.scene.leave();
        }
    },
    (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.deleteMessage()
            ctx.reply('Отмена')
            return ctx.scene.leave();
        }
        else if(generateMessage.checkDigit(ctx.message.text)) {
            ctx.wizard.state.contactData.TP = ctx.message.text;
            ctx.reply('🔴Стоп');
            return ctx.wizard.next();
        }
        else {
            ctx.reply('Ошибка формата текста');
            return ctx.scene.leave();
        }
    },
    (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.deleteMessage()
            ctx.reply('Отмена')
            return ctx.scene.leave();
        }
        else if (typeof ctx.wizard.state.contactData.SL == 'undefined') {
            if(generateMessage.checkDigit(ctx.message.text)) {
                ctx.wizard.state.contactData.SL = ctx.message.text;
                ctx.reply('Опишите торговую идею:');
                return ctx.wizard.next();
            }
            else {
                ctx.reply('Ошибка формата текста');
                return ctx.scene.leave();
            }
        }
        else {
            return ctx.wizard.next();
        }
    },
    async (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.deleteMessage()
            ctx.reply('Отмена')
            return ctx.scene.leave();
        }
        else if (ctx.message.text.length > 30) {
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
            return ctx.wizard.next();
        } else {
            ctx.replyWithHTML('Длина комментария меньше <b>30</b> символов, попробуйте еще раз.');
            ctx.wizard.back();  // Set the listener to the previous function
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
        }
    },
    async (ctx) => {
        ctx.deleteMessage()
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.reply('Отмена')
            return ctx.scene.leave();
        }
        else if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНапиши /add еще раз!')
        }
        else if(ctx.callbackQuery.data == 'ОК'){
            let record_list = [ctx.wizard.state.contactData.type, ctx.wizard.state.contactData.url, ctx.wizard.state.contactData.source, ctx.wizard.state.contactData.ticker,
                ctx.wizard.state.contactData.order, ctx.wizard.state.contactData.price_enter, ctx.wizard.state.contactData.TP, ctx.wizard.state.contactData.SL,
                ctx.wizard.state.contactData.user_id, ctx.wizard.state.contactData.comment]
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
            ctx.reply('Отправка идеи отменена.')
        }
        return ctx.scene.leave();
    },
);


module.exports = { contactDataWizard }