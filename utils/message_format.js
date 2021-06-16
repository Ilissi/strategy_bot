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


function generate_message(username, ts, ticket, strategy, order, percent, entry_price, TP, SL, timemodifier, source, grade, comment) {
    let getFormat = returnFormat(TP, SL);
    let message = `@${username} ${ts}\n<b>Тикер:</b> ${ticket}\n<b>Стратегия:</b> ${strategy}\n#${order} ${percent}%\n<b>Цена входа:</b> ${entry_price}$\n<b>TP:</b> ${getFormat.TP}   <b>SL:</b> ${getFormat.SL}\n<b>Срок:</b>  ${timemodifier}\n<b>Источник:</b>  ${source}\n<b>Риск:</b>  ${grade}/5\n<b>Комментарий:</b> ${comment}`;
    return message
}


function generate_message_alert(UUID, ticket, strategy, order, percent, entry_price, TP, SL, timemodifier, source, grade, comment) {
    let getFormat = returnFormat(TP, SL);
    let message = `<b>UUID:</b> ${UUID} \n<b>Тикер:</b> ${ticket}\n<b>Стратегия:</b> ${strategy}\n#${order} ${percent}%\n<b>Цена входа:</b> ${entry_price}$\n<b>TP:</b> ${getFormat.TP}   <b>SL:</b> ${getFormat.SL}\n<b>Срок:</b>  ${timemodifier}\n<b>Источник:</b>   ${source}\n<b>Риск:</b>  ${grade}/5\n<b>Комментарий:</b> ${comment}`;
    return message
}


function managerMessage(first_criterion, second_criterion, third_criterion, comment){
    let summary = Number(first_criterion) + Number(second_criterion) + Number(third_criterion);
    let message = `<b>Драйверы к росту фундаменталу:</b> ${first_criterion}\n<b>Точка входа по тех анализу:</b> ${second_criterion}\n<b>Корректность типа стратегии:</b> ${third_criterion}\n<b>Итоговоя оценка:</b> ${summary} из 30\n<b>Коментарий:</b> ${comment}`;
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
        let newList = first_array.filter( o => second_array.find( x => o.id_telegram !== x.user_id ));
        return newList;
    }
}


function generateFinishMessage(firstArray, secondArray) {
    return `${firstArray}/${secondArray} аналитиков оценили\n`
}


function generateTitle(){
    return '1. Драйверы к росту фундаментала.\n2. Точка входа по тех анализу.\n3. Корректность типа стратегии. \n4. Общая оценка.\n'
}


function generateString(username, firstCriterion, secondCriterion, thirdCriterion, summary){
    return `@${username} | ${firstCriterion} | ${secondCriterion} | ${thirdCriterion} | ${summary}`
}


function finishString(username, firstCriterion, secondCriterion, thirdCriterion, summary){
    return `\n${username} ${firstCriterion} | ${secondCriterion} | ${thirdCriterion} | ${summary} `
}


function generateComment(username, comment){
    return `\n@${username}: \n${comment} `
}


function publishIdea(idea, title, username){
    let getFormat = returnFormat(idea.tp, idea.sl);
    return `<b>${title}</b>\n@${username} \n<b>Тикер:</b> ${idea.ticker}\n<b>Стратегия:</b> ${idea.type}\n#${idea.order_type} ${idea.percent}%\n<b>Цена входа:</b> ${idea.entry_price}$\n<b>TP:</b> ${getFormat.TP}   <b>SL:</b> ${getFormat.SL}\n<b>Срок:</b>  ${idea.timemodifier}\n<b>Источник:</b>  ${idea.source}\n<b>Риск:</b>  ${idea.risk}/5\n<b>Комментарий:</b> ${idea.comment}`;
}


function searchIdea(username, idea){
    let getFormat = returnFormat(idea.tp, idea.sl);
    return `<b>UUID:</b> ${idea.id}\n@${username} \n<b>Тикер:</b> ${idea.ticker}\n<b>Стратегия:</b> ${idea.type}\n#${idea.order_type} ${idea.percent}%\n<b>Цена входа:</b> ${idea.entry_price}$\n<b>TP:</b> ${getFormat.TP}   <b>SL:</b> ${getFormat.SL}\n<b>Срок:</b>  ${idea.timemodifier}\n<b>Источник:</b>  ${idea.source}\n<b>Риск:</b>  ${idea.risk}/5\n<b>Комментарий:</b> ${idea.comment}\n<b>Статус:</b> ${idea.status}`;
}

function showUser(user){
    return `<b>Пользователь:</b> @${user.nickname}\n<b>Права:</b> ${user.permissions}`
}



module.exports = { generate_message, managerMessage, getTime, generateList, generateFinishMessage, generateTitle,
    generateString, finishString, generate_message_alert, generateComment, publishIdea, searchIdea, showUser}
