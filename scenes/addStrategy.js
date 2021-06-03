const WizardScene = require('telegraf/scenes/wizard')

const strategyController = require('/root/strategy_bot/contoller/strategy.Controller')
const Keyboards = require('/root/strategy_bot/keyboards/keyboards')
const messageFormat = require('/root/strategy_bot/utils/message_format')
const generateMessage = require('/root/strategy_bot/utils/generate_message')



const contactDataWizard = new WizardScene(
    'add_strategy', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
        ctx.reply('Выберите тип стратегии:', Keyboards.getStrategy());
        ctx.wizard.state.contactData = {};
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.deleteMessage()
        if (typeof ctx.message == 'object'){
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
        if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНапиши /add еще раз!')
            return ctx.scene.leave();
        }
        else if (ctx.callbackQuery.data == 'Платный источник') {
            ctx.deleteMessage()
            ctx.reply('Введите ссылку на платный источник:')

        }
        else if (ctx.callbackQuery.data == 'Личная') {
            ctx.deleteMessage()
            ctx.wizard.state.contactData.source = ctx.callbackQuery.data;
            ctx.reply('Подтвердите действие:', Keyboards.confirmStrategy());
        }
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.updateType == 'message'){
            ctx.wizard.state.contactData.source = ctx.message.text;
        }
        else {
            ctx.deleteMessage()
        }
        ctx.reply('Тикер:')
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.contactData.ticker = ctx.message.text;
        ctx.reply('Какое действие?', Keyboards.getOrder());
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.deleteMessage()
        if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНапиши /add еще раз!')
            return ctx.scene.leave();
        }
        else {
            ctx.wizard.state.contactData.order = ctx.callbackQuery.data;
            ctx.reply('Введите цену входа:');
            return ctx.wizard.next();
        }
    },
    (ctx) => {
        ctx.wizard.state.contactData.price_enter = ctx.message.text;
        ctx.reply('Введите долю портфеля:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.contactData.percent = ctx.message.text;
        ctx.reply('Оцените риск стратегии:', Keyboards.riskKeyboard())
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.deleteMessage()
        if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНапиши /add еще раз!')
            return ctx.scene.leave();
        }
        else {
        ctx.wizard.state.contactData.risk = ctx.callbackQuery.data;
        ctx.reply('Введите TP:');
        return ctx.wizard.next();
        }
    },
    (ctx) => {
        ctx.wizard.state.contactData.TP = ctx.message.text;
        ctx.reply('Введите SL:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.contactData.SL = ctx.message.text;
        ctx.reply('Срок:');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (typeof  ctx.wizard.state.contactData.time == 'undefined') {
            ctx.wizard.state.contactData.time = ctx.message.text;
        }
        ctx.reply('Введите комментарий:');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.length > 30) {
            let generate_ts = messageFormat.getTime();
            ctx.wizard.state.contactData.ts = generate_ts.timestamp;
            ctx.wizard.state.contactData.datemessage = generate_ts.message;
            ctx.wizard.state.contactData.user_id = ctx.message.chat.id;
            ctx.wizard.state.contactData.comment = ctx.message.text;
            let upper_message = 'Подтвердите отправку идеи:\n'
            let messageSend = messageFormat.generate_message(ctx.message.from.username, ctx.wizard.state.contactData.datemessage,ctx.wizard.state.contactData.ticker, ctx.wizard.state.contactData.type,
                ctx.wizard.state.contactData.order, ctx.wizard.state.contactData.percent, ctx.wizard.state.contactData.price_enter, ctx.wizard.state.contactData.TP, ctx.wizard.state.contactData.SL,
                ctx.wizard.state.contactData.time, ctx.wizard.state.contactData.source, ctx.wizard.state.contactData.risk, ctx.wizard.state.contactData.comment)
            ctx.reply(upper_message + messageSend, Keyboards.acceptIdea())
            return ctx.wizard.next();
        } else {
            ctx.reply('Длинна комментария меньше 30 символов, попробуйте еще раз');
            ctx.wizard.back();  // Set the listener to the previous function
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
        }
    },
    async (ctx) => {
        ctx.deleteMessage()
        if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНапиши /add еще раз!')
    }
        else if(ctx.callbackQuery.data == 'ОК'){
            let record_list = [ctx.wizard.state.contactData.type, ctx.wizard.state.contactData.source, ctx.wizard.state.contactData.ticker,
                ctx.wizard.state.contactData.order, ctx.wizard.state.contactData.price_enter, ctx.wizard.state.contactData.percent,
                ctx.wizard.state.contactData.TP, ctx.wizard.state.contactData.SL, ctx.wizard.state.contactData.time, ctx.wizard.state.contactData.risk,
                ctx.wizard.state.contactData.user_id, ctx.wizard.state.contactData.comment]
            let response = await strategyController.createStrategy(record_list);

            if (typeof response == 'undefined'){
                ctx.reply('Ошибка формата текста! Сообщение не отправлено!')
            }
            else {
                let messageSend = messageFormat.generate_message(ctx.callbackQuery.from.username, ctx.wizard.state.contactData.datemessage,ctx.wizard.state.contactData.ticker, ctx.wizard.state.contactData.type,
                    ctx.wizard.state.contactData.order, ctx.wizard.state.contactData.percent, ctx.wizard.state.contactData.price_enter, ctx.wizard.state.contactData.TP, ctx.wizard.state.contactData.SL,
                    ctx.wizard.state.contactData.time, ctx.wizard.state.contactData.source, ctx.wizard.state.contactData.risk, ctx.wizard.state.contactData.comment)
                await generateMessage.sendIdea(ctx, messageSend, response[0].id, ctx.wizard.state.contactData.ticker)
                ctx.reply('Идея отправлена риск-менеджерам.')
            }
        }
        else if(ctx.callbackQuery.data == 'ОТМЕНА'){
            ctx.reply('Отправка идеи отменена.')
        }
        return ctx.scene.leave();
    },
);


module.exports = { contactDataWizard }