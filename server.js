const express = require('express');
const https = require( "https" );
const fs = require( "fs" );

httpsOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/analytics-research-bot.ru/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/analytics-research-bot.ru/fullchain.pem")
}


const app = express();

app.post("/about", (req, res) => {
    console.log( 'received webhook', req.body );
    res.sendStatus(200);
});

https.createServer(httpsOptions, app).listen(3000);