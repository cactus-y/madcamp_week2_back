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