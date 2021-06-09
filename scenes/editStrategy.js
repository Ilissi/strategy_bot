const WizardScene = require('telegraf/scenes/wizard')

const strategyController = require('../contoller/strategy.Controller')

const editDataWizard = new WizardScene (
    'edit_strategy', (ctx) => {
        ctx.reply('Введите ticket:');
        ctx.wizard.state.contactData = {};
        return ctx.wizard.next();
    },
    async (ctx) => {
        const result = await strategyController.getStrategyByTicker(ctx.message.text)
        if (result.length == 0){
            ctx.reply('Стратегий с этим ticket не найдено.');
            return ctx.scene.leave();
        }
        else {
            for (const res of result) {
                console.log(typeof(res));
            }
        }
    });

module.exports = { editDataWizard }