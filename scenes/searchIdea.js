const WizardScene = require('telegraf/scenes/wizard')
const Telegraf = require('telegraf')

const strategyController = require('../contoller/strategy.Controller')
const userController = require('../contoller/user.Controller')
const messageFormat = require('../utils/message_format')
const filters = require('../utils/filters')
const activityController = require('../contoller/activity.Controller')
const bot = new Telegraf(process.env.BOT_TOKEN)

const searchIdeaWizard = new WizardScene(
    'search_idea',
    (ctx) => {
        ctx.reply('Тикет:');
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
        else if (filters.checkCallback(ctx)){
            return ctx.scene.leave();
        }
        else {
            let ticker = ctx.message.text;
            let user_id = ctx.message.from.id;
            let ideas = await strategyController.getStrategyByTicker(ticker);
            if (ideas.length == 0) {
                ctx.reply('Идеи не найдены!\nПопробуй другой тикер.');
            } else {
                for (let i = 0; i < ideas.length; i++) {
                    let user = await userController.lookUpUser(ideas[i].id_telegram);
                    let message = messageFormat.searchIdea(user[0].nickname, ideas[i]);
                    await bot.telegram.sendMessage(user_id, message, {parse_mode: 'HTML'})
                }
            }
            return ctx.scene.leave();
        }});

module.exports = { searchIdeaWizard }