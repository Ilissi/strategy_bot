const { Pool } = require('pg')


const pool = new Pool({
    user: 'vick',
    host: '127.0.0.1',
    database: 'botapp',
    password: 'vick1715',
    port: '5432'}
);


module.exports = pool;