require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes/index.js'))

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;

        console.log('db connecteddddd');
    }
);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Runninggg on port ${port}`);
});
