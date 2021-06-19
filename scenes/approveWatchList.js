const Telegraf = require('telegraf')
const WizardScene = require('telegraf/scenes/wizard')

const strategyController = require('../contoller/strategy.Controller')
const userController = require('../contoller/user.Controller')
const messageFormat = require('../utils/message_format')
const Keyboards = require('../keyboards/keyboards')

require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN)


function updateDiapason(percent, diapasonObject){
    let array = diapasonObject.split('-');
    let returnArray = []
    for (let i = 0; i<array.length; i++){
        returnArray.push((array[i] * percent).toFixed(2));
    }
    return returnArray.join('-');
}

function updateParameters(order_type, ideaObject){
    if (ideaObject == '-'){
        return ideaObject;
    }
    else if (order_type == 'Buy'){
        let percentDown = 0.85;
        if (ideaObject.includes('-')){
            let diapason = updateDiapason(percentDown, ideaObject)
            return diapason;
        }
        else return (ideaObject * percentDown).toFixed(2);
    }
}



const publishWatchListWizard = new WizardScene(
    'generate_watchlist', async (ctx) => {
        let uuid = await strategyController.checkApprove((ctx.callbackQuery.data.split(' ')[1]));
        if (uuid.length >= 1) {
            ctx.wizard.state.contactData = {};
            ctx.wizard.state.contactData.response = ctx.callbackQuery.data;
            ctx.reply('Введите комментарий:');
            return ctx.wizard.next();
        }
        else {
            await ctx.reply('Решение по этой идеи уже принято.')
        }
    },
    async (ctx) => {
        if (typeof ctx.message.text == 'undefined'){
            ctx.reply('Попробуйте еще раз!')
            ctx.wizard.leave();
        }
        else {
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
                ctx.replyWithHTML(confirm_message, Keyboards.acceptWatchlist());
            }
            else if (response[0] == 'sl'){
                ctx.wizard.state.contactData.title = 'Закрытие сделки по SL';
                let message = messageFormat.publishIdea(ctx.wizard.state.contactData.ideaObject[0],
                    ctx.wizard.state.contactData.title, ctx.wizard.state.contactData.username[0].nickname);
                let confirm_message = upper_message + message;
                ctx.replyWithHTML(confirm_message, Keyboards.acceptWatchlist());
            }
            else if (response[0] == 'average') {
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
                ctx.replyWithHTML(confirm_message, Keyboards.acceptWatchlist());
            }
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
                let newResponse = await strategyController.createAverageStrategy(Object.values(idea_value));
                await strategyController.updateApprove(false, response[1]);
                await strategyController.updateStatusStrategy('Канал', newResponse[0].id);
                let message = messageFormat.publishIdea(idea_value,
                    ctx.wizard.state.contactData.title, ctx.wizard.state.contactData.username[0].nickname);
                await bot.telegram.sendMessage(process.env.GROUP_ID, message,{parse_mode: 'HTML'});
                await ctx.reply('Сообщение отправлено в канал.')
            }
            else {
                let message = messageFormat.publishIdea(ctx.wizard.state.contactData.ideaObject[0],
                    ctx.wizard.state.contactData.title, ctx.wizard.state.contactData.username[0].nickname);
                await bot.telegram.sendMessage(process.env.GROUP_ID, message, {parse_mode: 'HTML'});
                await strategyController.updateApprove(false, response[1]);
                await ctx.reply('Сообщение отправлено в канал.')
            }
        }
        return ctx.scene.leave();
    });

module.exports = { publishWatchListWizard }