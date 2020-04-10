/* node 의 모듈들을 불러옵니다. */
// const requestHandler = require("./request-handler.js");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require('cors');

const port = 3000;
const ip = "127.0.0.1";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let chats = { results: [] };

let handler = function () {
    console.log("Server is running now");
};

app.use(cors());


app.get('/classes/messages', (req, res) => { 
    res.status(200).send(JSON.stringify(chats));
});

app.post('/classes/messages', (req, res) => {
    req.body['date'] = new Date().toString();
    chats.results.push(req.body);
    res.status(201).send(JSON.stringify(chats));
});


app.use(function (req, res) {
    res.status(404).send('404 ERROR');
});

app.listen(port, ip, handler);

//console.log("Listening on http://" + ip + ":" + port);
//server.listen(port, ip);

//module.exports = server;
const defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10, // Seconds.
};