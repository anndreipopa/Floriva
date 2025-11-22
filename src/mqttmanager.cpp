#include "mqttmanager.h"
#include "config.h"
#include <secrets.h>
#include <WiFiClientSecure.h>

extern WiFiClientSecure espClient;

void mqttInit(PubSubClient& client) {
    espClient.setCACert(aCACert);
    client.setServer(MQTT_HOST, MQTT_PORT);
}

bool mqttEnsureConnected(PubSubClient& client) {
    if (client.connected()) return true;

    Serial.print("Connecting to MQTT... ");
    String id = "ESP32-" + String(random(0xffff), HEX);

    if (client.connect(id.c_str(), MQTT_USER, MQTT_PASSWORD)) {
        Serial.println("connected");
        client.subscribe(MQTT_PUMP_CMD_TOPIC);
    } else {
        Serial.print("failed, rc=");
        Serial.println(client.state());
        delay(3000);
    }

    return client.connected();
}

void mqttLoop(PubSubClient& client) {
    client.loop();
}

void mqttSetCallback(PubSubClient& client, MQTT_CALLBACK_SIGNATURE) {
    client.setCallback(callback);
}
