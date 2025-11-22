#include "pump.h"
#include "config.h"
#include <Arduino.h>

static bool pumpState = false;

void pumpInit() {
    pinMode(PUMP_PIN, OUTPUT);
    digitalWrite(PUMP_PIN, HIGH);
}

void pumpSet(bool on) {
    digitalWrite(PUMP_PIN, on ? LOW : HIGH);
    pumpState = on;
}

bool pumpIsOn() {
    return pumpState;
}
