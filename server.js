const express = require('express');
const https = require( "https" );
const fs = require( "fs" );

httpsOptions = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.crt")
}


const app = express();

app.post("/about", function(request, response){

    response.send("Approve");
});

https.createServer(httpsOptions, app).listen(443);