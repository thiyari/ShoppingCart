const express = require('express')
const app = express()
var mongoose = require('mongoose')
var routes = require('./routes/routes')
const cors = require('cors')
const bodyParser = require('body-parser')
require("dotenv").config();
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require("connect-mongo");
require("dotenv").config();

let mail_host = process.env.APP_MAIL_HOST
let mail_port = process.env.APP_MAIL_PORT
let app_user = process.env.APP_MAIL_USER_ID
let app_pass = process.env.APP_MAIL_PASSWORD

var nm = require('nodemailer');
let savedOTPS = {};
var transporter = nm.createTransport(
    {
        host: mail_host,
        port: mail_port,
        secure: false,
        auth: {
            user: app_user,
            pass: app_pass
        }
    }
);

app.use(cors(
    {
      origin: [process.env.CLIENT_URI, process.env.CLIENT_LOCAL_URI],
      methods: ['POST','GET','PUT','DELETE'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
      credentials:true,            //access-control-allow-credentials:true
      optionSuccessStatus:200
    }
   
  ));

app.use(express.json({limit: "50mb"})); // setting limit to 50 MB (52428800 in bytes)
app.use(express.urlencoded({limit: "50mb", extended: true , parameterLimit: 100000}));


app.use(cookieParser());
app.use(bodyParser.json())
app.use(session({
    secret: 'web-market',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: `${process.env.MONGO_DB_URI}/cart`,
        collectionName: "sessions", // Optional: Custom collection name
      }),
    cookie: {
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
        maxAge: 3600000 // 1 lhour
        // 24 * 60 * 60 * 1000 // 24 hours
    }
}
))


const checkDB = async()=>{
    try{
        // mongodb connection string
        // configure built-in role actions as "atlas admin" in cloud atlas mongoDB data access
        const con = await mongoose.connect(`${process.env.MONGO_DB_URI}/cart`,{
        })
        console.log(`MongoDB connected:${con.connection.host}`)
    } catch(err){
        console.log(err);
        process.exit(1);
    }
}


app.post('/api/send-otp', (req, res) => {
    let email = req.body.email;
    let digits = '0123456789';
    let limit = 6;
    let otp = ''
    //generating random otp
    for (i = 0; i < limit; i++) {
        otp += digits[Math.floor(Math.random() * 10)];

    }
    var options = {
        from: app_user,
        to: `${email}`,
        subject: "OTP for Login Access",
        html: `
        <P>Dear User,</p>
        <p>Please use the OTP: <b>${otp}</b> for your account login valid for 1 minute</p>
        <p>Regards,</p>
        <p>Admin</p>
        `
    };
    transporter.sendMail(
        options, function (error, info) {
            if (error) {
                console.log(error);
                res.send({"status":false,"message":"Unable to send OTP"})
            }
            else {
                savedOTPS[email] = otp;
                //Delete the saved OTP after 1 minute expiry
                setTimeout(
                    () => {
                        delete savedOTPS.email
                    }, 60000 // setting time for 1 minute 
                )
                res.send({"status":true,"message":"OTP was sent successfully"});
            }

        }
    )
})

app.post('/api/verify-otp', async (req, res, next) => {
    let otpreceived = req.body.otp;
    let email = req.body.email;
    let role = req.body.log_status;
    if (savedOTPS[email] == otpreceived) {
        req.session.user = {
            email: email,
            role: role,
            isLoggedIn: true
        }
        try {
            await req.session.save();
        } catch (err) {
            console.error('Error saving to session storage: ', err);
            return next(new Error('Error creating user'));
        }
        res.send({"status":true,"message":"OTP verified successfully"});
    }
    else {
        res.send({"status":false,"message":"Invalid OTP"})
    }
})

app.get('/api/session',(req,res)=>{
        if(req.session.user){
            return res.json({
                valid: true, 
                email: req.session.user.email,
                isLoggedIn: req.session.user.isLoggedIn,
                log_status: req.session.user.role
            })
        } else {
            return res.json({valid: false})
        }
})

app.get('/api/logout',async (req,res, next)=>
    {
        try {
            await req.session.destroy();
            res.clearCookie('connect.sid');
            return res.json({valid: true})
        } catch (err) {
            console.error('Error logging out:', err);
            return next(new Error('Error logging out'));
        }
    })

app.listen(8086, function port(error)
{
    if(error)
    {
        console.log(error)
    }
    else{
        console.log("Connected to port 8086!")
    }
})

app.use(cors())
app.use(express.json())
app.use(routes)

mongoose.set('strictQuery',true)
checkDB()
