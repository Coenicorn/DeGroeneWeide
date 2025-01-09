#pragma once

/*
    KIJK OF DEZE PINS OP JOUW EIGEN BORD KLOPPEN!!!!!
*/

#define RST_PIN 22		// De pin die om de NFC-reader/writer te hard resetten
#define SS_PIN 5		// De pin die aangesloten is op de SS van de NFC-reader/writer

#define RED_LED_PIN 2
#define GREEN_LED_PIN 4
#define BLUE_LED_PIN 33

#define ERR_STATUS_LED_PIN 26

#define PCB_BUTTON_PIN 25

#define WIFI_STATUS_PIN BLUE_LED_PIN // use blue led for wifi status

// temporarily send a ping every hour for testing
#define MILLIS_IN_DAY (1000*60*60*1)

#define TOKEN_MEM_ADDR 4
#define TOKEN_SIZE_BYTES 16

#define EEPROM_SIZE_BYTES (TOKEN_SIZE_BYTES)	// De aantal bytes die opgeslagen kunnen worden in de EEPROM

#define BAT_ADC 36