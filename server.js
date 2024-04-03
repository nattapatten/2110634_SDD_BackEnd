const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config({ path: './config/config.env' });


connectDB();


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());



const auth = require('./routes/auth');

app.use('/api/v1/auth', auth);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, console.log('Server running in', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
