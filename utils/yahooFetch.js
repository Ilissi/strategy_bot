const fetch = require('node-fetch');

async function USAStockGetName(ID) { //получаем имя бумаги
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ID}?modules=price`
    // console.log("USAStockGetName. url для %s: %s", ID, url);
    try {
        const response = await fetch(url)
        const json = await response.json()
        const value = json.quoteSummary.result[0].price.longName
        console.log("USAStockGetName. Название для %s: %s", ID, value)
        if (value == 0) return 'нет'
        return value
    } catch (e) {
        console.log('Ошибка в USAStockGetName')
    }
}


module.exports.USAStockGetName = USAStockGetName