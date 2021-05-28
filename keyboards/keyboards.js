const Markup = require('telegraf/markup')

class Keyboards {
    getStrategy() {
        return Markup.inlineKeyboard([
            [Markup.callbackButton('Инвестиционная️', 'Инвестиционная️')],
            [Markup.callbackButton('Среднесрочная', 'Среднесрочная')],
            [Markup.callbackButton('Торговая(swing)', 'Торговая(swing)')],
            [Markup.callbackButton('Повышенный риск', 'Повышенный риск')],
        ]).extra();
    }

    strategySource() {
        return Markup.inlineKeyboard([
            [Markup.callbackButton('Личная', 'Личная')],
            [Markup.callbackButton('Платный источник', 'Платный источник')]
        ]).extra();
    }

    confirmStrategy() {
        return Markup.inlineKeyboard(
            [Markup.callbackButton('Cтратегия личная', 'Личная')]).extra()
    }

    getOrder() {
        return Markup.inlineKeyboard([
            [Markup.callbackButton('Sell', 'Sell')],
            [Markup.callbackButton('Buy', 'Buy')]]).extra();
    }

}

module.exports = new Keyboards()