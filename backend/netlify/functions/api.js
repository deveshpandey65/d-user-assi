const express = require('express');
const app = express();
const serverless = require('serverless-http');
const connectDB = require('../../connections/db');
const cors = require('cors')
const path = require('path');
const appRoutes = require('../../src/routes/index');

app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }
))
connectDB()

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/v1',appRoutes)

module.exports.handler = serverless(app, { callbackWaitsForEmptyEventLoop: false });
