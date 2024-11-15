#include <SPI.h>
#include <MFRC522.h>
#include <EEPROM.h>
#include <WiFi.h>

#define RST_PIN 22		// De pin die om de NFC-reader/writer te hard resetten
#define SS_PIN 5		// De pin die aangesloten is op de SS van de NFC-reader/writer
#define GREEN_LED_PIN 2 // De pin voor het groene led lampje
#define RED_LED_PIN 4	// De pin voor het rode led lampje
#define EEPROM_SIZE 16	// De aantal bytes die opgeslagen kunnen worden in de EEPROM

#define TOKEN_BLOCK 4
#define TOKEN_SIZE 16

MFRC522 mfrc522(SS_PIN, RST_PIN); // Een instance van de NFC-reader/writer maken die op de goeie pins draait
MFRC522::MIFARE_Key key;		  // Een instancie van een key maken

static byte correctToken[16];		// Dit is de variabele die waarin de huidige correcte token staat die nodig is om goedgekeurt te worden bij het scannen

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
	for (size_t i = 0; i < bufferSize; i++)
	{
		Serial.print(buffer[i] < 0x10 ? "0" : "");
		Serial.print(buffer[i], HEX);
		Serial.print(F(" "));
	}
}

// checkt of de gegeven token de
bool validate_token(byte *buffer, byte bufferSize)
{
	bool checked = true;

	for (int i = 0; i < bufferSize; i++)
	{
		if (buffer[i] != correctToken[i])
		{
			checked = false;
		}
	}

	return checked;
}

// genereert een nieuwe 16 bytes lange token en slaat deze op in newToken
/**
 * generates new token
 * @param buffer must be 16 bytes in size
 */
void generate_random_token(byte dest[TOKEN_SIZE])
{
	for (int i = 0; i < TOKEN_SIZE; i++)
	{
		dest[i] = random(0, 255);
	}
}

// slaat de nieuwe token op in de lokale opslag (EEPROM)
void save_new_token_EEPROM(const byte token[TOKEN_SIZE])
{
	for (int i = 0; i < 16; i++)
	{
		EEPROM.write(i, token[i]);
	}
}

// Haalt de data uit de lokale opslag (EEPROM) op en zet deze in de correctToken variabele
void read_correct_token_EEPROM(byte dest[TOKEN_SIZE])
{
	for (int i = 0; i < 16; i++)
	{
		dest[i] = EEPROM.read(i);
		EEPROM.commit();
	}
}

/**
 * Start wifiverbinding
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
	enter_read_mode(TOKEN_BLOCK);

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
	enter_write_mode(TOKEN_BLOCK);

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

	for (uint8_t i = 0; i < 5; i++)
	{
		// timings completely arbitrary
		digitalWrite(pin, HIGH);
		delay(100);
		digitalWrite(pin, LOW);
		delay(100);
	}
}

void setup()
{
	// definieren dat de pins van de led lampjes output pins zijn
	pinMode(GREEN_LED_PIN, OUTPUT);
	pinMode(RED_LED_PIN, OUTPUT);

	Serial.begin(115200);
	SPI.begin();			   // SPI bus initialiseren, geen idee hoe het werkt tbh maar het is nodig om de data van de MFRC522 te kunnen lezen
	mfrc522.PCD_Init();		   // De MFRC522 kaart initialiseren, deze leest van en schrijft naar het NFC-pasje
	EEPROM.begin(EEPROM_SIZE); // De EEPROM initialiseren, deze wordt gebruikt voor het lokaal opslaan van de token (dit is tijdelijk totdat we een server hebben)
	initWiFi(ssid, password);

	generate_key();		 // genereert een key die nodig is om bij de data van de NFC-pas te komen
	read_correct_token_EEPROM(correctToken); // De huidig goede token ophalen uit de EEPROM en deze opslaan in correctToken
}

void loop()
{

	// Dit checkt om te zien of er een NFC-pas voor de reader/writer zit, zo niet dan start de loop functie opnieuw
	if (!mfrc522.PICC_IsNewCardPresent())
		return;

	// Checkt of de NFC-pas ze UID succesvol gelezen kan worden, zo niet dan begint loop opnieuw
	if (!mfrc522.PICC_ReadCardSerial())
		return;

	// maak buffer om de huidige token van de kaart in op te slaan
	byte bufSize = 18;
	byte buffer[bufSize];

	// lees de huidige token en sla op in buffer
	read_block(TOKEN_BLOCK, buffer, &bufSize);

	Serial.print(F("Data in token block: ")); print_byte_array(buffer, bufSize); Serial.println();

	// check of de token geldig is
	const bool isValidated = validate_token(buffer, 16);

	if (!isValidated)
	{
		// verbreek verbinding
		mfrc522.PICC_HaltA();
		mfrc522.PCD_StopCrypto1();

		Serial.println("token invalid");

		flash_led(RED_LED_PIN);

		return;
	}

	// token is geldig

	// genereer een nieuwe token
	byte newToken[TOKEN_SIZE];
	generate_random_token(newToken);

	save_new_token_EEPROM(newToken);

	MFRC522::StatusCode status = write_block(TOKEN_BLOCK, newToken);

	// probeer nieuwe token te schrijven naar tag
	if (status != MFRC522::STATUS_OK)
		Serial.println("write failed :(");

	// verbreekt de verbinding met de kaart zodat er weer een nieuwe gescant kan worden
	mfrc522.PICC_HaltA();
	mfrc522.PCD_StopCrypto1();

	// Als de token geldig is dan laat die een groen lampje branden en gaat de rest van de code verder
	// als hij ongeldig is dan laat die een rood lampje branden en restart de loop functie weer
	Serial.println("valid token");

	flash_led(GREEN_LED_PIN);
}