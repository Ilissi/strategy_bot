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

    addUser(action, telegram_id) {
        return Markup.inlineKeyboard([
            [Markup.callbackButton('Аналитик', `${action} ${telegram_id} Аналитик`)],
            [Markup.callbackButton('Администратор', `${action} ${telegram_id} Администратор`)],
            [Markup.callbackButton('Отключить', `${action} ${telegram_id} Отключить`)]]).extra();
    }

    acceptIdea() {
        return Markup.inlineKeyboard([
            Markup.callbackButton('ОК', 'ОК'),
            Markup.callbackButton('ОТМЕНА', 'ОТМЕНА')]).extra();
    }

    riskKeyboard(){
        return Markup.inlineKeyboard([
            [Markup.callbackButton('4️⃣', '4'),
            Markup.callbackButton('5️⃣', '5')],
            [Markup.callbackButton('2️⃣', '2'),
            Markup.callbackButton('3️⃣', '3')],
            [Markup.callbackButton('1️⃣', '1')]]).extra();
    }

    acceptGrade(uuid, ticker){
        return Markup.inlineKeyboard([Markup.callbackButton('Оценить идею', `grade ${uuid} ${ticker}`)]).extra();
    }

    insertGrade(){
        return Markup.inlineKeyboard([
            [Markup.callbackButton('1️⃣', '1'), Markup.callbackButton('2️⃣', '2'), Markup.callbackButton('3️⃣', '3')],
            [Markup.callbackButton('4️⃣', '4'), Markup.callbackButton('5️⃣', '5'), Markup.callbackButton('6️⃣', '6')],
            [Markup.callbackButton('7️⃣', '7'), Markup.callbackButton('8️⃣', '8'), Markup.callbackButton('9️⃣', '9')],
            [Markup.callbackButton('🔟', '10')]]).extra();
    }

    acceptIdeaChannel(uuid){
        return Markup.inlineKeyboard([[Markup.callbackButton('Разместить в канал', `channel ${uuid}`)],
            [Markup.callbackButton('Разместить в WatchList', `watchlist ${uuid}`)],
            [Markup.callbackButton('Отказ', `cancels ${uuid}`)]]).extra();
    }

    changePermissions(user_id){
        return Markup.inlineKeyboard([Markup.callbackButton('Поменять роль', `change ${user_id}`)]).extra();
    }

    takeProfit(uuid) {
        return Markup.inlineKeyboard([Markup.callbackButton('Зафиксировать доход', `tp ${uuid}`)]).extra();
    }

    stopLoss(uuid) {
        return Markup.inlineKeyboard([Markup.callbackButton('Зафиксировать убыток', `sl ${uuid}`)]).extra();
    }

    averageIdea(uuid) {
        return Markup.inlineKeyboard([Markup.callbackButton('Усреднить идею', `average ${uuid}`)]).extra();
    }

    acceptWatchlist() {
        return Markup.inlineKeyboard([Markup.callbackButton('Отправить', 'Отправить')]).extra();
    }
}

module.exports = new Keyboards()