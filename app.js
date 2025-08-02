const express = require('express');
const cors = require("cors");
const user_router = require('./routes/User.Route');
const transaction_router = require('./routes/Transaction.Route');
require('./db/conn');


const app = express();
const port = process.env.Port || 4000;

// Allow all origins (for development)
app.use(cors());
app.use(express.json()); // <-- Enable JSON body parsing

// Test route
app.get("/api/v1/test", (req, res) => {
    res.json({ message: "CORS is working!" });
});

app.use('/api/v1', user_router);
app.use('/api/v1', transaction_router);


app.listen(port,() =>{
    console.log(`listening on ${port}`);
})