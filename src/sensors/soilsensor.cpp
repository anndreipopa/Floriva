#include "soilsensor.h"
#include "config.h"
#include <Arduino.h>

int readSoilMoistureRaw() {
    pinMode(SENSOR_SOL_POWER, OUTPUT);
    digitalWrite(SENSOR_SOL_POWER, HIGH);

    delay(100); // allow sensor to stabilize

    int value = analogRead(SENSOR_SOL_DATA);

    digitalWrite(SENSOR_SOL_POWER, LOW);

    return value;
}
