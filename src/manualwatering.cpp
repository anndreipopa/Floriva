#include "manualwatering.h"
#include "pump.h"
#include <Arduino.h>

void handlePumpCommand(const String& msg) {
    if (msg == "ON")  pumpSet(true);
    else if (msg == "OFF") pumpSet(false);
}
