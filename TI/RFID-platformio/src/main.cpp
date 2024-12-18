/*


If I were to write this code again, I'd write in FreeRTOS because of the subroutines that run at intervals. Shit


 */


#include <SPI.h>
#include <MFRC522.h> 
#include <EEPROM.h>
#include <WiFi.h>
#include <esp_wifi.h>
#include <HTTPClient.h>
#include <Arduino.h>


#include "config.h"

/*
	Dit bestand staat in de .gitignore
	Maak een bestand aan: RFID-platformio/src/secret.h en plak dit erin:

	#pragma once

	static constexpr char ssid[] = REPLACEME;
	static constexpr char password[] = REPLACEME;

	Vervang REPLACEME met het ssid en wachtwoord :)
*/
#include "secret.h"

static MFRC522 mfrc522(SS_PIN, RST_PIN); // Een instance van de NFC-reader/writer maken die op de goeie pins draait
// this might work, idk though
static MFRC522::MIFARE_Key key = { 0xff, 0xff, 0xff, 0xff, 0xff, 0xff }; // Een instancie van een key maken

static HTTPClient http;

// static byte correctToken[TOKEN_SIZE_BYTES];		// Dit is de variabele die waarin de huidige correcte token staat die nodig is om goedgekeurt te worden bij het scannen

// Reads and returns esp's mac-address
String readMacAddress(){
  uint8_t baseMac[6];
  String macAddress = "";
  esp_err_t ret = esp_wifi_get_mac(WIFI_IF_STA, baseMac);
  if (ret == ESP_OK) {
    for(int i = 0; i < sizeof(baseMac); i ++){
		if(i != 0){
			macAddress += ":";
		}
		macAddress += String(baseMac[i], 16);
	}
  } else {
    Serial.println("Failed to read MAC address");
  }

  return macAddress;
}

static String macAddress; 	// Dit is het mac-address van de esp, deze wordt gebruikt om hem te identificeren in de database

String byte_array_to_string(const byte *buffer, size_t bufferSize) 
{
    String token = "";
    for(int i = 0; i < bufferSize; i++)
    {
        token += buffer[i];
    }
    return token;
}

String get_uid_string()
{
    String uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) 
    {
        uid += mfrc522.uid.uidByte[i];   
    } 
    return uid;
}
    

/**
 * Prints a byte array to serial
 * @note does not append new line
 */
void print_byte_array(const byte *buffer, size_t bufferSize)
{
	// print first entry for nice formatting
	Serial.print(F("0x")); Serial.print(buffer[0] < 0x10 ? "0" : ""); Serial.print(buffer[0], HEX);

	for (size_t i = 1; i < bufferSize; i++)
	{
		Serial.print(F(", 0x"));
		Serial.print(buffer[i] < 0x10 ? "0" : "");
		Serial.print(buffer[i], HEX);
	}
}

/**
 * @returns httpresponsecode OR -1 on fail
 */
int dumbPostRequest(String payload, String route)
{
	if (!WiFi.isConnected()) {
		Serial.println("not connected :(");
		digitalWrite(WIFI_STATUS_PIN, HIGH);

		return -1;
	}

	http.begin(SERVER_HOST, SERVER_PORT, String(SERVER_URI_BASE) + route);
	http.addHeader("accept", "application/json");
	http.addHeader("content-type", "application/json"); // required by server for post

	int httpResponseCode = http.POST(payload), ret; // Send POST with payload

	if (httpResponseCode > 0) {
		// success
		Serial.print("server response with code "); Serial.println(httpResponseCode);

		String response = http.getString();
		Serial.println(response);
	} else {
		Serial.print("http request error: "); Serial.println(http.errorToString(httpResponseCode));
		digitalWrite(WIFI_STATUS_PIN, HIGH);

		return -1;
	}

	// End HTTP connection
	http.end();

	return httpResponseCode;
}

int sendAlivePing(uint8_t batteryPercentage) {
	return dumbPostRequest("{\"macAddress\":\"" + macAddress + "\", \"battery\":" + String(batteryPercentage) + "}", "/readers/imalive");
}

int sendNewTokenToServer(String newToken, String cardId) {
	return dumbPostRequest("{\"id\":\"" + cardId + "\", \"token\":" + newToken + "}", "/cards/updateCardToken");
}

/**
 * generates random serie of bytes
 * @param dest If dest IS NOT of size maxLen, this function results in a buffer overflow and undefined behaviour
 */
void get_random_bytes(byte *dest, byte maxLen)
{
	for (int i = 0; i < maxLen; i++)
	{
		dest[i] = random(0, 255);
	}
}

