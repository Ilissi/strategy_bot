const db = require('../db')

class strategyController {

    async createStrategy(call_json) {
        const response = await db.query('INSERT INTO strategy(type, source, ticker, order_type, entry_price, percent, ' +
        'TP, SL, id_telegram, comment) '
        + 'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', Object.values(call_json), (err, res) => {
        if (err) {
            throw err
        }});
    return response
    }

    async getStrategyByTicker(ticker) {
        let response;
        try {
            response = await db.query('SELECT type, source, ticker, order_type, entry_price, percent, ' +
                'TP, SL, id_telegram, comment FROM strategy WHERE ticker = $1', [ticker]);
            return response.rows;
        } catch (error) {
            // handle error
            // do not throw anything
        }
    }

}

module.exports = new strategyController()

