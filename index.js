'use strict'

// Init dotenv
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config();
}

// Get ENV file
const { PORT } = require('./src/config/env');
// Call app file
const app = require('./src/config/app');

// Init server
app.listen(PORT, (err) => {
    if (err){
        console.error(`CRASH SERVER: ${err}`);
    }else{
        console.log(`INIT SERVER ON PORT: ${PORT}`);
    }
});