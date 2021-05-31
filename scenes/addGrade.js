const WizardScene = require('telegraf/scenes/wizard')

const Keyboards = require('../keyboards/keyboards')
const messageFormat = require('../utils/message_format')

const gradeDataWizard = new WizardScene('add_grade', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
        ctx.wizard.state.contactData = {};
        console.log(ctx.callbackQuery.data)
        ctx.wizard.state.contactData.UUID = ctx.callbackQuery.data;
        console.log(ctx.wizard.state.contactData.UUID)
        ctx.reply('Оценка по критерию @Драйверы к росту фундаментал@:', Keyboards.insertGrade());
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.deleteMessage()
        if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНажми Оценить идею еще раз!')
            return ctx.scene.leave();
        }
        else {
            ctx.wizard.state.contactData.first_criterion = ctx.callbackQuery.data;
            ctx.reply('Оценка по критерию @Точка входа по тех анализу@:', Keyboards.insertGrade());
            return ctx.wizard.next();
        }
    },
    (ctx) => {
        ctx.deleteMessage()
        if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНажми Оценить идею еще раз!')
            return ctx.scene.leave();
        }
        else {
            ctx.wizard.state.contactData.second_criterion = ctx.callbackQuery.data;
            ctx.reply('Оценка по критерию @Корректность типа стратегии@:', Keyboards.insertGrade());
            return ctx.wizard.next();
        }
    },
    (ctx) => {
        ctx.deleteMessage()
        if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНажми Оценить идею еще раз!')
            return ctx.scene.leave();
        }
        else {
            ctx.wizard.state.contactData.third_criterion = ctx.callbackQuery.data;
            ctx.reply('Введите комментарий:');
            return ctx.wizard.next();
        }
    },
    (ctx) => {
        ctx.wizard.state.contactData.comment = ctx.message.text;
        let message = messageFormat.managerMessage(ctx.wizard.state.contactData.first_criterion, ctx.wizard.state.contactData.second_criterion,
            ctx.wizard.state.contactData.third_criterion, ctx.wizard.state.contactData.comment);
        ctx.reply(message, Keyboards.acceptIdea())
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.deleteMessage()
        if (typeof ctx.message == 'object'){
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНапиши Оценить идею еще раз!')
        }
        else if(ctx.callbackQuery.data == 'ОК'){
            console.log(ctx.callbackQuery)
            console.log(response)
            if (response == 'undefined'){
                ctx.reply('Ошибка формата текста! Сообщение не отправлено!')
            }
            else {
                let messageSend = messageFormat.generate_message(ctx.callbackQuery.from.username, ctx.wizard.state.contactData.ticker, ctx.wizard.state.contactData.order,
                    ctx.wizard.state.contactData.percent, ctx.wizard.state.contactData.price_enter, ctx.wizard.state.contactData.TP, ctx.wizard.state.contactData.SL,
                    ctx.wizard.state.contactData.time, ctx.wizard.state.contactData.source, ctx.wizard.state.contactData.risk,
                    ctx.wizard.state.contactData.comment)
                await generateMessage.sendIdea(ctx, messageSend, response[0].id)
                ctx.reply('Идея отправлена риск-менеджерам.')
            }
        }
        else if(ctx.callbackQuery.data == 'ОТМЕНА'){
            ctx.reply('Отправка идеи отменена.')
        }
        return ctx.scene.leave();
    },


)



module.exports = { gradeDataWizard }