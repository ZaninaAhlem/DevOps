import express from 'express';
import mongoose from 'mongoose';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const port = process.env.SERVER_PORT || 8080;
// Middleware for handling CORS POLICY
app.use(cors());
// Middleware for parsing request body
app.use(express.json());

const uri = process.env.MONGO_DB_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});
app.use('/books', booksRoute);
app.get('/', (req, res) => {
    console.log(req);
    return res.status(234).send(`Welcome To The Deployment in exam Cluster ${new Date().toISOString()} `);
});

app.get(`/status`, (req, res) => {
    res.json({ status: 'Backend Server is running', timestamp: new Date().toISOString() });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

