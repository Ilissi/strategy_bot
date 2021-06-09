const fetch = require('node-fetch');


async function GetValueYahooFinance(ID) { //получаем имя бумаги
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ID}?modules=price`
    // console.log("USAStockGetName. url для %s: %s", ID, url);
    try {
        const response = await fetch(url)
        const json = await response.json()
        let preMarketPrice = json.quoteSummary.result[0].price.preMarketPrice.raw;
        if (preMarketPrice == 0) return 'нет'
        return preMarketPrice
    } catch (e) {
        console.log(e)
    }
}


module.exports = { GetValueYahooFinance }