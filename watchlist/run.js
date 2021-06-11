const strategyController = require('../contoller/strategy.Controller')
const yahooFetch = require('../watchlist/yahooFetch')
const alertBot = require('../watchlist/alertBot')


function getPercentBuy(yahooValue, ideaObject){
    let percent = (((ideaObject/yahooValue) * 100) - 100).toFixed();
    if (percent >= 15) return true;
    else return false;
}


function getPercentSell(yahooValue, ideaObject){
    let percent = (((yahooValue/ideaObject) * 100) - 100).toFixed();
    if (percent >= 15) return true;
    else return false;
}


async function generateArray(watchlist) {
    let array = []
    for (let i = 0; i < watchlist.length; i++) {
        array.push(watchlist[i].ticker)
    }
    return await getYahooValue(new Set(array))
}


async function getYahooValue(tickerObject){
    let valueObject = {}
    for (let ticker of tickerObject){
        let valueYahoo = await yahooFetch.GetValueYahooFinance(ticker);
        valueObject[ticker] = valueYahoo;
    }
    return valueObject;
}


async function buyOrder(yahooValue, ideaObject){
    if (ideaObject.tp <= yahooValue[ideaObject.ticker]){
        await alertBot.sendTP(ideaObject);
    }
    else if (ideaObject.sl >= yahooValue[ideaObject.ticker]){
        await alertBot.sendSL(ideaObject);
    }
    if (getPercentBuy(yahooValue[ideaObject.ticker], ideaObject.entry_price) == true){
        await alertBot.averageIdea(ideaObject);
    }
}


async function sellOrder(yahooValue, ideaObject){
    if (ideaObject.tp >= yahooValue[ideaObject.ticker]){
        await alertBot.sendTP(ideaObject);
    }
    else if (ideaObject.sl <= yahooValue[ideaObject.ticker]){
        await alertBot.sendSL(ideaObject);
    }
    else if (getPercentSell(yahooValue, ideaObject) == true){
        await alertBot.averageIdea(ideaObject);
    }
}


async function compareValues(yahooValue, ideaObject){
    if (ideaObject.order_type == 'Buy'){
        await buyOrder(yahooValue, ideaObject);
    }
    else {
        await sellOrder(yahooValue, ideaObject);
    }
}


async function getValuesOfWatchList(){
    let watchlist = await strategyController.selectWatchList();
    let response = await generateArray(watchlist);
    for (let i = 0; i < watchlist.length; i++){
        await compareValues(response, watchlist[i]);
    }
}

getValuesOfWatchList()