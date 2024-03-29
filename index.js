require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const errorMiddleware = require('./middlewares/error-middleware');
const router = require('./router/index');

const PORT = process.env.PORT || 5000;
const app = express();

process.env.PWD = process.cwd();

app.use(express.static(path.join(process.env.PWD, 'static')));
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
app.use(cors());
app.use('/', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app.listen(PORT, () => console.log('Server started on PORT = ' + PORT));
    } catch (e) {
        console.error(e);
    }
}

start();
