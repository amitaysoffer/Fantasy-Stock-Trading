const express = require("express");
const app = express();
const cors = require('cors');
const path = require("path");
const bodyParser = require("body-parser");

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Serving React Build via Express.js
app.use('/', express.static(path.join(__dirname, "client", "build")));

// app.post("/api/transaction/buy", (req, res) => {
//     //Check if bearer token is attached
//     //if not, fail with auth message

//     //if it is attached, 
//     //find out if the user is logged in (not expired)
//     //return the user information

//     //create a new transaction with the user data

//     //send back the response
// });

const authRoute = require('./routes/authRoutes');
app.use("/api/auth/", authRoute);

const stockRoute = require('./routes/stockRoutes');
app.use("/api/stocks/", stockRoute);

//Catch All
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));