const WizardScene = require('telegraf/scenes/wizard')

const strategyController = require('../contoller/strategy.Controller')
const Keyboards = require('../keyboards/keyboards')


const contactDataWizard = new WizardScene(
    'add_strategy', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
        ctx.reply('Выберите тип стратегии:', Keyboards.getStrategy());
        ctx.wizard.state.contactData = {};
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.deleteMessage()
        ctx.wizard.state.contactData.type = ctx.callbackQuery.data;
        ctx.reply('Какой источник стратегии?', Keyboards.strategySource());
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.callbackQuery.data == 'Платный источник') {
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
        ctx.reply('Введите название пары:')
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.contactData.ticker = ctx.message.text;
        ctx.reply('Какой buy ticker?', Keyboards.getOrder());
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.deleteMessage()
        ctx.wizard.state.contactData.order = ctx.callbackQuery.data;
        ctx.reply('Введите цену входа:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.contactData.price_enter = ctx.message.text;
        ctx.reply('Введите долю портфеля:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.contactData.percent = ctx.message.text;
        ctx.reply('Введите TP:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.contactData.TP = ctx.message.text;
        ctx.reply('Введите SL:');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.wizard.state.contactData.SL == undefined){
        ctx.wizard.state.contactData.SL = ctx.message.text;
        ctx.reply('Введите комментарий:');
        }
        else {
            ctx.reply('Введите комментарий:');
        }
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (ctx.message.text.length > 30){
            console.log(ctx.message.text)
            ctx.wizard.state.contactData.user_id = ctx.message.chat.id;
            ctx.wizard.state.contactData.comment = ctx.message.text;
            await strategyController.createStrategy(ctx.wizard.state.contactData);
            ctx.reply('Коментарий успешно сохранен')
        }
        else {
            ctx.reply('Длинна коментария меньше 30 символов, попробуйте еще раз');
            ctx.wizard.back();  // Set the listener to the previous function
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
        }
        return ctx.scene.leave();
    },
);


module.exports = { contactDataWizard }