// slaat de nieuwe token op in de lokale opslag (EEPROM)
void write_new_token_EEPROM(const byte* token)
{
	EEPROM.writeBytes(0x00, token, TOKEN_SIZE_BYTES);
	bool stat = EEPROM.commit();
}

// Haalt de data uit de lokale opslag (EEPROM) op en zet deze in de correctToken variabele
// void read_correct_token_EEPROM(byte dest[TOKEN_SIZE_BYTES])
// {
// 	EEPROM.readBytes(0x00, dest, TOKEN_SIZE_BYTES);
// }

/**
 * Start wifiverbinding, wacht niet op verbinding
 */
void initWiFi(const char *ssid, const char *password)
{
	WiFi.mode(WIFI_STA);
	WiFi.begin(ssid, password);

	Serial.print("Connecting to WiFi ..");

	while (WiFi.status() != WL_CONNECTED)
	{

		Serial.print('.');
		delay(1000);
	}

	macAddress = readMacAddress();

	// DEBUG log ip
	Serial.print(F("Got IP address "));
	Serial.println(WiFi.localIP());

	// DEBUG log mac-address
	Serial.print("ESP32 Board MAC Address: ");
  	Serial.println(macAddress);

	Serial.print("server host: "); Serial.println(SERVER_HOST);
	Serial.print("server port: "); Serial.println(SERVER_PORT);
	Serial.print("server base uri: "); Serial.println(SERVER_URI_BASE);

	sendAlivePing(100);
}


// deze functie authenticate met de A key, de A key is nodig om data van de NFC-pas af te kunnen lezen, logt in de Serial monitor als het authenticaten faalt en laat dan de statuscode weten
// returnt 0 als de functie slaagt, anders een niet-nul nummer
int enter_read_mode(byte blockAddr)
{
	MFRC522::StatusCode status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockAddr, &key, &(mfrc522.uid));

	if (status != MFRC522::STATUS_OK) // checkt of de statuscode iets anders dan OK is
	{
		Serial.print(F("PCD_Authenticate() failed: "));
		Serial.println(mfrc522.GetStatusCodeName(status));

		return 1;
	}

	return 0;
}

// hetzelfde als de functie enter_read_mode() alleen dan voor het schrijven van data in een aangegeven blok
// returnt 0 als de functie slaagt, anders een niet-nul nummer
int enter_write_mode(byte blockAddr)
{
	MFRC522::StatusCode status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_B, blockAddr, &key, &(mfrc522.uid));

	if (status != MFRC522::STATUS_OK) // checkt of de statuscode iets anders dan OK is
	{
		Serial.print(F("PCD_Authenticate() failed: "));
		Serial.println(mfrc522.GetStatusCodeName(status));

		return 1;
	}

	return 0;
}

// leest een blok geheugen en slaat deze op in buffer
// returnt 0 als de functie slaagt, anders een niet-nul nummer 
int read_block(byte blockAddr, byte *buffer, byte *bufSize)
{
	if (enter_read_mode(TOKEN_MEM_ADDR))
	{
		// er ging iets fout
		Serial.println("something went wrong trying to enter read mode");

		return 1;
	}

	MFRC522::StatusCode status = mfrc522.MIFARE_Read(blockAddr, buffer, bufSize); // Uitlezen van gegeven blockAddr en de gelezen data scrijven naar de buffer variabele

	if (status != MFRC522::STATUS_OK) // checkt of de statuscode iets anders dan OK is
	{
		Serial.print(F("MIFARE_Read() failed: "));
		Serial.println(mfrc522.GetStatusCodeName(status));

		return 1;
	}

	return 0;
}

// deze functie schrijft data naar een adres op de nfc tag
// returnt 0 als de functie slaagt, anders een niet-nul nummer
int write_block(byte blockAddr, byte data[16])
{
	if (enter_write_mode(TOKEN_MEM_ADDR))
	{
		Serial.println("something went wrong trying to enter write mode");

		return 1;
	}

	Serial.print(F("writing data("));
	print_byte_array(data, 16);
	Serial.print(F(") to block "));
	Serial.println(blockAddr);

	MFRC522::StatusCode status = mfrc522.MIFARE_Write(blockAddr, data, 16); // schrijft de gegeven data naar het gegeven block adres op de NFC-pas

	if (status != MFRC522::STATUS_OK)
	{
		Serial.print(F("MIFARE_Write() failed: "));
		Serial.println(mfrc522.GetStatusCodeName(status));

		return 1;
	}

	return 0;
}

