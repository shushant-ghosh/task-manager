const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const taskRoute = require("./routes/taskRoute");
const userRoute = require("./routes/userRoute");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;


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
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['src/routes/*.js', 'src/controller/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// console.log(JSON.stringify(swaggerSpec, null, 2));

app.use("/api/tasks", taskRoute);
app.use("/api/auth", userRoute);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

if (process.env.NODE_ENV !== 'test') {
    const MONGO_URL = process.env.MONGO_URL;

    if (process.env.NODE_ENV !== 'test') {
        mongoose.connect(MONGO_URL).then(() => {
            console.log("Database is connected successfully");
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }).catch((err) => {
            console.error("MongoDB connection error:", err);
        });
    }
}


module.exports = app;