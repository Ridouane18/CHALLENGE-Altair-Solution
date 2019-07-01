const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express();  

const leaveRoutes = require('./api/routes/leaves');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://admin:'+ process.env.MONGO_ATLAS_PASSWORD +'@leavemanagementdb-rjjad.mongodb.net/test?retryWrites=true&w=majority', { 
    useNewUrlParser: true 
})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/api/leaves', leaveRoutes);
app.use('/api/user', userRoutes);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
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