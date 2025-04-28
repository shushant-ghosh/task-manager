import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import route from "./routes/taskRoute.js";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(() => {
    console.log("Database is connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Set up Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Task Management API',
        version: '1.0.0',
        description: 'API documentation for managing tasks',
    },
    servers: [
        {
            url: 'http://localhost:8000',
        },
    ],
};

// Options for the Swagger docs
const options = {
    swaggerDefinition,
    apis: ['src/routes/taskRoute.js', 'src/controller/taskController.js'], // Path to your route and controller files
};

// Initialize Swagger docs
const swaggerSpec = swaggerJsdoc(options);

// Set up Swagger UI to serve the generated docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(JSON.stringify(swaggerSpec, null, 2));

app.use("/api/tasks", route)
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found'
    });
});