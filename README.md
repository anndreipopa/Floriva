# Floriva -- Smart Plant Environment Monitoring & Irrigation System

[![Hardware](https://img.shields.io/badge/Hardware-ESP32-blueviolet.svg)](https://www.espressif.com/en/products/socs/esp32)
[![Firmware](https://img.shields.io/badge/Firmware-PlatformIO-orange.svg)](https://platformio.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green.svg)](https://nodejs.org/)
[![Frontend](https://img.shields.io/badge/Frontend-React-61dafb.svg)](https://reactjs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)
[![Protocol](https://img.shields.io/badge/Protocol-MQTT-lightgrey.svg)](https://mqtt.org/)

Floriva is a complete IoT system designed for monitoring plant
environments and building toward automated irrigation.\
It tracks real-time temperature, humidity, and ambient light using an
ESP32, pushes the data securely through MQTT, stores history in
PostgreSQL, and displays it in a modern React dashboard.

------------------------------------------------------------------------

### 🌐 **Live Dashboard**

👉 https://florivatest.netlify.app/

------------------------------------------------------------------------

![Wiring Diagram](./Diag27Jul.png)

------------------------------------------------------------------------

# 🏛️ Architecture Overview

Floriva uses a robust modern IoT pipeline:

### **1. ESP32 -- Sensor Data Collection**

Reads data via I²C from: - **SHT2x/HTU21D** -- temperature & humidity\
- **BH1750** -- ambient light

### **2. MQTT (TLS) -- Secure Transport**

The ESP32 publishes JSON data to **HiveMQ Cloud**.

### **3. Backend -- Node.js Server**

-   Subscribes to MQTT topic\
-   Pushes live updates to the dashboard via **Socket.IO**\
-   Stores sensor history in **PostgreSQL**\
-   Serves weather forecast and history API endpoints

### **4. Frontend -- React Dashboard**

-   Built with **React + Tailwind + Recharts**\
-   Displays real-time updates\
-   Renders historical graphs with smooth gradients\
-   Computes best growth intervals\
-   Shows system health & weather forecast

------------------------------------------------------------------------

# 🌟 Key Features

-   **Real-time live monitoring** (WebSockets)
-   **Historical data visualization** (Recharts)
-   **Gradient environmental charts**
-   **Smart growth interval detection**
-   **Weather data integration**
-   **Responsive, modern UI**
-   **System health and connection monitoring**
-   **Future-proof structure for irrigation automation**

------------------------------------------------------------------------

# 📁 Project Structure

This repository contains the full Floriva system:

    Floriva/
    │
    ├── BackendServer/        # Node.js backend (MQTT + WebSockets + API)
    ├── Frontend/             # React dashboard (Tailwind + Recharts)
    │   ├── src/
    │   ├── public/
    │   └── package.json
    │
    ├── src/                  # ESP32 firmware (PlatformIO)
    ├── include/              # Firmware headers (WiFi/MQTT configs)
    ├── lib/                  # PlatformIO libraries
    ├── test/                 # Firmware tests
    │
    ├── platformio.ini        # ESP32 build config
    ├── Diag27Jul.png         # Circuit diagram
    └── README.md             # (This file)

------------------------------------------------------------------------

# 🔌 Hardware Setup

  Component      ESP32 Pin       Notes
  -------------- --------------- ------------------
  SHT2x/HTU21D   SDA → GPIO 21   Shared I²C lines
                 SCL → GPIO 22   
  BH1750         SDA → GPIO 21   Shared I²C lines
                 SCL → GPIO 22   
  Power          3.3V + GND      Common ground

------------------------------------------------------------------------

# 🚀 Getting Started

## 1️⃣ ESP32 Firmware Setup

Create **`src/secrets.h`**:

``` cpp
#pragma once

#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

#define MQTT_HOST "your-cluster-url.s1.eu.hivemq.cloud"
#define MQTT_PORT 8883
#define MQTT_USER "YOUR_HIVE_MQ_USER"
#define MQTT_PASSWORD "YOUR_HIVE_MQ_PASSWORD"
#define MQTT_TOPIC "esp32/data"

static const char* aCACert = R"EOF(
-----BEGIN CERTIFICATE-----
PASTE-YOUR-HIVEMQ-CA-CERT-HERE
-----END CERTIFICATE-----
)EOF";
```

Upload using PlatformIO.

------------------------------------------------------------------------

## 2️⃣ Backend Setup

``` bash
cd BackendServer
npm install
```

Create **`.env`**:

``` env
MQTT_HOST=your-cluster-url.s1.eu.hivemq.cloud
MQTT_PORT=8883
MQTT_USER=YOUR_USER
MQTT_PASSWORD=YOUR_PASS
MQTT_TOPIC=esp32/data

DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
```

Run backend:

``` bash
npm start
```

------------------------------------------------------------------------

## 3️⃣ Frontend Dashboard (React)

``` bash
cd Frontend
npm install
npm run dev
```

Build for production:

``` bash
npm run build
```

Frontend is deployed through **Netlify**.

------------------------------------------------------------------------

# 🌱 Roadmap

### 🚿 Irrigation System (Coming Soon)

-   [ ] Manual watering mode\
-   [ ] Automatic watering mode\
-   [ ] Pump + relay hardware integration\
-   [ ] Soil moisture sensor\
-   [ ] Irrigation scheduling\
-   [ ] Backend control endpoints

### 🌦 Dashboard Enhancements

-   [ ] Soil moisture graph\
-   [ ] Water usage history\
-   [ ] More plant-specific growth analytics\
-   [ ] Dark mode

### 🛠 Hardware

-   [ ] Tank level sensor\
-   [ ] Weather-adaptive irrigation

------------------------------------------------------------------------

# 🤝 Contributing

Ideas, issues, and pull requests are welcome.\
Floriva is an ongoing learning and engineering project.

------------------------------------------------------------------------

# 📜 License

This project is open-source under the MIT License.\
Feel free to use or modify it---credit is appreciated.
