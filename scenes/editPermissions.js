const WizardScene = require('telegraf/scenes/wizard')

const userController = require('../contoller/user.Controller')
const Keyboards = require('../keyboards/keyboards')

const editPermissionsWizard = new WizardScene(
    'edit_permissions', (ctx) => {
        ctx.reply('Введите @username пользователя:')
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
            }
            else {
                let action = 'editStatus'
                ctx.reply(`Определите новые права для ${username}`, Keyboards.addUser(action, userSearch[0].id_telegram))
            }
        }
        else {
            await ctx.reply('Ошибка ввода username.')
        }
        return ctx.scene.leave();
    });


module.exports = { editPermissionsWizard }