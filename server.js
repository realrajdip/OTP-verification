const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path');

mongoose.connect('mongodb_url');

//Set view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true,
}));

let index = require('./routes/index');


app.use('/', index);

app.use(session({
    secret: 'The cat is gone',
    resave: true,
    saveUninitialized: true,
}));


app.use(flash());

app.listen(process.env.PORT|| 4000, function () {
   console.log('Magic happens at port '+ 4000);
});
