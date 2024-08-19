const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(process.env.DATABASE_URL, {
}).then(() => {
    console.log("DB Connected");
}).catch((err) => {
    console.log(err);
});


app.get('/api/v1', async (req, res) => {
    res.status(200).json("Server up and running")
})

app.use('/api/v1/student', require('./routes/studentRoutes'))
app.use('/api/v1/admin', require('./routes/adminRoutes'))

app.listen(process.env.PORT || 8080, () => {
    console.log("Server Started");
})