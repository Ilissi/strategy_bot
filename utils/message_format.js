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
    let message = `@${username} ${ts}\nТикер: ${ticket}\nСтратегия: ${strategy}\n#${order} ${percent}%\nЦена входа: ${entry_price}$\nTP: ${getFormat.TP}   SL: ${getFormat.SL}\nСрок:  ${timemodifier}\nИсточник:  ${source}\nРиск:  ${grade}/5\nКомментарий: ${comment}`;
    return message
}


function generate_message_alert(UUID, ticket, strategy, order, percent, entry_price, TP, SL, timemodifier, source, grade, comment) {
    let getFormat = returnFormat(TP, SL);
    let message = `UUID: ${UUID} \nТикер: ${ticket}\nСтратегия: ${strategy}\n#${order} ${percent}%\nЦена входа: ${entry_price}$\nTP: ${getFormat.TP}   SL: ${getFormat.SL}\nСрок:  ${timemodifier}\nИсточник:  ${source}\nРиск:  ${grade}/5\nКомментарий: ${comment}`;
    return message
}


function managerMessage(first_criterion, second_criterion, third_criterion, comment){
    let summary = Number(first_criterion) + Number(second_criterion) + Number(third_criterion);
    let message = `Драйверы к росту фундаменталу: ${first_criterion}\nТочка входа по тех анализу: ${second_criterion}\nКорректность типа стратегии: ${third_criterion}\nИтоговоя оценка: ${summary} из 30\nКоментарий: ${comment}`;
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
    return `${firstArray}/${secondArray} риск-менеджеров оценили\n`
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
    return `\n${username}: \n${comment} `
}


function publishIdea(idea, title, username){
    let getFormat = returnFormat(idea.tp, idea.sl);
    return `${title}\n@${username} \nТикер: ${idea.ticker}\nСтратегия: ${idea.type}\n#${idea.order_type} ${idea.percent}%\nЦена входа: ${idea.entry_price}$\nTP: ${getFormat.TP}   SL: ${getFormat.SL}\nСрок:  ${idea.timemodifier}\nИсточник:  ${idea.source}\nРиск:  ${idea.risk}/5\nКомментарий: ${idea.comment}`;
}


function searchIdea(username, idea){
    let getFormat = returnFormat(idea.tp, idea.sl);
    return `UUID: ${idea.id}\n@${username} \nТикер: ${idea.ticker}\nСтратегия: ${idea.type}\n#${idea.order_type} ${idea.percent}%\nЦена входа: ${idea.entry_price}$\nTP: ${getFormat.TP}   SL: ${getFormat.SL}\nСрок:  ${idea.timemodifier}\nИсточник:  ${idea.source}\nРиск:  ${idea.risk}/5\nКомментарий: ${idea.comment}\nСтатус: ${idea.status}`;
}

function showUser(user){
    return `Пользователь: @${user.nickname}\nПрава: ${user.permissions}`
}



module.exports = { generate_message, managerMessage, getTime, generateList, generateFinishMessage, generateTitle,
    generateString, finishString, generate_message_alert, generateComment, publishIdea, searchIdea, showUser}
