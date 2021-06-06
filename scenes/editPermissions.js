const WizardScene = require('telegraf/scenes/wizard')

const userController = require('/root/strategy_bot/contoller/user.Controller')
const Keyboards = require('/root/strategy_bot/keyboards/keyboards')

const editPermissionsWizard = new WizardScene(
    'edit_permissions', (ctx) => {
        ctx.reply('Введите username пользователя:')
        ctx.wizard.state.contactData = {};
        return ctx.wizard.next();
    },
    async (ctx) => {
        let username = ctx.message.text;
        if (username.startsWith('@')){
            let user = username.split('@');
            let userSearch = await userController.lookUpUserByUsername(user[1]);
            if (userSearch.length == 0){
                ctx.reply('Пользователь не зарегистрирован')
                return ctx.scene.leave();
            }
            else {
                ctx.reply(`Определите новые права для ${username}`, Keyboards.addUser(userSearch[0].id_telegram))
                return ctx.scene.leave();
            }
        }
        else {
            await ctx.reply('Ошибка ввода username.')
            ctx.wizard.back();
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
        }
    }
)


module.exports = { editPermissionsWizard }