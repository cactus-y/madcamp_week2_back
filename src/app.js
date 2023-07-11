const router = require('./routes');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');


// 환경 변수
require("dotenv").config();

// MongoDB 연결
mongoose.connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });



const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
io.on('connection', function(socket){

  //로그인하면 이거 밑에 두개뜸
  console.log('User Conncetion');
  
  socket.on('enter', (data) => {
    const roomData = JSON.parse(data)
    const username = roomData.username
    const roomNumber = roomData.roomNumber

    socket.join(`${roomNumber}`)
    console.log(`[Username : ${username}] entered [room number : ${roomNumber}]`)
  })
  
  
  //메세지 입력하면 서버 로그에 이거뜸
  socket.on('newMessage', function(data){
    const messageData = JSON.parse(data)
    const msg = messageData.msg;
    const roomNumber = messageData.roomNumber;
    const sender = messageData.username;
    console.log("Message ", msg);
    console.log("보내는 사람 : ", sender);
    io.to(roomNumber).emit('update', JSON.stringify(messageData));
  });

  socket.on('disconnect', function() { 
    console.log('접속 종료') 
  }) 
});



app.use(cors());
app.use((err, req, res, next) => {
    if (err) {
        console.log(err);
        res.send(err);
    }
    else {
        console.log('logging for routers');
        next();
    }
});
app.use(express.json());
app.use("/", router);
app.listen(3030, () => console.log('http://localhost:3030'));