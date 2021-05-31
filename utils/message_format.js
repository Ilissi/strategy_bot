function generate_message(username, ticket, order, percent, entry_price, TP, SL, timemodifier, source, grade, comment) {
    let message = `@${username}\n
/${ticket}\n
#${order} ${percent}%\n
Цена входа: ${entry_price}$\n
TP: ${TP}$   SL: ${SL}$\n
Срок:  ${timemodifier}\n
Источник:  ${source}\n
Риск:  ${grade}/5\n
Комментарий: ${comment}`;
    return message
}

function generate_message_htnl(username, ticket, order, percent, entry_price, TP, SL, timemodifier, source, grade, comment) {
    let message = `@${username}\n
/${ticket}\n
#${order} ${percent}%\n
<strong>Цена входа:</strong> ${entry_price}$\n
<strong>TP: </strong> ${TP}$  <strong>SL: </strong> ${SL}$\n
<strong>Срок: </strong> ${timemodifier}\n
<strong>Источник: </strong> ${source}\n
<strong>Риск: </strong> ${grade}/5\n
<strong>Коментарий: </strong> ${comment}`;
    return message
}

function managerMessage(first_criterion, second_criterion, third_criterion, comment){
    let summary = Number(first_criterion) + Number(second_criterion) + Number(third_criterion);
    let message = `Оценка по критерию @Драйверы к росту фундаментал@: ${first_criterion}\n
Оценка по критерию @Точка входа по тех анализу@: ${second_criterion}\n
Оценка по критерию @Корректность типа стратегии@: ${third_criterion}\n
Итоговоя оценка: ${summary} из 30
Коментарий: ${comment}`;
    return message;
}

module.exports = { generate_message, managerMessage }
