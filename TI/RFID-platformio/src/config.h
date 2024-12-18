#pragma once

/*
    KIJK OF DEZE PINS OP JOUW EIGEN BORD KLOPPEN!!!!!
*/

#define RST_PIN 22		// De pin die om de NFC-reader/writer te hard resetten
#define SS_PIN 5		// De pin die aangesloten is op de SS van de NFC-reader/writer

#define GREEN_LED_PIN 4 // De pin voor het groene led lampje
#define RED_LED_PIN 2	// De pin voor het rode led lampje

#define BATTERY_MEASURE_PIN 36

#define BATTERY_MAX_VOLTAGE 4.2f
#define ANALOG_IN_MAX_VOLTAGE 3.3f
#define ANALOG_IN_RANGE (uint16_t)4096

#define ANALOG_READ_TO_VOLTAGE(_V) (float)((float)_V / (float)ANALOG_IN_RANGE * ANALOG_IN_MAX_VOLTAGE)

#define WIFI_STATUS_PIN 2

#define PIN_TOOL_WIPE 34
#define PIN_TOOL_NEW_CORRECT_TOKEN 35
#define PIN_TOOL_PINGALIVE 32

// temporarily send a ping every hour for testing
#define MILLIS_IN_DAY (1000*60*60*1)

#define TOKEN_MEM_ADDR 4
#define TOKEN_SIZE_BYTES 16

#define EEPROM_SIZE_BYTES (TOKEN_SIZE_BYTES)	// De aantal bytes die opgeslagen kunnen worden in de EEPROM

#define BAT_ADC = 36

/* battery discharge rate is not linear, use lookup table */
static const uint8_t battery_percent_lookup[93] = {
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 15, 15, 20, 20, 25, 25, 30, 30, 35, 40, 40, 45, 45, 50, 55, 55, 60, 60, 60, 65, 65, 65, 65, 70, 70, 70, 75, 75, 75, 75, 80, 80, 80, 80, 80, 85, 85, 85, 85, 90, 90, 90, 90, 95, 95, 95, 95, 100, 100
};

inline static uint8_t getBatteryPercentageFromVoltage(float voltage) {
    if (voltage < 3.27) return 0;
    if (voltage > 4.2) return 100;
    uint8_t i = (uint8_t)( ((voltage - 3.27f) / 0.93f /* 4.2 - 3.27 */) * 92 );
    return battery_percent_lookup[i];
}


// als je geen dev board hebt, comment deze line
#define IS_DEV_BOARD

#ifdef IS_DEV_BOARD

    #define BLUE_LED_PIN 16

#endif

