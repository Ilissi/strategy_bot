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
            Markup.callbackButton('Sell', 'Sell'),
            Markup.callbackButton('Buy', 'Buy')]).extra();
    }

    addUser(telegram_id) {
        return Markup.inlineKeyboard([
            [Markup.callbackButton('Аналитик', `updateStatus ${telegram_id} Аналитик`)],
            [Markup.callbackButton('Риск-менеджер', `updateStatus ${telegram_id} Риск-менеджер`)],
            [Markup.callbackButton('Администратор', `updateStatus ${telegram_id} Администратор`)],
            [Markup.callbackButton('Отклонить', `updateStatus ${telegram_id} Отклонить`)]]).extra();
    }

    acceptIdea() {
        return Markup.inlineKeyboard([
            Markup.callbackButton('ОК', 'ОК'),
            Markup.callbackButton('ОТМЕНА', 'ОТМЕНА')]).extra();
    }

    riskKeyboard(){
        return Markup.inlineKeyboard([
            [Markup.callbackButton('4', '4'),
            Markup.callbackButton('5', '5')],
            [Markup.callbackButton('2', '2'),
            Markup.callbackButton('3', '3')],
            [Markup.callbackButton('1', '1')]]).extra();
    }

    acceptGrade(uuid, ticker){
        return Markup.inlineKeyboard([Markup.callbackButton('Оценить идею', `grade ${uuid} ${ticker}`)]).extra();
    }

    insertGrade(){
        return Markup.inlineKeyboard([
            [Markup.callbackButton('1', '1'), Markup.callbackButton('2', '2'), Markup.callbackButton('3', '3')],
            [Markup.callbackButton('4', '4'), Markup.callbackButton('5', '5'), Markup.callbackButton('6', '6')],
            [Markup.callbackButton('7', '7'), Markup.callbackButton('8', '8'), Markup.callbackButton('9', '9')],
            [Markup.callbackButton('10', '10')]]).extra();
    }

    acceptIdeaChannel(uuid){
        return Markup.inlineKeyboard([[Markup.callbackButton('Разместить в канал', `channel ${uuid}`)],
            [Markup.callbackButton('Разместить в WatchList', `watchlist ${uuid}`)],
            [Markup.callbackButton('Отказ', `cancel ${uuid}`)]]).extra();
    }
}

module.exports = new Keyboards()