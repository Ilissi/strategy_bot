const WizardScene = require('telegraf/scenes/wizard')

const strategyController = require('../contoller/strategy.Controller')

const editTP_DataWizard = new WizardScene(
    'edit_sl', // first argument is Scene_ID, same as for BaseScene
     ctx => {
        ctx.deleteMessage()
        ctx.reply('Введите ticket:')
        ctx.wizard.state.contactData = {};
        return ctx.wizard.next();
    },
    async (ctx) => {
        const result = await strategyController.getStrategyByTicker(ctx.message.text)
        console.table(result)
        ctx.wizard.state.contactData = {};
        return ctx.wizard.next();
    },

);

module.exports = { editTP_DataWizard }