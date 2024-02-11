const express = require('express');
const app = express();
const mongoose = require('mongoose')
const apiRouter = require('./Routers/ApiRouter')
require('dotenv').config();

main().catch(err => console.log(err))
async function main() {
    await mongoose.connect(process.env.DB_STRING)
    console.log("DB CONNECTED ...")
}


app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/' , (req,res) => {
    res.send("Hello from the api")
})

app.use('/api/' , apiRouter);




// error handling

app.use((error,req,res,next) => {
    console.log(`error ${error.message}`)
    next(error)
})

app.use(function(error, req,res,next){
    res.header("Content-Type", 'application/json');
    const status = error.status || 500;

    res.status(status).send(error.message)
})

app.use((request,response, next) => {
    response.status(404)
    response.send("Invalid Path")
})



app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log("server started....")
})