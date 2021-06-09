const Telegraf = require('telegraf')
const WizardScene = require('telegraf/scenes/wizard')

const strategyController = require('../contoller/strategy.Controller')
const userController = require('../contoller/user.Controller')
const messageFormat = require('../utils/message_format')
const Keyboards = require('../keyboards/keyboards')

const bot = new Telegraf(process.env.BOT_TOKEN)

function updateParameters(order_type, ideaObject){
    if (order_type == 'Buy'){
        let percentDown = 0.85;
        return (ideaObject * percentDown).toFixed(2);
    }
    else if (order_type == 'Sell'){
        let percentUp = 1.15;
        return (ideaObject * percentUp).toFixed(2);
    }
}


const publishWatchListWizard = new WizardScene(
    'generate_watchlist', (ctx) => {
        ctx.wizard.state.contactData = {};
        ctx.wizard.state.contactData.response = ctx.callbackQuery.data;
        ctx.reply('Введите комментарий:');
        return ctx.wizard.next();
    },
    async (ctx) => {
        let comment = ctx.message.text;
        let upper_message = 'Подтвердите действие:\n';
        let response = ctx.wizard.state.contactData.response.split(' ')
        let ideaUUID = response[1];
        ctx.wizard.state.contactData.ideaObject = await strategyController.getStrategyByUUID(ideaUUID);
        ctx.wizard.state.contactData.username = await userController.lookUpUser(ctx.wizard.state.contactData.ideaObject[0].id_telegram);
        ctx.wizard.state.contactData.ideaObject[0].comment = comment;
        if (response[0] == 'tp'){
            ctx.wizard.state.contactData.title = 'Закрытие сделки по TP';
            let message = messageFormat.publishIdea(ctx.wizard.state.contactData.ideaObject[0],
                ctx.wizard.state.contactData.title, ctx.wizard.state.contactData.username[0].nickname);
            let confirm_message = upper_message + message;
            ctx.reply(confirm_message, Keyboards.acceptWatchlist());
        }
        else if (response[0] == 'sl'){
            ctx.wizard.state.contactData.title = 'Закрытие сделки по SL';
            let message = messageFormat.publishIdea(ctx.wizard.state.contactData.ideaObject[0],
                ctx.wizard.state.contactData.title, ctx.wizard.state.contactData.username[0].nickname);
            let confirm_message = upper_message + message;
            ctx.reply(confirm_message, Keyboards.acceptWatchlist());
        }
        else if (response[0] == 'average'){
            ctx.wizard.state.contactData.title = 'Усреднение по идеи';
            ctx.wizard.state.contactData.ideaObject[0].tp = updateParameters(ctx.wizard.state.contactData.ideaObject[0].order_type,
                ctx.wizard.state.contactData.ideaObject[0].tp);
            ctx.wizard.state.contactData.ideaObject[0].sl = updateParameters(ctx.wizard.state.contactData.ideaObject[0].order_type,
                ctx.wizard.state.contactData.ideaObject[0].sl);
            ctx.wizard.state.contactData.ideaObject[0].entry_price = updateParameters(ctx.wizard.state.contactData.ideaObject[0].order_type,
                ctx.wizard.state.contactData.ideaObject[0].entry_price);
            let message = messageFormat.publishIdea(ctx.wizard.state.contactData.ideaObject[0],
                ctx.wizard.state.contactData.title, ctx.wizard.state.contactData.username[0].nickname);
            let confirm_message = upper_message + message;
            ctx.reply(confirm_message, Keyboards.acceptWatchlist());

        }
        return ctx.wizard.next();
    },
    async (ctx) =>{
        ctx.deleteMessage()
        if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nПопробуй еще раз!')
        }
        else if(ctx.callbackQuery.data == 'Отправить'){
            let response =  ctx.wizard.state.contactData.response.split(' ');
            if (response[0] == 'average'){
                let idea_value = ctx.wizard.state.contactData.ideaObject[0];
                let response = await strategyController.createStrategy(Object.values(idea_value));
                await strategyController.updateApprove(true, response[0].id);
                await strategyController.updateStatusStrategy('Канал', response[0].id);
                let message = messageFormat.publishIdea(idea_value,
                    ctx.wizard.state.contactData.title, ctx.wizard.state.contactData.username[0].nickname);
                await bot.telegram.sendMessage(-1001231624146, message);
                await ctx.reply('Сообщение отправлено в канал.')
            }
            else {
                let message = messageFormat.publishIdea(ctx.wizard.state.contactData.ideaObject[0],
                    ctx.wizard.state.contactData.title, ctx.wizard.state.contactData.username[0].nickname);
                await bot.telegram.sendMessage(-1001231624146, message);
                await ctx.reply('Сообщение отправлено в канал.')
            }
        }
        return ctx.scene.leave();
    });

module.exports = { publishWatchListWizard }