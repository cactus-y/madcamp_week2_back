const router = require('./routes');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");
const serviceAccount = require("../madcamp-392105-firebase-adminsdk-xwnsd-9c440d4841.json");
const { Device } = require('./database/schema');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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
  socket.on('newMessage', async (data) => {
    const messageData = JSON.parse(data)
    const { receiverId, senderId, senderName, senderProfileImage, msg, roomNumber, timestamp } = messageData;
    console.log("Message ", msg);
    console.log("보내는 사람 : ", senderName);
    const item = await Device.findOne({ user_id: receiverId })
    console.log(item)
    const message = {
      data: {
        title: '알림 제목',
        body: '알림 본문',
        message: msg,
        senderName,
        roomNumber,
        receiverId,
        senderId,
        senderProfileImage: senderProfileImage || "",
        timestamp: String(timestamp)
      },
      token: item.device_token,
    }

    admin
      .messaging()
      .send(message)
      .then(function (response) {
        console.log('Successfully sent message: : ', response)
      })
      .catch(function (err) {
        console.log('Error Sending message!!! : ', err)
      })
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