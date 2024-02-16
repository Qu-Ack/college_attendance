const express = require('express');
const http = require('http')
const socketIo = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')
const apiRouter = require('./Routers/ApiRouter');
require('dotenv').config();

main().catch(err => console.log(err))
async function main() {
    await mongoose.connect(process.env.DB_STRING)
    console.log("DB CONNECTED ...")
}

const app = express();

const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });


app.use(cors({
    credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}))
  
app.get('/' , (req,res) => {
    res.send("Hello from the api")
})

app.use('/api/' , apiRouter);


io.on('connection', (socket) => {
    console.log(`A Client Connected ${socket.id}`)

    socket.on('qrCodeScanned', ({ result }) => {
        // Broadcast the scan result to all connected clients
        io.broadcast.emit('qrCodeScanned', { result });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
})

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



server.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log("server started....")
})

app.set('io', io);