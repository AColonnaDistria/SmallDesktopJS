var express = require("express");
const path = require("path");

var app = express();
app.listen(8888);

app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, response) {
    response.sendFile('index.html', { root: __dirname});
});

