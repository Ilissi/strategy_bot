const pool = require('../db')

async function createDatabase(){
    await pool.query("CREATE DATABASE botapp;", (err, res) => {
        console.log(err, res);
        pool.query("CREATE TABLE IF NOT EXISTS users ( " +
            "id SERIAL PRIMARY KEY, " +
            "id_telegram INTEGER NOT NULL, " +
            "nickname VARCHAR(255) NOT NULL, " +
            "permissions VARCHAR(255) NOT NULL, " +
            "UNIQUE (id_telegram));",
            (err, res) => {
                console.log(err, res);
            });
        pool.query("CREATE TABLE IF NOT EXISTS strategy ( " +
            "id uuid PRIMARY KEY DEFAULT gen_random_uuid(), " +
            "type VARCHAR(255) NOT NULL, " +
            "source VARCHAR(255) NOT NULL, " +
            "ticker VARCHAR(255) NOT NULL, " +
            "order_type VARCHAR(255) NOT NULL, " +
            "entry_price DECIMAL NOT NULL, " +
            "percent DECIMAL NOT NULL, " +
            "TP DECIMAL NOT NULL, " +
            "SL DECIMAL NOT NULL,  " +
            "id_telegram INTEGER NOT NULL," +
            "comment VARCHAR(255) NOT NULL, " +
            "timemodifier VARCHAR(255) NOT NULL, "+
            "risk INTEGER NOT NULL, "+
            "status VARCHAR(255));",
            (err, res) => {
                console.log(err, res);
            });


        pool.query("CREATE TABLE IF NOT EXISTS strategy_grade (" +
            "id SERIAL PRIMARY KEY, " +
            "nickname VARCHAR(255)," +
            "ticker VARCHAR(255), " +
            "first_criterion INTEGER NOT NULL, " +
            "second_criterion INTEGER NOT NULL, " +
            "third_criterion INTEGER NOT NULL, " +
            "fourth_criterion INTEGER NOT NULL, " +
            "comment VARCHAR(255) NOT NULL," +
            "user_id INTEGER REFERENCES users(id_telegram) ON DELETE CASCADE," +
            "strategy_id INTEGER REFERENCES strategy(id) ON DELETE CASCADE);",
            (err, res) => {
                console.log(err, res);
                pool.end();
            });
    })
}

createDatabase()

