const express=require('express')
const bodyParser = require('body-parser')
const restaurantRoutes=require('./routes/restaurant')
const locationRoutes=require('./routes/location')
const mealtypeRoutes=require('./routes/mealtype')
const menuRoutes=require('./routes/menu')
const paymentRoutes=require('./routes/payment')
const mongoose = require('mongoose')
const cors=require('cors')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { resolve } = require('path')
require('./models/userDetails')

const JWT_SECRET =
  "asdnnasd90834-={}as;lkd;easd980123kjjlma\asd";

//connect with mongoDB
const DBCONNECTIONSTRING="mongodb+srv://janeeyre:janeeyre@cluster0.s8a10zd.mongodb.net/zomato40"

mongoose.connect(
    DBCONNECTIONSTRING,{
        useNewUrlParser:true,
    }).then(()=>{
    console.log('mongodb connect success')
 })
 .catch((e)=>console.log(e));

 //start the express server
 const PORT=process.env.PORT||6868;

 var app = express()

 //middleware
app.use(bodyParser.json())
app.use(cors())
app.use('/location',locationRoutes)
app.use('/restaurant',restaurantRoutes)
app.use('/mealtype',mealtypeRoutes)
app.use('/menu',menuRoutes)
app.use('/pay',paymentRoutes)
app.use(express.json())

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
 const { fname, lname, email, password } = req.body;

 const encryptedPassword = await bcrypt.hash(password, 10);
 try {
   const oldUser = await User.findOne({ email });

   if (oldUser) {
     return res.json({ error: "User Exists" });
   }
   await User.create({
     fname,
     lname,
     email,
     password: encryptedPassword,
   });
   res.send({ status: "ok" });
 } catch (error) {
   res.send({ status: "error" });
 }
});

app.post("/login-user", async (req, res) => {
 const { email, password } = req.body;

 const user = await User.findOne({ email });
 if (!user) {
   return res.json({ error: "User Not found" });
 }
 if (await bcrypt.compare(password, user.password)) {
   const token = jwt.sign({ email: user.email }, JWT_SECRET);

   if (res.status(201)) {
     return res.json({ status: "ok", data: token });
   } else {
     return res.json({ error: "error" });
   }
 }
 res.json({ status: "error", error: "InvAlid Password" });
});
//heroku configurations
if(process.env.NODE_ENV = "production"){
    app.use(express.static("frontend/build"))
    const path=require("path")
    app.get("*",(req,res)=>{
       res.sendFile(path.resolve(__dirname,"frontend","build","index.html"))
    })
}

//listen to the port
 app.listen(PORT,()=>{
     console.log(`app running on port:${PORT}`)
 })