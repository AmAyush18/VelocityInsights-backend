import express from 'express'
export const app = express()
import mailRouter from './routes/mail.route.js';
import dotenv from 'dotenv'

dotenv.config();

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.use('/api/v1', mailRouter);

// test route
app.get('/api/v1', async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "API is working",
        });
    } catch (error) {
        console.error(error)
    }
});

// unknown routes
app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
  });
  