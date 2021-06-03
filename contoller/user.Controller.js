const db = require('../db')

class userController {
    async lookUpUser(user_id){
        let response;
        try {
            response = await db.query('SELECT * FROM users WHERE id_telegram = $1', [user_id]);
            return response.rows;
        } catch (error) {
            console.log(error)
            // handle error
            // do not throw anything
        }
    }

    async checkStatus(user_id, permissions){
        let response;
        try {
            response = await db.query('SELECT * FROM users WHERE id_telegram = $1 AND permissions = $2', [user_id, permissions]);
            return response.rows;
        } catch (error) {
            console.log(error)
            // handle error
            // do not throw anything
        }
    }

    async getUsers(position){
        let response;
        try {
            response = await db.query('SELECT id_telegram FROM users WHERE permissions = $1', [position]);
            return response.rows;
        } catch (error) {
            console.log(error)
        }
    }

    async addUser(id_telegram, nickname, permissions){
        let response;
        try {
            response = await db.query('INSERT INTO users(id_telegram, nickname, permissions) ' +
                'VALUES($1, $2, $3) RETURNING *', [id_telegram, nickname, permissions]);
            return response.rows;
        } catch (error) {
            console.log(error)
        }
    }

    async updateStatus(id_telegram, permissions) {
        let response;
        try {
            response = await db.query('UPDATE users SET permissions = $1 WHERE id_telegram = $2', [permissions, id_telegram]);
            return response.rows;
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = new userController()