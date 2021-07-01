const db = require('../db')


class strategyController {

    async createStrategy(call_json) {
        let response;
        try {
        response = await db.query('INSERT INTO strategy' +
            '(type, url, source, ticker, order_type, entry_price, TP, SL, id_telegram, comment, nickname, ts) ' +
            `VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, to_timestamp(${Date.now()} / 1000.0)) RETURNING *`, call_json);
        return response.rows;
    } catch (error) {
            console.log(error)
            return error;
        }
    }

    async getStrategyByTicker(ticker) {
        let response;
        try {
            response = await db.query('SELECT id, type, source, url, ticker, order_type, entry_price, ' +
                'TP, SL, id_telegram, comment, status, comment_admin FROM strategy WHERE ticker = $1 ', [ticker]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async getStrategyByUUID(strategy_id) {
        let response;
        try {
            response = await db.query('SELECT id, type, url, source, ticker, order_type, entry_price,' +
                'TP, SL, id_telegram, comment, status, approved, comment_admin, nickname FROM strategy WHERE id = $1', [strategy_id]);
            return response.rows;
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async updateApprove(bool_value, strategy_id){
        let response;
        try {
            response = await db.query('UPDATE strategy SET approved = $1 WHERE id = $2 RETURNING id', [bool_value, strategy_id]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async checkApprove(strategy_id){
        let response;
        try {
            response = await db.query('SELECT id FROM strategy WHERE id = $1 AND approved = $2', [strategy_id, true]);
            return response.rows;
        }catch (error) {
            return error;
        }
    }

    async updateStatusStrategy(strategy_id, status){
        let response;
        try {
            response = await db.query(`UPDATE strategy SET status = $1, ts_update = to_timestamp(${Date.now()} / 1000.0) WHERE id = $2 RETURNING *`, [status, strategy_id]);
            return response.rows;
        }catch (error) {
            console.log(error)
            return error;
        }
    }

    async updateWatchListStrategy(strategy_id, watchlist){
        let response;
        try {
            response = await db.query('UPDATE strategy SET watchlist = $1 WHERE id = $2 RETURNING *', [watchlist, strategy_id]);
            return response.rows;
        }catch (error) {
            return error;
        }
    }

    async selectWatchList(){
        let response;
        try {
            response = await db.query('SELECT type, source, ticker, tp, sl, order_type, ' +
                'entry_price, id_telegram, id, comment, comment_admin FROM strategy WHERE watchlist = $1', [true]);
            return response.rows;
        }
        catch (error) {
            return error;
        }
    }

    async createAverageStrategy(call_json) {
        let response;
        try {
            console.log(call_json)
            response = await db.query('INSERT INTO strategy' +
                '(parent_id, type, url, source, ticker, order_type, entry_price, TP, SL, id_telegram, comment, status, watchlist, comment_admin, nickname, approved, ts) ' +
                `VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, true, to_timestamp(${Date.now()} / 1000.0)) RETURNING *`, call_json);
            return response.rows;
        } catch (error) {
            return error;
        }
    }


    async updatePriceStrategy(strategy_id, entry_price){
        let response;
        try {
            response = await db.query('UPDATE strategy SET entry_price = $1 WHERE id = $2 RETURNING *', [entry_price, strategy_id]);
            return response.rows;
        }catch (error) {
            return error;
        }
    }

    async insertPriceComment(strategy_id, comment){
        let response;
        try {
            response = await db.query('UPDATE strategy SET comment_admin = $1 WHERE id = $2 RETURNING *', [comment, strategy_id]);
            return response.rows;
        }catch (error) {
            return error;
        }
    }

    async getLastRecord(){
        let response;
        try {
            response = await db.query('SELECT id FROM strategy ORDER BY ts desc LIMIT 1')
            return response.rows;
        }catch (error){
            return error;
        }
    }
}




module.exports = new strategyController()

