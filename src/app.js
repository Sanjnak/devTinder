const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
    res.send("Hello Hello Hello!");
});

app.use("/test", (req, res) => {
    res.send("This test page!");
});

app.use("/", (req, res) => {
    res.send("Hello from dashboard!");
});

app.listen(7777, ()=> {
    console.log("Server is listening on 7777...");
});