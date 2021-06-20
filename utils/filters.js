function checkCommand(ctx){
    let list_with_commands = ['/start', '/add', '/search', '/edit', '/users', '/cancel'];
    let passing = false;
    list_with_commands.forEach(function(element){
        try {
            if (element == ctx.message.text) {
                ctx.reply('Предыдущие действия отменены. Напишите команду еще раз.');
                passing = true;
            }
        }
        catch (error){
            passing = false;
        }
    });
    return passing
}

function checkAction(ctx){
    let list_with_action = ['change', 'updateStatus', 'editStatus', 'grade', 'channel', 'watchlist', 'cancels', 'tp', 'sl', 'average'];
    let passing = false;
    list_with_action.forEach(function (element){
        try {
            if (ctx.callbackQuery.data.startsWith(element)) {
                ctx.reply('Предыдущие действия отменены. Нажмите еще раз.');
                passing = true;
            }
        }
        catch (error){
            passing = false;
        }
    });
    return passing;
}


function checkText(ctx){
    let passing = false;
    try {
        if (ctx.message.text){
            ctx.reply('Нажимайте на кнопки! Для продолжения начните заново.')
            passing = true;
        }
    }
    catch (Error){
        passing = false;
    }
    return passing;
}


function checkCallback(ctx){
    let passing = false;
    try {
        if (ctx.callbackQuery.data){
            ctx.reply('Не нажимайте на кнопки! Для продолжения начните заново.')
            passing = true;
        }
    }
    catch (Error){
        passing = false;
    }
    return passing;
}

module.exports = {checkCommand, checkAction, checkText, checkCallback}