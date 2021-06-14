const db = require('../db')


class userController {
    async lookUpUser(user_id){
        let response;
        try {
            response = await db.query('SELECT * FROM users WHERE id_telegram = $1', [user_id]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async checkStatus(user_id, permissions){
        let response;
        try {
            response = await db.query('SELECT * FROM users WHERE id_telegram = $1 AND permissions = $2', [user_id, permissions]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async getUsers(position){
        let response;
        try {
            response = await db.query('SELECT id_telegram FROM users WHERE permissions = $1', [position]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async addUser(id_telegram, nickname, permissions){
        let response;
        try {
            response = await db.query('INSERT INTO users(id_telegram, nickname, permissions) ' +
                'VALUES($1, $2, $3) RETURNING *', [id_telegram, nickname, permissions]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async updateStatus(id_telegram, permissions) {
        let response;
        try {
            response = await db.query('UPDATE users SET permissions = $1 WHERE id_telegram = $2', [permissions, id_telegram]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async lookUpUserByUsername(nickname){
        let response;
        try {
            response = await db.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
            return response.rows;
        } catch (error) {
            return error;
        }
    }

    async checkPermission(id_telegram, permissions) {
        try {
            let response = await db.query('SELECT * FROM users WHERE id_telegram = $1 and permissions = $2', [id_telegram, permissions]);
            if (response.rows.length == 1) return true;
            else return false
        }
        catch (error){
            return error;
        }
    }

    async getAllUsers() {
        try {
            let response = await db.query('SELECT * FROM users');
            return response.rows;
        }
        catch (error){
            return error;
        }
    }
}

module.exports = new userController()