void flash_led(uint pin)
{
	for (uint8_t i = 0; i < 3; i++)
	{
		// timings completely arbitrary
		digitalWrite(pin, HIGH);
		delay(100);
		digitalWrite(pin, LOW);
		delay(100);
	}
}

// returnt 0 wanneer de functie slaagt, anders niet-nul
int disconnect_nfc(void) {
	// verbreek verbinding
	MFRC522::StatusCode s;

	s = mfrc522.PICC_HaltA();
	
	if (s != MFRC522::STATUS_OK)
	{
		Serial.print("couldn't halt PICC: "); Serial.println(MFRC522::GetStatusCodeName(s));
		return 1;
	}

	mfrc522.PCD_StopCrypto1();

	return 0;
}

void initPins(void) {
	// definieren dat de pins van de led lampjes output pins zijn
	pinMode(GREEN_LED_PIN, OUTPUT);
	pinMode(RED_LED_PIN, OUTPUT);
	pinMode(WIFI_STATUS_PIN, OUTPUT);
	pinMode(BATTERY_MEASURE_PIN, INPUT);
	

#ifdef IS_DEV_BOARD
	// tool pins
	pinMode(PIN_TOOL_WIPE, INPUT);
	pinMode(PIN_TOOL_NEW_CORRECT_TOKEN, INPUT);
	pinMode(PIN_TOOL_PINGALIVE, INPUT);
#endif

	digitalWrite(WIFI_STATUS_PIN, LOW);

}

void setup()
{
	initPins();

	Serial.begin(115200);
	SPI.begin();			   // SPI bus initialiseren, geen idee hoe het werkt tbh maar het is nodig om de data van de MFRC522 te kunnen lezen
	mfrc522.PCD_Init();		   // De MFRC522 kaart initialiseren, deze leest van en schrijft naar het NFC-pasje
	EEPROM.begin(EEPROM_SIZE_BYTES); // De EEPROM initialiseren, deze wordt gebruikt voor het lokaal opslaan van de token (dit is tijdelijk totdat we een server hebben)
	initWiFi(ssid, password);

	// // DEBUG set correct token
	// const byte correctToken_debug[TOKEN_SIZE_BYTES] = { 0x6B, 0x8C, 0x5C, 0x9E, 0x91, 0xAB, 0xC3, 0x10, 0xEF, 0x79, 0xBE, 0xF2, 0xC2, 0x4D, 0xF1, 0xFA };
	// write_new_token_EEPROM(correctToken_debug);

	// read_correct_token_EEPROM(correctToken); // De huidig goede token ophalen uit de EEPROM en deze opslaan in correctToken


	// Serial.print("Correct token: "); print_byte_array(correctToken, TOKEN_SIZE_BYTES); Serial.println();
}

uint8_t getBatteryPercentage() {
    int analog_value = analogRead(BATTERY_MEASURE_PIN);

    if (analog_value >= 0 && analog_value < 1900) {
        return 0;
    } else if (analog_value >= 1900 && analog_value < 2200) {
        return 10;
    } else if (analog_value >= 2200 && analog_value < 2220) {
        return 20;
    } else if (analog_value >= 2220 && analog_value < 2245) {
        return 30;
    } else if (analog_value >= 2245 && analog_value < 2260) {
        return 40;
    } else if (analog_value >= 2260 && analog_value < 2285) {
        return 50;
    } else if (analog_value >= 2285 && analog_value < 2305) {
        return 60;
    } else if (analog_value >= 2305 && analog_value < 2355) {
        return 70;
    } else if (analog_value >= 2355 && analog_value < 2395) {
        return 80;
    } else if (analog_value >= 2395 && analog_value < 2450) {
        return 90;
    } else if (analog_value >= 2450) {
        return 100;
    } else {
        // Return -1 to indicate an invalid analog value
        return -1;
    }
}

uint8_t readBatteryPercentage()
{
	uint16_t analogValue = analogRead(BATTERY_MEASURE_PIN); // measured with voltage divider

	// convert reading to actual read voltage
	const float voltage = ANALOG_READ_TO_VOLTAGE(analogValue * 2); // * 2 to compensate for fysical voltage divider

	Serial.print("analog reading: "); Serial.println(analogValue);
	Serial.print("battery voltage: "); Serial.println(voltage);

	uint8_t percentage = getBatteryPercentageFromVoltage(voltage);
	Serial.print("battery percentage "); Serial.println(percentage);

	return percentage;
}

