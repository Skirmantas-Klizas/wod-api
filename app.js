const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const wodRoutes = require('./api/routes/wods');
const responseRoutes = require('./api/routes/responses');
const userRoutes = require('./api/routes/users');

mongoose.connect(
    'mongodb+srv://Admin:' +
        process.env.MONGO_ATLAS_PW +
        '@wod-6yjhz.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

app.use('/wods', wodRoutes);
app.use('/responses', responseRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
