const db = require('../db')


class strategyController {

    async createStrategy(call_json) {
        let response;
        try {
        response = await db.query('INSERT INTO strategy' +
            '(type, source, ticker, order_type, entry_price, percent, TP, SL, timemodifier, risk, id_telegram, comment, ts) ' +
            `VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, to_timestamp(${Date.now()} / 1000.0)) RETURNING *`, call_json);
        return response.rows;
    } catch (error) {
            console.log(error)
        }
    }

    async getStrategyByTicker(ticker) {
        let response;
        try {
            response = await db.query('SELECT id, type, source, ticker, order_type, entry_price, percent, ' +
                'TP, SL, id_telegram, risk, timemodifier, comment FROM strategy WHERE ticker = $1 ', [ticker]);
            return response.rows;
        } catch (error) {
            // handle error
            // do not throw anything
        }
    }

    async getStrategyByUUID(strategy_id) {
        let response;
        try {
            response = await db.query('SELECT type, source, ticker, order_type, entry_price, percent, ' +
                'TP, SL, timemodifier, risk, id_telegram, comment FROM strategy WHERE id = $1', [strategy_id]);
            return response.rows;
        } catch (error) {
            // handle error
            // do not throw anything
        }
    }

    async updateApprove(bool_value, strategy_id){
        let response;
        try {
            response = await db.query('UPDATE strategy SET approved = $1 WHERE id = $2 RETURNING id', [bool_value, strategy_id]);
            return response.rows;
        } catch (error) {
        }
    }

    async checkApprove(strategy_id){
        let response;
        try {
            response = await db.query('SELECT id FROM strategy WHERE id = $1 AND approved = $2', [strategy_id, true]);
            return response.rows;
        }catch (error) {
        }
    }

    async updateStatusStrategy(strategy_id, status){
        let response;
        try {
            response = await db.query('UPDATE strategy SET status = $1 WHERE id = $2 RETURNING *', [status, strategy_id]);
            return response.rows;
        }catch (error) {
        }
    }

    async selectWatchList(){
        let response;
        try {
            response = await db.query('SELECT type, source, ticker, tp, sl, order_type, ' +
                'entry_price, id_telegram, id, risk, comment, percent, timemodifier  FROM strategy WHERE approved = $1', [true]);
            return response.rows;
        }catch (error) {
        }
    }

    async updateStrategyParameters(tp, sl, entry_price, uuid){
        let response;
        try {
            response = await db.query('UPDATE strategy SET tp = $1, sl = $2, entry_price = $3 WHERE id = $4' +
                'RETURNING id, type, source, ticker, order_type, entry_price, percent, tp, sl, timemodifier, ' +
                'risk', 'id_telegram', 'comment', [tp, sl, entry_price, uuid])
            return response.rows;
        }catch (error) {}
    }
}


module.exports = new strategyController()

