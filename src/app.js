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
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', function(socket){

  //로그인하면 이거 밑에 두개뜸
  console.log('User Conncetion');
  
  // { roomNumber, username }
  socket.on('enter', async (data) => {
    try {
      const roomData = JSON.parse(data);
      socket.join(`${roomData.roomNumber}`)
      console.log(`[Username : ${roomData.username}] entered [room number : ${roomData.roomNumber}]`)
    }
    catch(e) {
      console.log(e)
    }
  })
  
  
  //메세지 입력하면 서버 로그에 이거뜸
  socket.on('newMessage', (data) => {
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
server.listen(3030, () => console.log('http://localhost:3030'));