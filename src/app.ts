import express, { Request, Response } from 'express';
import "dotenv/config";
import * as path from 'path';
import routes from './routes';
import bodyParser from 'body-parser';
import dbInit from './db/init';
import cors from 'cors';
import queueMail from './middleware/queueMail';
const gopd = require('gopd'); // Import gopd module

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration for Production
const allowedOrigins = [
    "http://localhost:5173",  // Development Frontend URL
    "https://tms-backed-prod.vercel.app"  // Production Frontend URL
];

// CORS setup with dynamic allowed origins
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Allow request
        } else {
            callback(new Error("Not allowed by CORS")); // Reject request
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body Parsing Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(queueMail);  // QueueMail middleware

// Database Initialization
dbInit();

// Serve the UI files from production build (client-dist folder)
const uiCodePath = path.join(__dirname, 'client-dist');
app.use(express.static(uiCodePath));

// Serve the main index.html for the frontend
app.get("/", async (req: Request, res: Response) => {
    return res.sendFile(path.join(uiCodePath, "index.html"));
});

// Example use of `gopd`
app.get("/gopd-test", (req: Request, res: Response) => {
    const exampleObject = { a: 1, b: 2, c: 3 };
    const value = gopd(exampleObject, 'b');  // Using gopd to retrieve the value of 'b'
    res.send({ value });
});

// Initialize API Routes
app.use('/api/v1', routes);

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
    res.send({ message: 'Backend is running perfectly!' });
});

// Catch-all for Other Routes
app.get("*", async (req: Request, res: Response) => {
    return res.sendFile(path.join(uiCodePath, "index.html"));
});

// Start the Server in Development Mode
console.log("Server setup is running...");
app.listen(port, () => {
    console.log("=====================================");
    console.log(`🚀 Server running at: http://localhost:${port}`);
    console.log("🔍 Health check at: http://localhost:5000/health");
    console.log("=====================================");
    console.log("TS running successfully");
});
