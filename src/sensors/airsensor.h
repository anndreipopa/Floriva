#pragma once

struct AirData {
    float temperature;
    float humidity;
    bool valid;
};

void airSensorInit();
AirData readAir();