#include "soilsensor.h"
#include "config.h"
#include <Arduino.h>

#define SOIL_READ_SAMPLE 5
#define SOIL_READ_DELAY 50

#define SOIL_DRY 3020 // dry soil calibration hardcoded for tests
#define SOIL_WET 2200 // wet soil calibration hardcoded for tests

// Read raw soil moisture value from the sensor

int readSoilMoistureRaw() {
    pinMode(SENSOR_SOL_POWER, OUTPUT);
    digitalWrite(SENSOR_SOL_POWER, HIGH);

    delay(100); // allow sensor to stabilize

    int value = analogRead(SENSOR_SOL_DATA);

    digitalWrite(SENSOR_SOL_POWER, LOW);
    return value;
}

// Read soil moisture multiple times and return the average, for better stability

int readSoilMoistureAveraged() {
    int average = 0;
    for (int i = 0; i < SOIL_READ_SAMPLE; i++) {
        average += readSoilMoistureRaw();
        delay(SOIL_READ_DELAY);
    }
    return average / SOIL_READ_SAMPLE;
}

int soilRawToPercent(int soilRaw) {
    if(soilRaw > SOIL_DRY) soilRaw = SOIL_DRY;
    if(soilRaw < SOIL_WET) soilRaw = SOIL_WET;

    float pct = ((float)(SOIL_DRY - soilRaw) / (SOIL_DRY - SOIL_WET)) * 100.0f;

    if ( pct < 0 ) pct = 0;
    if ( pct > 100 ) pct = 100;

    return (int)(pct);
}