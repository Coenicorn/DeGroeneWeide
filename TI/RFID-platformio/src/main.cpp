#include <SPI.h>
#include <MFRC522.h>
#include <EEPROM.h>
#include <WiFi.h>

#include "pins.h"

#define TOKEN_MEM_ADDR 0x04
#define TOKEN_SIZE_BYTES 16

#define EEPROM_SIZE_BYTES (TOKEN_SIZE_BYTES)	// De aantal bytes die opgeslagen kunnen worden in de EEPROM

MFRC522 mfrc522(SS_PIN, RST_PIN); // Een instance van de NFC-reader/writer maken die op de goeie pins draait
// this might work, idk though
MFRC522::MIFARE_Key key = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };		  // Een instancie van een key maken

static byte correctToken[TOKEN_SIZE_BYTES];		// Dit is de variabele die waarin de huidige correcte token staat die nodig is om goedgekeurt te worden bij het scannen

// factory default for access token
static constexpr byte defaultAuthKey[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF }; 

// shouldn't upload this to github ':)
static constexpr char ssid[] = "Cisco19073";
static constexpr char password[] = "kaassouflay";

/**
 * Prints a byte array to serial
 * @note does not append new line
 */
void print_byte_array(byte *buffer, size_t bufferSize)
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
	return (memcmp(buffer, correctToken, sizeof(byte) * TOKEN_SIZE_BYTES) == 0);
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
void write_new_token_EEPROM(const byte token[TOKEN_SIZE_BYTES])
{
	EEPROM.writeBytes(TOKEN_MEM_ADDR, token, TOKEN_SIZE_BYTES);

	// for (int i = 0; i < TOKEN_SIZE_BYTES; i++)
	// {
	// 	EEPROM.write(i, token[i]);
	// }
}

// Haalt de data uit de lokale opslag (EEPROM) op en zet deze in de correctToken variabele
void read_correct_token_EEPROM(byte dest[TOKEN_SIZE_BYTES])
{
	EEPROM.readBytes(TOKEN_MEM_ADDR, dest, TOKEN_SIZE_BYTES);
		EEPROM.commit();

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
void enter_read_mode(byte blockAddr)
{
	MFRC522::StatusCode status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockAddr, &key, &(mfrc522.uid));

	if (status != MFRC522::STATUS_OK) // checkt of de statuscode iets anders dan OK is
	{
		Serial.print(F("PCD_Authenticate() failed: "));
		Serial.println(mfrc522.GetStatusCodeName(status));
	}
}

// hetzelfde als de functie enter_read_mode() alleen dan voor het schrijven van data in een aangegeven blok
void enter_write_mode(byte blockAddr)
{
	MFRC522::StatusCode status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_B, blockAddr, &key, &(mfrc522.uid));

	if (status != MFRC522::STATUS_OK) // checkt of de statuscode iets anders dan OK is
	{
		Serial.print(F("PCD_Authenticate() failed: "));
		Serial.println(mfrc522.GetStatusCodeName(status));
	}
}

// Deze functie is om de data van een aangegeven block uit te lezen en te printen naar de serial monitor,  logt in de Serial monitor als het uitlezen faalt en laat dan de statuscode weten

/**
 * Reads data at blockAddr into buffer of size bufSize
 * @param bufSize needs to be at least 18
 */
void read_block(byte blockAddr, byte *buffer, byte *bufSize)
{
	enter_read_mode(TOKEN_MEM_ADDR);

	MFRC522::StatusCode status = mfrc522.MIFARE_Read(blockAddr, buffer, bufSize); // Uitlezen van gegeven blockAddr en de gelezen data scrijven naar de buffer variabele

	if (status != MFRC522::STATUS_OK) // checkt of de statuscode iets anders dan OK is
	{
		Serial.print(F("MIFARE_Read() failed: "));
		Serial.println(mfrc522.GetStatusCodeName(status));

		return;
	}
}

/**
 * Probeert data te schrijven naar een adres op de NFC tag
 * @returns true wanneer de functie faalt
 */
MFRC522::StatusCode write_block(byte blockAddr, byte data[16])
{
	enter_write_mode(TOKEN_MEM_ADDR);

	Serial.print(F("writing data("));
	print_byte_array(data, 16);
	Serial.print(F(") to block "));
	Serial.println(blockAddr);

	MFRC522::StatusCode status = mfrc522.MIFARE_Write(blockAddr, data, 16); // schrijft de gegeven data naar het gegeven block adres op de NFC-pas

	if (status != MFRC522::STATUS_OK)
	{
		Serial.print(F("MIFARE_Write() failed: "));
		Serial.println(mfrc522.GetStatusCodeName(status));
	}

	return status;
}

