const WizardScene = require('telegraf/scenes/wizard')

const Keyboards = require('/root/strategy_bot/keyboards/keyboards')
const messageFormat = require('/root/strategy_bot/utils/message_format')
const gradeController = require('/root/strategy_bot/contoller/grade.Controller')
const strategyController = require('/root/strategy_bot/contoller/strategy.Controller')
const generateMessage = require('/root/strategy_bot/utils/generate_message')

const gradeDataWizard = new WizardScene('add_grade', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
        ctx.wizard.state.contactData = {};
        ctx.wizard.state.contactData.username = ctx.callbackQuery.from.username;
        ctx.wizard.state.contactData.userid = ctx.callbackQuery.from.id;
        let list_data = ctx.callbackQuery.data.split(' ');
        ctx.wizard.state.contactData.UUID = list_data[1];
        ctx.reply('Оцени драйверы к росту фундаментала:', Keyboards.insertGrade());
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
            ctx.reply('Оцени точку входа по тех анализу:', Keyboards.insertGrade());
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
            ctx.reply('Оцени корректность типа стратегии:', Keyboards.insertGrade());
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
            let response = await gradeController.createGrade(ctx.wizard.state.contactData)
            let boolPosted = await gradeController.checkResponse(ctx.wizard.state.contactData.UUID)
            console.log(boolPosted)
            ctx.reply('Оценка отправлена')
            if (typeof response == 'undefined'){
                ctx.reply('Ошибка формата текста! Сообщение не отправлено!')
            }
            else if (boolPosted == true){
                await strategyController.updateApprove(ctx.wizard.state.contactData.UUID)
                await generateMessage.returnGrades(ctx, ctx.wizard.state.contactData.UUID)
            }
        }
        else if(ctx.callbackQuery.data == 'ОТМЕНА'){
            ctx.reply('Отправка идеи отменена.')
        }

        return ctx.scene.leave();
    },


)



module.exports = { gradeDataWizard }