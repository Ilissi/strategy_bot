function returnFormat(TP, SL){
    let stringTP, stringSL;
    if (TP == '-' && SL == '-') {
        stringTP = TP;
        stringSL = SL;
    }
    else if (TP == '-' && SL != '-'){
        stringTP = TP;
        stringSL = SL + '$';
    }
    else if (TP != '-' && SL == '-'){
        stringTP = TP + '$';
        stringSL = SL;
    }
    else {
        stringTP = TP + '$';
        stringSL = SL + '$';
    }
    return {'TP': stringTP, 'SL': stringSL}
}


function PrefInt(number, len) {
    if (number.length < len)
    {
        return (Array(len).join('0') + number).slice(-len);
    }
}


function generate_message(recordNumber, username, ticket, url, strategy, order, entry_price, TP, SL, source, comment) {
    let getFormat = returnFormat(TP, SL);
    let message = `<b>№${PrefInt(recordNumber, 4)}</b> @${username}\n💼 <a href="${url}">${ticket}</a>\n<b>🟢 Вход:</b> ${entry_price}$\n<b>🟠 Цель:</b> ${getFormat.TP}\n<b>🔴 Стоп:</b> ${getFormat.SL}\n<b>Стратегия:</b> ${strategy}\n<b>Тип:</b> ${order}\n<b>Источник:</b> ${source}\n<b>Комментарий:</b> ${comment}`;
    return message
}


function managerMessage(first_criterion, second_criterion, entry_price, portfolio, comment, type){
    let bType;
    if (type.includes('Сохранить')){
        bType = 'Да';
    }
    else {
        bType = 'Нет';
    }
    let message = `<b>Оценка торговой идеи:</b> ${first_criterion}\n<b>Оценка точки входа:</b> ${second_criterion}\n<b>Альтернативная точка входа:</b> ${entry_price}\n<b>Соответствие портфель:</b> ${bType}\n<b>Возьмешь себе:</b> ${portfolio}\n<b>Коментарий:</b> ${comment}`;
    return message;
}


function getTime(){
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let message = date + "." + month + "." + year + " " + hours + ":" + minutes
    return {"message": message, "timestamp":ts}
}


function generateList(first_array, second_array) {
    if (typeof second_array == 'undefined'){
        return first_array;
    }
    else {
        let newArray = first_array.filter(({ id_telegram}) =>
            !second_array.some(exclude => exclude.user_id === id_telegram))
        return newArray;
    }
}


function generateFinishMessage(firstArray, secondArray) {
    return `Оценили <b>${firstArray}/${secondArray}</b>`
}


function generateString(grade, averageCriterion){
    return `${grade} <b>${averageCriterion}</b>`
}


function generateStringSummary(grade, averageCriterion, summary){
    return `${grade} <b>${averageCriterion}/${summary}</b>`
}


function generateComment(username, comment){
    return `\n@${username}: \n${comment} `
}

function generatePrice(price){
    return `<b>Цена входа:</b> ${price}`
}


function publishIdea(idea, title, username){
    let getFormat = returnFormat(idea.tp, idea.sl);
    return `<b>${title}</b>\n<b>№${PrefInt((idea.id).toString(), 4)}</b> @${username}\n💼 <a href="${idea.url}">${idea.ticker}</a>\n<b>🟢 Вход:</b> ${idea.entry_price}$\n<b>🟠 Цель:</b> ${getFormat.TP}\n<b>🔴 Стоп:</b> ${getFormat.SL}\n<b>Стратегия:</b> ${idea.type}\n<b>Тип:</b> ${idea.order_type}\n<b>Источник:</b> ${idea.source}\n<b>Комментарий:</b> ${idea.comment}\n`;
}


function publishIdeaAdmin(idea, title, username, admin, commentAdmin, priceAdmin){
    let getFormat = returnFormat(idea.tp, idea.sl);
    return `<b>${title}</b>\n<b>№${PrefInt((idea.id).toString(), 4)}</b> @${username}\n💼 <a href="${idea.url}">${idea.ticker}</a>\n<b>🟢 Вход:</b> ${idea.entry_price}$\n<b>🟠 Цель:</b> ${getFormat.TP}\n<b>🔴 Стоп:</b> ${getFormat.SL}\n<b>Стратегия:</b> ${idea.type}\n<b>Тип:</b> ${idea.order_type}\n<b>Источник:</b> ${idea.source}\n<b>Комментарий:</b> ${idea.comment}\n<b>Цена входа администратора:</b> ${priceAdmin}\n<b>Администратор @${admin}:</b> ${commentAdmin} `;
}


function searchIdea(username, idea){
    let getFormat = returnFormat(idea.tp, idea.sl);
    return `<b>№${PrefInt((idea.id).toString(), 4)}</b> @${username}\n💼 <a href="${idea.url}">${idea.ticker}</a>\n<b>🟢 Вход:</b> ${idea.entry_price}$\n<b>🟠 Цель:</b> ${getFormat.TP}\n<b>🔴 Стоп:</b> ${getFormat.SL}\n<b>Стратегия:</b> ${idea.type}\n<b>Тип:</b> ${idea.order_type}\n<b>Источник:</b> ${idea.source}\n<b>Комментарий:</b> ${idea.comment}\n<b>Статус:</b> ${idea.status}`;
}

function showUser(user){
    return `<b>Пользователь:</b> @${user.nickname}\n<b>Права:</b> ${user.permissions}`
}

function commentAdmin(place, uuid, idea, username, comment, price) {
    return `<b>Размещена в ${place} ID:</b> ${uuid}\n<b>Тикер:</b> ${idea[0].ticker}\n<b>Комментарий: ${comment}</b>\n<b>Цена входа: ${price}</b>\n<b>Решение принял:</b> @${username}`
}


module.exports = { generate_message, managerMessage, getTime, generateList, generateFinishMessage, generateStringSummary, PrefInt,
    generateString, generateComment, publishIdea, searchIdea, showUser, publishIdeaAdmin, commentAdmin, generatePrice}
