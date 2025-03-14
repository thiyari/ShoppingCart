const express = require('express')
const app = express()
var mongoose = require('mongoose')
var routes = require('./routes/routes')
const cors = require('cors')
require("dotenv").config();


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
