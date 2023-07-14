const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const db= require('./database/db');
const User= require('./models/user');
const Message= require('./models/chat');
const Group= require('./models/group');
const UserGroup= require('./models/usergroup');


const app = express();

const signupRoute = require('./routes/signupRoute');
const loginRoute = require('./routes/loginRoute');
const chatAppRoute= require('./routes/chatAppRoute');
const groupmessageRoute = require('./routes/groupMessageRoute');



app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({origin:"http://127.0.0.1:5500",credentials:true}))

app.use(signupRoute);
app.use(loginRoute);
app.use(chatAppRoute);
app.use(groupmessageRoute);


User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

db.sync().then(()=>{
    app.listen(3000,()=>console.log('server started at port 3000'));
})
.catch((err)=> console.error(err));
