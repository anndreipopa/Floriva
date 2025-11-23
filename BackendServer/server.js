require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mqtt = require('mqtt');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

// Express + HTTP server
const app = express();
const server = http.createServer(app);

// Web server port
const webPort = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Allowed origins for dashboard access
const allowedOrigins = [
    "https://florivatest.netlify.app",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:5173",
    "https://localhost:5173"
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    methods: ["GET", "POST"]
};

// Apply CORS for both Express and Socket.IO
app.use(cors(corsOptions));

const io = new Server(server, {
    cors: corsOptions
});

// Cache of latest sensor readings
let latestReadings = null;

// DB save interval (30 minutes)
const savingInterval = 30 * 60 * 1000;


// DATABASE SETUP


async function initDatabase() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS sensor_data (
            id SERIAL PRIMARY KEY,
            temperature REAL,
            humidity REAL,
            light INTEGER,
            soil INTEGER,
            soil_percent INTEGER,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `;

    try {
        await pool.query(createTableQuery);
        console.log("Table 'sensor_data' is ready.");
    } catch (err) {
        console.error("Failed to create 'sensor_data' table:", err);
        process.exit(1);
    }
}

// Save data periodically
async function logDataToDatabase() {
    if (!latestReadings) {
        console.log("No readings available for database save.");
        return;
    }

    const { temp, humidity, lux, soil_raw, soil_percent } = latestReadings;

    const query = `
        INSERT INTO sensor_data (temperature, humidity, light, soil, soil_percent)
        VALUES ($1, $2, $3, $4, $5)
    `;

    try {
        await pool.query(query, [temp, humidity, lux, soil_raw, soil_percent]);
        console.log("Sensor data saved to database.");
    } catch (err) {
        console.error("Error saving sensor data:", err);
    }
}


// EXPRESS ROUTES


// Last 24 hours of sensor history
app.get('/api/history', async (req, res) => {
    try {
        const query = `
            SELECT temperature, humidity, light, soil, created_at 
            FROM sensor_data 
            WHERE created_at >= NOW() - INTERVAL '24 hours'
            ORDER BY created_at DESC
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching DB history:", err);
        res.status(500).json({ error: "Database query failed" });
    }
});

// Keep-alive endpoint
app.get('/api/keep-alive', (req, res) => {
    console.log("Keep-alive request received");
    res.status(200).json({ status: "Server is awake" });
});

// Weather endpoint
app.get('/weather', async (req, res) => {
    const lat = 44.85;
    const lon = 24.88;
    const apiKey = process.env.WEATHER_API_KEY;

    const weatherURL =
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(weatherURL);
        const weatherData = await response.json();
        res.json(weatherData);
        console.log(`Weather request served`);
    } catch (error) {
        console.error("Weather API error:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});


// MQTT SETUP


async function start() {
    await initDatabase();

    setInterval(logDataToDatabase, savingInterval);

    const host = process.env.MQTT_HOST;
    const port = process.env.MQTT_PORT;
    const clientID = `mqtt_${Math.random().toString(16).slice(3)}`;
    const connectURL = `mqtts://${host}:${port}`;

    const client = mqtt.connect(connectURL, {
        clientID,
        clean: true,
        connectTimeout: 4000,
        username: process.env.MQTT_USER,
        password: process.env.MQTT_PASSWORD,
        reconnectPeriod: 1000
    });

    const sensorTopic = process.env.MQTT_TOPIC;
    const pumpStatusTopic = "monitor/andrei/pompa/status";
    const pumpCmdTopic = "monitor/andrei/pompa/cmd";

    client.on("connect", () => {
        console.log("Connected to MQTT broker.");

        client.subscribe([sensorTopic, pumpStatusTopic], () => {
            console.log(`Subscribed to sensor + pump topics.`);
        });
    });

    client.on("message", (topic, message) => {
        const msg = message.toString();

        // SENSOR DATA
        if (topic === sensorTopic) {
            console.log(`Sensor data received: ${msg}`);
            const data = JSON.parse(msg);
            latestReadings = data;
            io.emit("sensorData", data);
        }

        // PUMP STATUS
        if (topic === pumpStatusTopic) {
            console.log(`Pump status received: ${msg}`);
            io.emit("pumpStatus", msg);
        }
    });

    // Dashboard controls
    io.on("connection", (socket) => {
        console.log("Dashboard connected");

        socket.on("pumpCommand", (cmd) => {
            console.log(`Pump command received: ${cmd}`);
            client.publish(pumpCmdTopic, cmd);
        });
    });

    server.listen(webPort, () => {
        console.log(`Dashboard available on port ${webPort}`);
    });

    console.log("Attempting MQTT connection...");
}

start();
