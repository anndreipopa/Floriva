#pragma once
#include <PubSubClient.h>

void mqttInit(PubSubClient& client);
void mqttSetCallback(PubSubClient& client, MQTT_CALLBACK_SIGNATURE);
bool mqttEnsureConnected(PubSubClient& client);
void mqttLoop(PubSubClient& client);
