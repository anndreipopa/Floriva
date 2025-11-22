#include "wifimanager.h"
#include <WiFi.h>
#include <secrets.h>

void wifiSetup() {
    WiFi.mode(WIFI_STA);
    WiFi.setAutoConnect(true);
    WiFi.setAutoReconnect(true);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    Serial.print("Connecting to WiFi");

    // Wait for connection initially
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }

    Serial.println("\n✓ WiFi connected");
    Serial.println(WiFi.localIP());
}

bool wifiConnected() {
    return WiFi.status() == WL_CONNECTED;
}
