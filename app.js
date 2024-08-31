// To access .env variable we have to download this package and use it
require('dotenv').config();

// We use try and catch for all our controller 
// But instead we can use this which will be applied on all our controler automatically
require('express-async-errors');

const express = require('express');
const app = express();

// Rest of the Packages
// This is a very useful package to know for which route you are heading
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// database
const connetDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');

// Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
// we want to access maltiple data in req.body and also use patch and post request
// Since we wanna access them so we use express inbulid middleware
app.use(express.json());
app.use(cookieParser());

app.get('/' , ( req, res ) => {
    res.send('Ecommerce-API');
});

app.get('/api/v1' , ( req, res ) => {
    console.log(req.cookies);
    res.send('Ecommerce-API');
});

app.use('/api/v1/auth' , authRouter);

// Why we put 404 before errorHandler
// Its because express check for all the routes and if that does not exist it will simply show does not exist
// and everything done as we are not calling next in that .. So eeverything is terminated there
// By express rules errorHandler should be in the last as an existing routes only use it .
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connetDB(process.env.MONGO_URL);
        app.listen(port,() => {
            console.log(`Server is listening on port no ${port}...`);
        });
    } catch ( error ) {
        console.log(error);
    } 
};

start();