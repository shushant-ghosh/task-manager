import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoute from "./routes/taskRoute.js";
import userRoute from "./routes/userRoute.js";
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
    components: {
        securitySchemes: {
          bearerAuth: {                  // 👈 name it anything (bearerAuth is common)
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',          // just for UI information
          },
        },
      },
      security: [
        {
          bearerAuth: [],                // 👈 apply it globally to all APIs
        },
      ],
};

// Options for the Swagger docs
const options = {
    swaggerDefinition,
    apis: ['src/routes/*.js', 'src/controller/*.js'], // Path to your route and controller files
};

// Initialize Swagger docs
const swaggerSpec = swaggerJsdoc(options);

// Set up Swagger UI to serve the generated docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(JSON.stringify(swaggerSpec, null, 2));

app.use("/api/tasks", taskRoute)
app.use("/api/auth", userRoute)
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found'
    });
});