const db = require('../db')

function updateStatus(id_telegram, permissions) {
    let response;
    try {
        response =  db.query('INSERT INTO users(id_telegram, nickname, permissions) ' +
            'VALUES($1, $2, $3) RETURNING *', [id_telegram, nickname, permissions]);
        return response.rows;
    } catch (error) {
    }
}

updateStatus(474053240, 'vick_25', 'Администратор')