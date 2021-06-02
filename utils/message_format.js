function generate_message(username, ts, ticket, strategy, order, percent, entry_price, TP, SL, timemodifier, source, grade, comment) {
    let message = `@${username} ${ts}\nТикер: ${ticket}\nСтратегия: ${strategy}\n#${order} ${percent}%\nЦена входа: ${entry_price}$\nTP: ${TP}$   SL: ${SL}$\nСрок:  ${timemodifier}\nИсточник:  ${source}\nРиск:  ${grade}/5\nКомментарий: ${comment}`;
    return message
}

function generate_message_alert(UUID, ticket, strategy, order, percent, entry_price, TP, SL, timemodifier, source, grade, comment) {
    let message = `UUID: ${UUID} \nТикер: ${ticket}\nСтратегия: ${strategy}\n#${order} ${percent}%\nЦена входа: ${entry_price}$\nTP: ${TP}$   SL: ${SL}$\nСрок:  ${timemodifier}\nИсточник:  ${source}\nРиск:  ${grade}/5\nКомментарий: ${comment}`;
    return message
}

function managerMessage(first_criterion, second_criterion, third_criterion, comment){
    let summary = Number(first_criterion) + Number(second_criterion) + Number(third_criterion);
    let message = `Оценка по критерию: @Драйверы к росту фундаментал@: ${first_criterion}\nОценка по критерию: @Точка входа по тех анализу@: ${second_criterion}\nОценка по критерию @Корректность типа стратегии@: ${third_criterion}\nИтоговоя оценка: ${summary} из 30\nКоментарий: ${comment}`;
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

function generateString(username, firstCriterion, secondCriterion, thirdCriterion, summary, comment){
    return ` ${username} | ${firstCriterion} | ${secondCriterion} | ${thirdCriterion} | ${summary} | ${comment}`
}

function finishString(username, firstCriterion, secondCriterion, thirdCriterion, summary){
    return `\n@${username} | ${firstCriterion} | ${secondCriterion} | ${thirdCriterion} | ${summary} `
}

function generateComment(username, comment){
    return `\n${username}: \n${comment} `
}

module.exports = { generate_message, managerMessage, getTime, generateList, generateFinishMessage, generateTitle,
    generateString, finishString, generate_message_alert, generateComment}
