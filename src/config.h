#pragma once

// ======= Pins =======
static const int LED_PIN   = 17;
static const int PUMP_PIN  = 4;

// Soil sensor pins
static const int SENSOR_SOL_POWER = 26;
static const int SENSOR_SOL_DATA  = 34;

// ======= Calibration =======
static const float AIR_TEMP_OFFSET = -1.2;

// ======= MQTT Topics (NOT secrets) =======
static const char MQTT_PUMP_CMD_TOPIC[]    = "monitor/andrei/pompa/cmd";
static const char MQTT_PUMP_STATUS_TOPIC[] = "monitor/andrei/pompa/status";

// Publishing interval
static const unsigned long SENSOR_READ_INTERVAL = 5000;
