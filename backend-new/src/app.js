const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const routes = require('./routes/v1');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running 🚀",
    });
});

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new Error('Not found'));
});


module.exports = app;