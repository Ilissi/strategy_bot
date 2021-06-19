const { Pool } = require('pg')


const pool = new Pool({
    user: 'telegraf',
    host: '127.0.0.1',
    database: 'botapp',
    password: 'telegraf@',
    port: '5432'}
);


module.exports = pool;