#include "lightsensor.h"
#include <BH1750.h>

static BH1750 lightSensor;

void lightSensorInit() {
    lightSensor.begin();
}

int readLightLevel() {
    float lux = lightSensor.readLightLevel();
    if(lux < 0) return -1; // error
    return(int)lux;
}