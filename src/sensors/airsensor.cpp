#include "airsensor.h"
#include "config.h"
#include <SHT2x.h>

static SHT2x airSensor;

void airSensorInit() {
    airSensor.begin();
}

AirData readAir() {
    AirData data;
    data.valid = airSensor.read();

    if (!data.valid) {
        data.temperature = 0;
        data.humidity = 0;
        return data;
    }

    data.temperature = airSensor.getTemperature() + AIR_TEMP_OFFSET;
    data.humidity    = airSensor.getHumidity();

    return data;
}
