const WizardScene = require('telegraf/scenes/wizard')

const Keyboards = require('../keyboards/keyboards')
const messageFormat = require('../utils/message_format')
const gradeController = require('../contoller/grade.Controller')
const strategyController = require('../contoller/strategy.Controller')
const generateMessage = require('../utils/generate_message')



const gradeDataWizard = new WizardScene(
    'add_grade', // first argument is Scene_ID, same as for BaseScene
    async (ctx) => {
        ctx.wizard.state.contactData = {};
        ctx.wizard.state.contactData.username = ctx.callbackQuery.from.username;
        ctx.wizard.state.contactData.userid = ctx.callbackQuery.from.id;
        let list_data = ctx.callbackQuery.data.split(' ');
        ctx.wizard.state.contactData.UUID = list_data[1];
        let idea = await strategyController.getStrategyByUUID(ctx.wizard.state.contactData.UUID);
        if (idea[0].approved != true){
            let checkResponse = await gradeController.checkAccepted(ctx.wizard.state.contactData.UUID, ctx.wizard.state.contactData.userid);
            if (checkResponse.length == 0){
                ctx.reply('Оцени драйверы к росту фундаментала:', Keyboards.insertGrade());
                return ctx.wizard.next();
            }
            else {
                ctx.reply('Вы уже оценили эту идею!');
                return ctx.scene.leave();
            }
        }
        else {
            ctx.reply('Решение по этой идеи принято.')
            return ctx.scene.leave();
        }
    },
    async (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.deleteMessage()
            return ctx.scene.leave();
        }
        else if (typeof ctx.message == 'object'){
            ctx.deleteMessage()
            await ctx.replyWithHTML('Вы сломали меня! Нажимать нужно на кнопку\nНажми <b>Оценить</b> идею еще раз!')
            return ctx.scene.leave();
        }
        else if(ctx.callbackQuery.data.startsWith('grade')){
            await ctx.reply('Что-то пошло не так! Попробуй оценить еще раз!')
        }
        else {
            ctx.deleteMessage()
            ctx.wizard.state.contactData.first_criterion = ctx.callbackQuery.data;
            ctx.reply('Оцени точку входа по тех анализу:', Keyboards.insertGrade());
            return ctx.wizard.next();
        }
    },
    async (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.deleteMessage()
            return ctx.scene.leave();
        }
        else if (typeof ctx.message == 'object'){
            ctx.deleteMessage()
            ctx.reply('Вы сломали меня! Нажимать нужно на кнопку\nНажми Оценить идею еще раз!')
            return ctx.scene.leave();
        }
        else if(ctx.callbackQuery.data.startsWith('grade')){
            await ctx.reply('Что-то пошло не так! Попробуй оценить еще раз!')
        }
        else {
            ctx.deleteMessage()
            ctx.wizard.state.contactData.second_criterion = ctx.callbackQuery.data;
            ctx.reply('Оцени корректность типа стратегии:', Keyboards.insertGrade());
            return ctx.wizard.next();
        }
    },
    async (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            ctx.deleteMessage()
            return ctx.scene.leave();
        }
        else if (typeof ctx.message == 'object'){
            ctx.deleteMessage()
            await ctx.replyWithHTML('Вы сломали меня! Нажимать нужно на кнопку\nНажми <b>Оценить</b> идею еще раз!')
            return ctx.scene.leave();
        }
        else if(ctx.callbackQuery.data.startsWith('grade')){
            await ctx.reply('Что-то пошло не так! Попробуй оценить еще раз!')
        }
        else {
            ctx.deleteMessage()
            ctx.wizard.state.contactData.third_criterion = ctx.callbackQuery.data;
            ctx.reply('Введите комментарий:');
            return ctx.wizard.next();
        }
    },
    async (ctx) => {
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            return ctx.scene.leave();
        }
        else if (typeof ctx.callbackQuery == 'object'){
            ctx.deleteMessage()
            ctx.replyWithHTML('Вы сломали меня! Не нажимай кнопки\nНажми <b>Оценить идею</b> еще раз!')
            return ctx.scene.leave();
        }
        ctx.wizard.state.contactData.comment = ctx.message.text;
        let message = messageFormat.managerMessage(ctx.wizard.state.contactData.first_criterion, ctx.wizard.state.contactData.second_criterion,
            ctx.wizard.state.contactData.third_criterion, ctx.wizard.state.contactData.comment);
        await ctx.replyWithHTML(message, Keyboards.acceptIdea())
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.deleteMessage()
        if (generateMessage.checkMessage(ctx, ctx.message) == true){
            return ctx.scene.leave();
        }
        else if (typeof ctx.message == 'object'){
            await ctx.replyWithHTML('Вы сломали меня! Нажимать нужно на кнопку\nНажми <b>Оценить</b> идею еще раз!')
        }
        else if(ctx.callbackQuery.data.startsWith('grade')){
            await ctx.replyWithHTML('Что-то пошло не так! Попробуй оценить еще раз! ')
        }
        else if(ctx.callbackQuery.data == 'ОК'){
            let response = await gradeController.createGrade(ctx.wizard.state.contactData)
            let boolPosted = await gradeController.checkResponse(ctx.wizard.state.contactData.UUID)
            await ctx.reply('Оценка отправлена.')
            if (typeof response == 'undefined'){
                ctx.reply('Ошибка формата текста! Сообщение не отправлено!')
            }
            else if (boolPosted == true){
                await strategyController.updateApprove(true, ctx.wizard.state.contactData.UUID)
                await generateMessage.returnGrades(ctx, ctx.wizard.state.contactData.UUID)
            }
        }
        else if(ctx.callbackQuery.data == 'ОТМЕНА'){
            await ctx.reply('Отправка идеи отменена.')
        }
        return ctx.scene.leave();
    },);


module.exports = { gradeDataWizard }