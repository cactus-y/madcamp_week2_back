const router = require('./routes');
const express = require('express');
const app = express();
const port = 3030;

// test
app.use((req, res, next) => {
    console.log('logging for routers');
    next();
});
  
app.use(express.json());
app.use("/", router);
app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});