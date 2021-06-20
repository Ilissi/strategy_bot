const WizardScene = require('telegraf/scenes/wizard')

const Keyboards = require('../keyboards/keyboards')
const messageFormat = require('../utils/message_format')
const gradeController = require('../contoller/grade.Controller')
const strategyController = require('../contoller/strategy.Controller')
const generateMessage = require('../utils/generate_message')
const filters = require('../utils/filters')
const activityController = require('../contoller/activity.Controller')


async function checkGrade(ctx){
    await activityController.updateActivityRecord(ctx.chat.id);
    if(ctx.callbackQuery.data == 'ОК'){
        ctx.deleteMessage()
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
}

const gradeDataWizard = new WizardScene(
    'add_grade', // first argument is Scene_ID, same as for BaseScene
    async (ctx) => {
        await activityController.updateActivityRecord(ctx.chat.id);
        ctx.wizard.state.contactData = {};
        ctx.wizard.state.contactData.username = ctx.callbackQuery.from.username;
        ctx.wizard.state.contactData.userid = ctx.callbackQuery.from.id;
        let list_data = ctx.callbackQuery.data.split(' ');
        ctx.wizard.state.contactData.UUID = list_data[1];
        let idea = await strategyController.getStrategyByUUID(ctx.wizard.state.contactData.UUID);
        if (idea[0].approved != true){
            let checkResponse = await gradeController.checkAccepted(ctx.wizard.state.contactData.UUID, ctx.wizard.state.contactData.userid);
            if (checkResponse.length == 0){
                ctx.reply('Оцени Торговую идею:\nПортфель/Тикер/Торговый тезис', Keyboards.insertGrade());
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
            const idea = await strategyController.getStrategyByUUID(ctx.wizard.state.contactData.UUID);
            ctx.wizard.state.contactData.first_criterion = ctx.callbackQuery.data;
            ctx.reply('Сохранить или переложить в другой портфель?', Keyboards.saveOrEdit(idea[0].type));
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
            await ctx.reply('Оцени предложенную точку входа по ТА:', Keyboards.insertGrade())
            ctx.wizard.state.contactData.type = ctx.callbackQuery.data;
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
            ctx.wizard.state.contactData.second_criterion = ctx.callbackQuery.data;
            ctx.reply('Предложишь альтернативный вход?', Keyboards.acceptPoint());
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
        else if (ctx.callbackQuery.data == 'ДА'){
            await ctx.reply('Альтернативная точка входа:')
            return ctx.wizard.next()
        }
        else if(ctx.callbackQuery.data == '-') {
            ctx.deleteMessage()
            ctx.wizard.state.contactData.price_enter = ctx.callbackQuery.data;
            ctx.reply('Возьмешь себе в портфель?', Keyboards.portfolio());
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
        else if (typeof ctx.wizard.state.contactData.price_enter == 'undefined'){
            if (filters.checkCallback(ctx)){
                return ctx.scene.leave();
            }
            else {
                ctx.wizard.state.contactData.price_enter = ctx.message.text;
                ctx.reply('Возьмешь себе в портфель?', Keyboards.portfolio());
                return ctx.wizard.next();
            }
        }
        else {
            if (filters.checkText(ctx)){
                return ctx.scene.leave();
            }
            else {
                ctx.deleteMessage();
                ctx.wizard.state.contactData.portfolio = ctx.callbackQuery.data;
                ctx.reply('Твой комментарий к торговой идеи, что изменить?');
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
        else if (typeof ctx.wizard.state.contactData.portfolio == 'undefined'){
            if (filters.checkText(ctx)){
                return ctx.scene.leave();
            }
            else {
                ctx.deleteMessage();
                ctx.wizard.state.contactData.portfolio = ctx.callbackQuery.data;
                ctx.reply('Твой комментарий к торговой идеи, что изменить?');
                return ctx.wizard.next();
            }
        }
        else {
            if (filters.checkCallback(ctx)){
                return ctx.scene.leave();
            }
            else {
                ctx.wizard.state.contactData.comment = ctx.message.text;
                let message = messageFormat.managerMessage(ctx.wizard.state.contactData.first_criterion, ctx.wizard.state.contactData.second_criterion, ctx.wizard.state.contactData.price_enter,
                    ctx.wizard.state.contactData.portfolio, ctx.wizard.state.contactData.comment, ctx.wizard.state.contactData.type);
                await ctx.replyWithHTML(message, Keyboards.acceptIdea())
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
        else if (typeof ctx.wizard.state.contactData.comment == 'undefined'){
            if (filters.checkCallback(ctx)){
                return ctx.scene.leave();
            }
            else {
                ctx.wizard.state.contactData.comment = ctx.message.text;
                let message = messageFormat.managerMessage(ctx.wizard.state.contactData.first_criterion, ctx.wizard.state.contactData.second_criterion, ctx.wizard.state.contactData.price_enter,
                    ctx.wizard.state.contactData.portfolio, ctx.wizard.state.contactData.comment, ctx.wizard.state.contactData.type);
                await ctx.replyWithHTML(message, Keyboards.acceptIdea())
                return ctx.wizard.next();
            }
        }
        else {
            if (filters.checkText(ctx)){
                return ctx.scene.leave();
            }
            else {
                await checkGrade(ctx);
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
        else if (filters.checkText(ctx)){
            return ctx.scene.leave();
        }
        else {
            await checkGrade(ctx);
        }
    });


module.exports = { gradeDataWizard }