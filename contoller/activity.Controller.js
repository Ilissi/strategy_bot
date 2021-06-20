const db = require('../db')


class activityController {

    async createActivityRecord(id_telegram) {
        let response;
        try {
            response = await db.query('INSERT INTO user_activity' +
                `(user_id, activity) VALUES($1, to_timestamp(${Date.now()} / 1000.0)) RETURNING *`, [id_telegram]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async updateActivityRecord(id_telegram) {
        let response;
        try {
            response = await db.query(`UPDATE user_activity SET activity=to_timestamp(${Date.now()} / 1000.0)` +
                `WHERE user_id=$1 RETURNING *`, [id_telegram]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async getActivityRecord(){
        let response;
        try {
            response = await db.query(`SELECT id, user_id, user_activity FROM user_activity`);
            return response.rows;
        } catch (error) {
            return error;
        }
    }
}


module.exports = new activityController()