/**
 * @returns 1 on failure, 0 on success
 */
int authenticateToken(String token, String uuid) {
	int ret = dumbPostRequest("{\"macAddress\":\"" + macAddress + "\",\"cardId\":\"" + uuid + "\",\"token\":\"" + token + "\"}", "/auth/authenticateCard");

	Serial.print("return code: "); Serial.println(ret);

	if (ret < 0) return 1;
	else if (ret == 200) return 0;
	else return 1;
}

static unsigned long previousMilliseconds = 0;
static const unsigned long interval = MILLIS_IN_DAY;

void loop()
{	
	int toolSendAlivePingPressed = digitalRead(PIN_TOOL_PINGALIVE);

	// periodically send an alive ping to the server
	unsigned long currentMilliseconds = millis();
	if (currentMilliseconds - previousMilliseconds >= interval || toolSendAlivePingPressed)
	{
		// this is all so fucking jank

		previousMilliseconds = currentMilliseconds;

		sendAlivePing(getBatteryPercentage());
	
		if (toolSendAlivePingPressed) delay(1000);
	}

	// Dit checkt om te zien of er een NFC-pas voor de reader/writer zit, zo niet dan start de loop functie opnieuw
	if (!mfrc522.PICC_IsNewCardPresent())
		return;

	// Checkt of de NFC-pas ze UID succesvol gelezen kan worden, zo niet dan begint loop opnieuw
	if (!mfrc522.PICC_ReadCardSerial())
		return;

	delay(100);

#ifdef IS_DEV_BOARD
	// slaat op of er een functietoets is gebruikt
	int
		toolWipePressed = digitalRead(PIN_TOOL_WIPE),
		toolNewTokenPressed = digitalRead(PIN_TOOL_NEW_CORRECT_TOKEN);
#endif

	MFRC522::StatusCode status;

	// maak buffer om de huidige token van de kaart in op te slaan
	byte tokenBufSize = 18;
	byte scannedCardTokenBuffer[tokenBufSize];

	int authRet = -1;
	String token = "";

	if (read_block(TOKEN_MEM_ADDR, scannedCardTokenBuffer, &tokenBufSize)) // checkt of de statuscode iets anders dan OK is
	{
		// read faalde

		Serial.println("read failed :(");

		flash_led(RED_LED_PIN);

		goto prepare_new_card;
	}

	// print data in de buffer
	Serial.print(F("Data in token block: ")); print_byte_array(scannedCardTokenBuffer, TOKEN_SIZE_BYTES); Serial.println();




	authRet = authenticateToken(byte_array_to_string(scannedCardTokenBuffer, TOKEN_SIZE_BYTES), get_uid_string());

	Serial.print("auth return value: "); Serial.println(authRet);
	
	// authenticate token with server
	if (authRet)
	{
		Serial.println(F("token invalid"));

		flash_led(RED_LED_PIN);

		goto prepare_new_card;
	}



	// token is geldig
	Serial.println(F("token valid, access granted"));

	// genereer een nieuwe token
	byte newToken[TOKEN_SIZE_BYTES];
	get_random_bytes(newToken, TOKEN_SIZE_BYTES);

	// first, try to update the token on the server
	if (sendNewTokenToServer(byte_array_to_string(newToken, TOKEN_SIZE_BYTES), get_uid_string()) < 0) {
		// send failed, can't reach server, don't update token
		Serial.println(F("womp womp no connection, not updating token on card"));

		flash_led(RED_LED_PIN);

		goto prepare_new_card;
	}

	// token updated on server, now update on card

	if (write_block(TOKEN_MEM_ADDR, newToken))
	{
		// write to card failed, reset token on server
		// if the token is updated on the server, but not on the card, some weird desync shit happens and everything breaks
		sendNewTokenToServer(byte_array_to_string(scannedCardTokenBuffer, TOKEN_SIZE_BYTES), get_uid_string());

		Serial.print("write failed, not saving new token, status: "); Serial.println(MFRC522::GetStatusCodeName(status));

		flash_led(RED_LED_PIN);

		goto prepare_new_card;
	}

	// sla de nieuwe token ook lokaal up als hij naar de kaart is geschreven
	// write_new_token_EEPROM(newToken);
	// read_correct_token_EEPROM(correctToken);

	flash_led(GREEN_LED_PIN);



	prepare_new_card:

	disconnect_nfc();

	// nice newline between loops
	Serial.println();

	// take some time between cards
	// redundant, we check if there's a new card at the top of loop(), otherwise return
	// delay(1000);
}