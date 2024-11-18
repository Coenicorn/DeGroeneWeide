#include <SPI.h>
#include <MFRC522.h>
#include <EEPROM.h>
#include <WiFi.h>

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

#define TOKEN_MEM_ADDR 4
#define TOKEN_SIZE_BYTES 16

#define EEPROM_SIZE_BYTES (TOKEN_SIZE_BYTES)	// De aantal bytes die opgeslagen kunnen worden in de EEPROM

MFRC522 mfrc522(SS_PIN, RST_PIN); // Een instance van de NFC-reader/writer maken die op de goeie pins draait
// this might work, idk though
MFRC522::MIFARE_Key key = { 0xff, 0xff, 0xff, 0xff, 0xff, 0xff }; // Een instancie van een key maken

static byte correctToken[TOKEN_SIZE_BYTES];		// Dit is de variabele die waarin de huidige correcte token staat die nodig is om goedgekeurt te worden bij het scannen

// factory default for access token
// static constexpr byte defaultAuthKey[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF }; 

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

// checkt of de gegeven token de
bool validate_token(byte *buffer)
{
	// bool checked = true;

	// for (int i = 0; i < bufferSize; i++)
	// {
	// 	if (buffer[i] != correctToken[i])
	// 	{
	// 		checked = false;
	// 	}
	// }

	// return checked;

	// compare buffer with correctToken, memcpy returns 0 if they are equal
	return (memcmp(buffer, correctToken, sizeof(byte) * TOKEN_SIZE_BYTES));
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

	// for (int i = 0; i < TOKEN_SIZE_BYTES; i++)
	// {
	// 	EEPROM.write(i, token[i]);
	// }
}

// Haalt de data uit de lokale opslag (EEPROM) op en zet deze in de correctToken variabele
void read_correct_token_EEPROM(byte dest[TOKEN_SIZE_BYTES])
{
	EEPROM.readBytes(0x00, dest, TOKEN_SIZE_BYTES);

	// for (int i = 0; i < 16; i++)
	// {
	// 	dest[i] = EEPROM.read(i);
	// 	EEPROM.commit();
	// }
}

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

	// DEBUG log ip
	Serial.print(F("Got IP address "));
	Serial.println(WiFi.localIP());
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

#ifdef IS_DEV_BOARD
	// tool pins
	pinMode(PIN_TOOL_WIPE, INPUT);
	pinMode(PIN_TOOL_NEW_CORRECT_TOKEN, INPUT);
#endif
}

void setup()
{
	initPins();

	Serial.begin(115200);
	SPI.begin();			   // SPI bus initialiseren, geen idee hoe het werkt tbh maar het is nodig om de data van de MFRC522 te kunnen lezen
	mfrc522.PCD_Init();		   // De MFRC522 kaart initialiseren, deze leest van en schrijft naar het NFC-pasje
	EEPROM.begin(EEPROM_SIZE_BYTES); // De EEPROM initialiseren, deze wordt gebruikt voor het lokaal opslaan van de token (dit is tijdelijk totdat we een server hebben)
	// initWiFi(ssid, password);

	// DEBUG set correct token
	// const byte correctToken_debug[TOKEN_SIZE_BYTES] = { 0x61, 0xAC, 0xAE, 0xE6, 0x78, 0xA2, 0xCD, 0x8A, 0x88, 0xEF, 0xDF, 0xDD, 0x2F, 0x27, 0x64, 0x7A };
	// write_new_token_EEPROM(correctToken_debug);

	read_correct_token_EEPROM(correctToken); // De huidig goede token ophalen uit de EEPROM en deze opslaan in correctToken

	Serial.print("Correct token: "); print_byte_array(correctToken, TOKEN_SIZE_BYTES); Serial.println();
}

void loop()
{
	// Dit checkt om te zien of er een NFC-pas voor de reader/writer zit, zo niet dan start de loop functie opnieuw
	if (!mfrc522.PICC_IsNewCardPresent())
		return;

	// Checkt of de NFC-pas ze UID succesvol gelezen kan worden, zo niet dan begint loop opnieuw
	if (!mfrc522.PICC_ReadCardSerial())
		return;

#ifdef IS_DEV_BOARD
	// slaat op of er een functietoets is gebruikt
	int
		toolWipePressed = digitalRead(PIN_TOOL_WIPE),
		toolNewTokenPressed = digitalRead(PIN_TOOL_NEW_CORRECT_TOKEN);
#endif

	MFRC522::StatusCode status;

	// maak buffer om de huidige token van de kaart in op te slaan
	byte tokenBufSize = 18;
	byte tokenBuffer[tokenBufSize];

	if (read_block(TOKEN_MEM_ADDR, tokenBuffer, &tokenBufSize)) // checkt of de statuscode iets anders dan OK is
	{
		// read faalde

		flash_led(RED_LED_PIN);

		goto prepare_new_card;
	}

	// print data in de buffer
	Serial.print(F("Data in token block: ")); print_byte_array(tokenBuffer, TOKEN_SIZE_BYTES); Serial.println();

#ifdef IS_DEV_BOARD
	if (toolWipePressed)
	{
		// wipe current card
		byte newData[TOKEN_SIZE_BYTES];
		// zet alle bytes (TOKEN_SIZE_BYTES bytes) naar 0x00 in de buffer
		memset(newData, 0x00, TOKEN_SIZE_BYTES);

		Serial.print("Clearing card by writing: "); print_byte_array(newData, TOKEN_SIZE_BYTES); Serial.println();

		if (write_block(TOKEN_MEM_ADDR, newData))
		{
			// wipe fail
			flash_led(RED_LED_PIN);
		} else {
			// wipe success
			flash_led(GREEN_LED_PIN);
		}

		flash_led(BLUE_LED_PIN);

		goto prepare_new_card;
	}

	if (toolNewTokenPressed)
	{
		Serial.print("Setting "); print_byte_array(tokenBuffer, TOKEN_SIZE_BYTES); Serial.println(" as new correct token...");
		
		// sla nieuwe token lokaal op
		write_new_token_EEPROM(tokenBuffer);
		// en zet deze in correctToken
		read_correct_token_EEPROM(correctToken);

		flash_led(BLUE_LED_PIN);

		goto prepare_new_card;
	}
#endif

	Serial.print("Correct token: "); print_byte_array(correctToken, TOKEN_SIZE_BYTES); Serial.println();

	// check of de token geldig is
	if (validate_token(tokenBuffer))
	{
		Serial.println(F("token invalid"));

		flash_led(RED_LED_PIN);

		goto prepare_new_card;
	}

	// token is geldig
	Serial.println(F("token valid"));

	// genereer en schrijf een nieuwe token
	byte newToken[TOKEN_SIZE_BYTES];
	get_random_bytes(newToken, TOKEN_SIZE_BYTES);

	if (write_block(TOKEN_MEM_ADDR, newToken))
	{
		Serial.print("write failed, not saving new token: "); Serial.println(MFRC522::GetStatusCodeName(status));

		flash_led(RED_LED_PIN);

		goto prepare_new_card;
	}

	// sla de nieuwe token ook lokaal up als hij naar de kaart is geschreven
	write_new_token_EEPROM(newToken);
	read_correct_token_EEPROM(correctToken);

	flash_led(GREEN_LED_PIN);



	prepare_new_card:

	disconnect_nfc();

	// nice newline between loops
	Serial.println();

	// take some time between cards
	delay(1000);
}