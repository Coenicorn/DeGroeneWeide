#pragma once

/*
    KIJK OF DEZE PINS OP JOUW EIGEN BORD KLOPPEN!!!!!
*/

#define RST_PIN 22		// De pin die om de NFC-reader/writer te hard resetten
#define SS_PIN 5		// De pin die aangesloten is op de SS van de NFC-reader/writer

#define GREEN_LED_PIN 25 // De pin voor het groene led lampje
#define RED_LED_PIN 26	// De pin voor het rode led lampje

#define WIFI_STATUS_PIN 2

#define PIN_TOOL_WIPE 34
#define PIN_TOOL_NEW_CORRECT_TOKEN 35
#define PIN_TOOL_PINGALIVE 32

// als je geen dev board hebt, comment deze line
#define IS_DEV_BOARD

#ifdef IS_DEV_BOARD

    #define BLUE_LED_PIN 33

#endif