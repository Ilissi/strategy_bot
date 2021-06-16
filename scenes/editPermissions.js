const WizardScene = require('telegraf/scenes/wizard')

const userController = require('../contoller/user.Controller')
const Keyboards = require('../keyboards/keyboards')

const editPermissionsWizard = new WizardScene(
    'edit_permissions', (ctx) => {
        ctx.replyWithHTML('Введите <b>@username</b> пользователя:')
        ctx.wizard.state.contactData = {};
        return ctx.wizard.next();
    },
    async (ctx) => {
        let username = ctx.message.text;
        if (username.startsWith('@')){
            let user = username.split('@');
            let userSearch = await userController.lookUpUserByUsername(user[1]);
            if (userSearch.length == 0){
                await ctx.replyWithHTML('Пользователь <b>не зарегистрирован</b>.')
            }
            else {
                let action = 'editStatus'
                await ctx.reply(`Определите <b>новые права</b> для ${username}:`, Keyboards.addUser(action, userSearch[0].id_telegram))
            }
        }
        else {
            await ctx.replyWithHTML('Ошибка ввода <b>@username</b>.')
        }
        return ctx.scene.leave();
    });


module.exports = { editPermissionsWizard }