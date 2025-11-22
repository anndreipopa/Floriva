#include <Arduino.h>
#include <Wire.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

#include "secrets.h"
#include "config.h"

#include "wifimanager.h"
#include "mqttmanager.h"
#include "pump.h"
#include "manualwatering.h"

#include "sensors/airsensor.h"
#include "sensors/lightsensor.h"
#include "sensors/soilsensor.h"

WiFiClientSecure espClient;
PubSubClient mqttClient(espClient);

//
// MQTT message callback
//
void mqttCallback(char* topic, byte* payload, unsigned int length) {
    String message;
    for (unsigned int i = 0; i < length; i++) {
        message += (char)payload[i];
    }

    // Pump control topic
    if (String(topic) == MQTT_PUMP_CMD_TOPIC) {
        handlePumpCommand(message);   // ON / OFF
    }
}

//
// SETUP
//
void setup() {
    Serial.begin(115200);
    delay(200);

    Wire.begin(21, 22);


    pinMode(LED_PIN, OUTPUT);

    // WiFi + MQTT
    wifiSetup();
    mqttInit(mqttClient);
    mqttSetCallback(mqttClient, mqttCallback);

    // Pump + sensors
    pumpInit();
    airSensorInit();
    lightSensorInit();

    Serial.println("Setup complete.");
}

//
// LOOP
//
void loop() {
    // Keep MQTT alive
    mqttEnsureConnected(mqttClient);
    mqttLoop(mqttClient);

    static unsigned long lastRead = 0;
    unsigned long now = millis();

    if (!wifiConnected()) {
    Serial.println("WiFi disconnected, trying reconnect...");
    WiFi.reconnect();
    delay(1000);
}

    // Read sensors every X seconds
    if (now - lastRead >= SENSOR_READ_INTERVAL) {
        lastRead = now;

        // === AIR SENSOR ===
        AirData air = readAir();

        // === LIGHT SENSOR ===
        float lux = readLightLevel();

        // === SOIL SENSOR ===
        int soil = readSoilMoistureRaw();

        // LED blink on successful air sensor read
        if (air.valid) {
            digitalWrite(LED_PIN, HIGH);
            delay(100);
            digitalWrite(LED_PIN, LOW);
        }

        // Build JSON message
        char jsonMsg[256];
        snprintf(jsonMsg, sizeof(jsonMsg),
            "{\"lux\": %.1f, \"temp\": %.1f, \"humidity\": %.1f, \"soil_raw\": %d}",
            lux,
            air.temperature,
            air.humidity,
            soil
        );

        Serial.println("Publishing:");
        Serial.println(jsonMsg);

        // Send to MQTT
        mqttClient.publish(MQTT_TOPIC, jsonMsg);
    }
}
