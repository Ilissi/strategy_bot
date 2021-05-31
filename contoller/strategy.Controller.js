const db = require('../db')

class strategyController {

    async createStrategy(call_json) {
        let response;
        try {
        response = await db.query('INSERT INTO strategy' +
            '(type, source, ticker, order_type, entry_price, percent, TP, SL, timemodifier, risk, id_telegram, comment) ' +
            'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *', Object.values(call_json));
        return response.rows;
    } catch (error) {
        }
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

