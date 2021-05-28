const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')

require('dotenv').config()


const contactDataWizard = require('./scenes/addStrategy').contactDataWizard
const editDataWizard = require('./scenes/editStrategy').editDataWizard



const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Stage([contactDataWizard, editDataWizard])
bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => {
    let userFirstName = ctx.message.from.first_name
    let message = ` Hello master ${userFirstName}, i am OCR bot your humble servant. \n
    Where would you like to extract text from ?`

    let options = Markup.inlineKeyboard([
        Markup.callbackButton('Extract from 🖼️', 'extractFromImage'),
        Markup.callbackButton('Extract from 🎬', 'extractFromVideo'),
    ]).extra()
    ctx.reply(message, options)
})



bot.command('add', ctx => {
    ctx.scene.enter('add_strategy');
});

bot.command('edit', ctx => ctx.reply('Что нужно изменить в стратегии?',     Markup.inlineKeyboard([
    [Markup.callbackButton('Внесение изменений по SL', 'edit_sl')],
    [Markup.callbackButton('Внесение изменений по TP', 'edit_tp')],
    [Markup.callbackButton('Усреднить цену по идее', 'medium')],
    [Markup.callbackButton('Закрыть идею при или до наступления TP/SL', 'close')]
]).extra()));

bot.action('edit_sl', ctx => {
    ctx.scene.enter('edit_sl');
});

bot.action('edit_tp', ctx => {
    ctx.scene.enter('edit_tp');
});

bot.action('medium', ctx => {
    ctx.scene.enter('medium');
});

bot.action('close', ctx => {
    ctx.scene.enter('close');
});

bot.command('edit_strategy', ctx => {
    ctx.scene.enter('edit_strategy')
});


bot.launch()