// Genereert de key nodig om toegang te krijgen tot de data
void generate_key()
{
	for (byte i = 0; i < 6; i++)
	{
		key.keyByte[i] = defaultAuthKey[i];
	}
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

void disconnect_nfc(void) {
	// verbreek verbinding
	mfrc522.PICC_HaltA();
	mfrc522.PCD_StopCrypto1();
}

void initPins(void) {
	// definieren dat de pins van de led lampjes output pins zijn
	pinMode(GREEN_LED_PIN, OUTPUT);
	pinMode(RED_LED_PIN, OUTPUT);
	pinMode(BLUE_LED_PIN, OUTPUT);

	// tool pins
	pinMode(PIN_TOOL_WIPE, INPUT);
	pinMode(PIN_TOOL_NEW_CORRECT_TOKEN, INPUT);
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
	const byte correctToken_debug[TOKEN_SIZE_BYTES] = { 0x61, 0xAC, 0xAE, 0xE6, 0x78, 0xA2, 0xCD, 0x8A, 0x88, 0xEF, 0xDF, 0xDD, 0x2F, 0x27, 0x64, 0x7A };
	write_new_token_EEPROM(correctToken_debug);

	// generate_key();		 // genereert een key die nodig is om bij de data van de NFC-pas te komen
	read_correct_token_EEPROM(correctToken); // De huidig goede token ophalen uit de EEPROM en deze opslaan in correctToken

	Serial.print("Correct token: "); print_byte_array(correctToken, TOKEN_SIZE_BYTES); Serial.println();

	// initial led available
	digitalWrite(BLUE_LED_PIN, HIGH);
}

void loop()
{
	// Dit checkt om te zien of er een NFC-pas voor de reader/writer zit, zo niet dan start de loop functie opnieuw
	if (!mfrc522.PICC_IsNewCardPresent())
		return;

	// Checkt of de NFC-pas ze UID succesvol gelezen kan worden, zo niet dan begint loop opnieuw
	if (!mfrc522.PICC_ReadCardSerial())
		return;

	digitalWrite(BLUE_LED_PIN, LOW);

	int
		toolWipePressed = digitalRead(PIN_TOOL_WIPE),
		toolNewTokenPressed = digitalRead(PIN_TOOL_NEW_CORRECT_TOKEN);

	// maak buffer om de huidige token van de kaart in op te slaan
	byte tokenBufSize = 18;
	byte tokenBuffer[tokenBufSize];

	bool isValidated = false;

	// lees de huidige token en sla op in buffer
	// read_block(TOKEN_BLOCK, buffer, &bufSize);
	enter_read_mode(TOKEN_MEM_ADDR);
	MFRC522::StatusCode status = mfrc522.MIFARE_Read(TOKEN_MEM_ADDR, tokenBuffer, &tokenBufSize); // Uitlezen van gegeven blockAddr en de gelezen data scrijven naar de buffer variabele

	if (status != MFRC522::STATUS_OK) // checkt of de statuscode iets anders dan OK is
	{
		Serial.print(F("PCD_Authenticate() failed: "));
		Serial.println(mfrc522.GetStatusCodeName(status));

		flash_led(RED_LED_PIN);

		disconnect_nfc();

		return;
	}

	// print data in de buffer
	Serial.print(F("Data in token block: ")); print_byte_array(tokenBuffer, TOKEN_SIZE_BYTES); Serial.println();

	if (toolWipePressed)
	{
		// wipe current card
		byte newData[TOKEN_SIZE_BYTES];
		memset(newData, 0x00, TOKEN_SIZE_BYTES);

		Serial.print("Clearing card by writing: "); print_byte_array(newData, TOKEN_SIZE_BYTES); Serial.println();

		status = write_block(TOKEN_MEM_ADDR, newData);

		disconnect_nfc();

		if (status != MFRC522::STATUS_OK)
		{
			Serial.print("Error writing to card while clearing: "); Serial.println(MFRC522::GetStatusCodeName(status));	
		} else {
			// signal succes
			flash_led(BLUE_LED_PIN);
		}

		goto delay_and_blue_led;
	}

	if (toolNewTokenPressed)
	{
		Serial.print("Setting "); print_byte_array(tokenBuffer, TOKEN_SIZE_BYTES); Serial.println(" as new correct token...");
		
		// store new current token
		write_new_token_EEPROM(tokenBuffer);

		// store new token in current correct token
		read_correct_token_EEPROM(correctToken);

		disconnect_nfc();

		flash_led(BLUE_LED_PIN);

		goto delay_and_blue_led;
	}

	// check of de token geldig is
	isValidated = validate_token(tokenBuffer, 16);

	if (isValidated) {

		Serial.println(F("token valid"));

		// genereer een nieuwe token
		byte newToken[TOKEN_SIZE_BYTES];
		// write TOKEN_SIZE random bytes into new token
		get_random_bytes(newToken, TOKEN_SIZE_BYTES);

		// probeer de nieuwe token te writen naar de kaart
		status = write_block(TOKEN_MEM_ADDR, newToken);

		if (status != MFRC522::STATUS_OK)
			Serial.println("write failed, not saving new token");
		else 
		{
			// sla de nieuwe token ook lokaal up als hij naar de kaart is geschreven
			write_new_token_EEPROM(newToken);
			read_correct_token_EEPROM(correctToken);
		}

		disconnect_nfc();
		flash_led(GREEN_LED_PIN);

	} else {

		Serial.println(F("token invalid"));

		disconnect_nfc();
		flash_led(RED_LED_PIN);

	}

	// quirky subroutine
	delay_and_blue_led:

	// nice newline between loops
	Serial.println();

	// take some time between cards
	delay(1000);

	// reset available LED
	digitalWrite(BLUE_LED_PIN, HIGH);
}