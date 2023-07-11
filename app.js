const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const db= require('./database/db')

const app = express();

const signupRoute = require('./routes/signupRoute');
const loginRoute = require('./routes/loginRoute');
const chatAppRoute= require('./routes/chatAppRoute');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({origin:"http://127.0.0.1:5500",credentials:true}))

app.use(signupRoute);
app.use(loginRoute);
app.use(chatAppRoute);

db.sync().then(()=>{
    app.listen(3000,()=>console.log('server started at port 3000'));
})
.catch((err)=> console.error(err));
