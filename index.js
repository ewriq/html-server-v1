const express = require("express");
const config = require("./config/cnf");
const login = require("./middleware/oauth");
const app = express();
const session = require('express-session');
const upload = require("./config/uploads");
const multer = require("multer");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const fs = require("fs");
const router = require("./router/home");
const open = require("./open");


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, "public/")))


app.use('/', router);
app.listen(config.port, () =>{
    console.log(`┌───────────────────────────────────────────────────┐`);
    console.log(`│ 🎈 Html Panel v1 Project                          │`);
    console.log(`│🛬 listen in admin panel: ${config.port}                     │`);
    open(() => {;
    }); console.log("│🛬 open in main server:  https://localhost         │")
    console.log(`│  🎐 Create in ewriq https://gitub.com/ewriq       │`);
    console.log(`└───────────────────────────────────────────────────┘`);
})

