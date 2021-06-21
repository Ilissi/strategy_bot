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


function generateFinishMessage(firstArray, secondArray) {
    return `<b>Оценили:</b> ${firstArray}/${secondArray}`
}


function generateString(grade, averageCriterion){
    return `<b>${grade}</b> ${averageCriterion}`
}


function generateStringSummary(grade, averageCriterion, summary){
    return `<b>${grade}</b> ${averageCriterion}/${summary}`
}


function generatePoint(arrayEntry){
    let pushStringFirst = 'Альтернативных точек входа нету';
    let pushStringSecond = 'Альтернативная точка входа';
    let pushStringThird= 'Альтернативные точки входа';
    let message;
    if (arrayEntry.length == 0){
        message = `<b>${pushStringFirst}</b>`
    }
    else if (arrayEntry.length == 1){
        message = `<b>${pushStringSecond}:</b> ${arrayEntry[0]}`
    }
    else {
        let insertString = arrayEntry.join(' / ')
        message = `<b>${pushStringThird}:</b> ${insertString}`
    }
    return message;

}


function generateGrade(gradeMark, grade){
    return `<b>${gradeMark}</b> ${grade}`
}


function generateComment(username, comment){
    return `\n@${username}: \n${comment} `
}

function generatePrice(price){
    return `<b>Цена входа:</b> ${price}`
}


function publishIdea(idea, title, username){
    let getFormat = returnFormat(idea.tp, idea.sl);
    return `<b>${title}</b>\n<b>№${PrefInt((idea.id).toString(), 4)}</b> @${username}\n💼 <a href="${idea.url}">${idea.ticker}</a>\n<b>🟢 Вход:</b> ${idea.entry_price}$\n<b>🟠 Цель:</b> ${getFormat.TP}\n<b>🔴 Стоп:</b> ${getFormat.SL}\n<b>Стратегия:</b> ${idea.type}\n<b>Тип:</b> ${idea.order_type}\n<b>Источник:</b> ${idea.source}\n<b>Торговая идея:</b> ${idea.comment}\n<b>Комментарий админа:</b>${idea.comment_admin}`;
}


function publishIdeaAdmin(idea, title, username, admin, commentAdmin, priceAdmin){
    let getFormat = returnFormat(idea.tp, idea.sl);
    return `<b>${title}</b>\n<b>№${PrefInt((idea.id).toString(), 4)}</b> @${username}\n💼 <a href="${idea.url}">${idea.ticker}</a>\n<b>🟢 Вход:</b> ${idea.entry_price}$\n<b>🟠 Цель:</b> ${getFormat.TP}\n<b>🔴 Стоп:</b> ${getFormat.SL}\n<b>Стратегия:</b> ${idea.type}\n<b>Тип:</b> ${idea.order_type}\n<b>Источник:</b> ${idea.source}\n<b>Комментарий:</b> ${idea.comment}\n<b>Цена входа администратора:</b> ${priceAdmin}\n<b>Администратор @${admin}:</b> ${commentAdmin} `;
}


function searchIdea(username, idea){
    let getFormat = returnFormat(idea.tp, idea.sl);
    if (idea.comment_admin!=null) {
        return `<b>№${PrefInt((idea.id).toString(), 4)}</b> @${username}\n💼 <a href="${idea.url}">${idea.ticker}</a>\n<b>🟢 Вход:</b> ${idea.entry_price}$\n<b>🟠 Цель:</b> ${getFormat.TP}\n<b>🔴 Стоп:</b> ${getFormat.SL}\n<b>Стратегия:</b> ${idea.type}\n<b>Тип:</b> ${idea.order_type}\n<b>Источник:</b> ${idea.source}\n<b>Торговая идея:</b> ${idea.comment}\n<b>Комментарий админа:</b>${idea.comment_admin}\n<b>Статус:</b> ${idea.status}`;
    }
    else return `<b>№${PrefInt((idea.id).toString(), 4)}</b> @${username}\n💼 <a href="${idea.url}">${idea.ticker}</a>\n<b>🟢 Вход:</b> ${idea.entry_price}$\n<b>🟠 Цель:</b> ${getFormat.TP}\n<b>🔴 Стоп:</b> ${getFormat.SL}\n<b>Стратегия:</b> ${idea.type}\n<b>Тип:</b> ${idea.order_type}\n<b>Источник:</b> ${idea.source}\n<b>Торговая идея:</b> ${idea.comment}\n<b>Идея не подтверждена администратором</b>`;
}

function showUser(user){
    return `<b>Пользователь:</b> @${user.nickname}\n<b>Права:</b> ${user.permissions}`
}

function commentAdmin(place, uuid, idea, username, comment, price) {
    return `<b>Размещена в ${place}</b>\n<b>ID:</b> ${uuid}\n<b>Тикер:</b> ${idea[0].ticker}\n<b>Комментарий: ${comment}</b>\n<b>Цена входа: ${price}</b>\n<b>Решение принял:</b> @${username}`
}


module.exports = { generate_message, managerMessage, getTime, generateFinishMessage, generateStringSummary, PrefInt, generatePoint,
    generateString, generateComment, publishIdea, searchIdea, showUser, publishIdeaAdmin, commentAdmin, generatePrice, generateGrade}
