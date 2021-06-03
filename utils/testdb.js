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

function selectStatus(permissions) {
    let response;
    try {
        response =  db.query('SELECT id_telegram FROM users WHERE permissions = $1', [permissions]);
        return response.rows;
    } catch (error) {
    }
}

selectStatus('Администратор')