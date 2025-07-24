const express = require('express');
const app = express();
const morgan = require('morgan');
const {readdirSync} = require('fs')
const cors = require('cors')
const passport = require('./config/passport');


//middleware
app.use(morgan('dev'))
app.use(express.json({
    limit:'20mb'
}))
app.use(cors())
app.use(passport.initialize());


//Routers
readdirSync('./routes').map((c)=>{
    app.use('/api',require('./routes/'+c))

})

app.get('/api/',(req,res)=>{
    res.send({
        message:"Welcome to Srisiam E-commerce API"
    })
})




app.listen(5000,()=>{
    console.log("Server is running on port 5000")
})