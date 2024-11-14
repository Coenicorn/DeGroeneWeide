#include <SPI.h>
#include <MFRC522.h>
#include <EEPROM.h>
#include <WiFi.h>


#define RST_PIN         22    // De pin die om de NFC-reader/writer te hard resetten
#define SS_PIN          5     // De pin die aangesloten is op de SS van de NFC-reader/writer
#define GREEN_LED_PIN   2     // De pin voor het groene led lampje
#define RED_LED_PIN     4     // De pin voor het rode led lampje
#define EEPROM_SIZE     16    // De aantal bytes die opgeslagen kunnen worden in de EEPROM


MFRC522 mfrc522(SS_PIN, RST_PIN);   // Een instance van de NFC-reader/writer maken die op de goeie pins draait
MFRC522::MIFARE_Key key;            // Een instancie van een key maken
MFRC522::StatusCode status;         // Een instancie van de status maken zodat de status van processen opgehaald kan worden

byte newToken[16];            // Dit is de variabele waarin de straks nieuwe gegenereerde token op wordt geslagen
byte correctToken[16];        // Dit is de variabele die waarin de huidige correcte token staat die nodig is om goedgekeurt te worden bij het scannen
byte buffer[18];              // Dit is de buffer waar de gelezen data in op wordt geslagen zodat die daarna naar de Serial monitor geprint kan worden of opgeslagen kan worden (eerlijkgezegd geen idee waaom het 18 is ipv 16 maar anders doet hij het niet)
byte size = sizeof(buffer);   // Om later de grootte van de buffer mee te geven aan de read en write functie
byte tokenBlock = 4;           // Welk blok adres(16 bytes) er later uitgelezen wordt van de NFC-pas 


const char* ssid = "Cisco19073";
const char* password = "kaassouflay";

// Print de gegeven byte_array naar de Serial monitor
void dump_byte_array(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
  Serial.println();
}



// checkt of de gegeven token de 
bool validate_token(byte *buffer, byte bufferSize) {
  bool checked = true;
  for(int i = 0; i < bufferSize; i++){
    if(buffer[i] != correctToken[i])
    {
      checked = false;
    }
  }
  return checked;
}



// genereert een nieuwe 16 bytes lange token en slaat deze op in newToken
void generate_new_token(){
  for (int i = 0; i < 16; i++){
    newToken[i] = random(0, 255);
  }
}



// slaat de nieuwe token op in de lokale opslag (EEPROM)
void save_new_token() {
  for(int i = 0; i < 16; i++){
    EEPROM.write(i, newToken[i]);
  }
}



// Haalt de data uit de lokale opslag (EEPROM) op en zet deze in de correctToken variabele
void set_correct_token(){
  for(int i = 0; i < 16; i++){
    correctToken[i] = EEPROM.read(i);
    EEPROM.commit();
  }
}


void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
}




// deze functie authenticate met de A key, de A key is nodig om data van de NFC-pas af te kunnen lezen, logt in de Serial monitor als het authenticaten faalt en laat dan de statuscode weten
void read_mode(byte blockAddr){
  
  Serial.println(F("Authenticating using key A..."));
  Serial.println();

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockAddr, &key, &(mfrc522.uid));

  if (status != MFRC522::STATUS_OK)  //checkt of de statuscode iets anders dan OK is
  {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    Serial.println();
    return;
  }
}




// hetzelfde als de functie read_mode() alleen dan voor het schrijven van data in een aangegeven blok
void write_mode(byte blockAddr){
  Serial.println(F("Authenticating again using key B..."));

  status = (MFRC522::StatusCode) // updaten naar huidige status 
  mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_B, blockAddr, &key, &(mfrc522.uid));

  if (status != MFRC522::STATUS_OK)  //checkt of de statuscode iets anders dan OK is
  {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }
}




// Deze funcite is om de data van een aangegeven block uit te lezen en te printen naar de serial monitor,  logt in de Serial monitor als het uitlezen faalt en laat dan de statuscode weten
void read_block(byte blockAddr){

  Serial.print(F("Reading data from block ")); Serial.print(blockAddr);
  Serial.println(F("..."));
  Serial.println();
  

  status = (MFRC522::StatusCode)  // updaten naar huidige status
  mfrc522.MIFARE_Read(blockAddr, buffer, &size); // Uitlezen van gegeven blockAddr en de gelezen data scrijven naar de buffer variabele 

  if (status != MFRC522::STATUS_OK) //checkt of de statuscode iets anders dan OK is
  {
    Serial.print(F("MIFARE_Read() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    Serial.println();
    return;
  }

  Serial.print(F("Data in block ")); Serial.print(blockAddr); Serial.println(F(":"));
  dump_byte_array(buffer, 16); // Print de data in buffer naar de serial monitor
  Serial.println();
}




void write_block(byte blockAddr, byte data[16]) {
    
  Serial.print(F("Writing data into block ")); Serial.print(blockAddr);
  Serial.println(F(" ..."));
  dump_byte_array(data, 16); // Print de mee gegeven data naar de serial monitor
  Serial.println();

  status = (MFRC522::StatusCode) // updaten naar huidige status 
  mfrc522.MIFARE_Write(blockAddr, data, 16); // schrijft de gegeven data naar het gegeven block adres op de NFC-pas

  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }
  Serial.println();
  save_new_token();  // Slaat de nieuwe token op in de lokale opslag (EEPROM)
  set_correct_token(); // Maakt de lokaal opgeslagen token de nieuwe correcte token

}


// Genereert de key nodig om toegang te krijgen tot de data, de fabrieksstandaard is FFFFFFFFFFFF
void generate_key(){
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
}

void setup() {

  // definieren dat de pins van de led lampjes output pins zijn
  pinMode(GREEN_LED_PIN, OUTPUT); 
  pinMode(RED_LED_PIN, OUTPUT);




  Serial.begin(115200);             // Serial monitor starten zodat we output van de ESP32 kunnen lezen 
  SPI.begin();                      // SPI bus initialiseren, geen idee hoe het werkt tbh maar het is nodig om de data van de MFRC522 te kunnen lezen
  mfrc522.PCD_Init();               // De MFRC522 kaart initialiseren, deze leest van en schrijft naar het NFC-pasje 
  EEPROM.begin(EEPROM_SIZE);        // De EEPROM initialiseren, deze wordt gebruikt voor het lokaal opslaan van de token (dit is tijdelijk totdat we een server hebben)
  initWiFi();

  generate_key(); // genereert een key die nodig is om bij de data van de NFC-pas te komen
  set_correct_token(); // De huidig goede token ophalen uit de EEPROM en deze opslaan in correctToken
}


void loop() {

  // Dit checkt om te zien of er een NFC-pas voor de reader/writer zit, zo niet dan start de loop functie opnieuw
  if ( ! mfrc522.PICC_IsNewCardPresent()) return;
    
  // Checkt of de NFC-pas ze UID succesvol gelezen kan worden, zo niet dan begint loop opnieuw
  if ( ! mfrc522.PICC_ReadCardSerial()) return;
    

  read_mode(tokenBlock);    // Naar key A switchen zodat we van de pas kunnen readen
  read_block(tokenBlock);   // Het uitlezen van de token




  // Als de token geldig is dan laat die een groen lampje branden en gaat de rest van de code verder
  // als hij ongeldig is dan laat die een rood lampje branden en restart de loop functie weer
  if (validate_token(buffer, 16)) 
  { 
    Serial.println("valid token");
    digitalWrite(GREEN_LED_PIN, HIGH);
    Serial.println();
  } 
  else 
  {
    Serial.println("token invalid");
    digitalWrite(RED_LED_PIN, HIGH);
    delay(1000);
    digitalWrite(RED_LED_PIN, LOW);
    Serial.println();

    // verbreekt de verbinding met de kaart zodat er weer een nieuwe gescant kan worden
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    return;
   }


  generate_new_token(); // genereert de nieuwe token en slaat deze op in het variabele newToken
  write_mode(tokenBlock);
  write_block(tokenBlock, newToken); // Schrijft de nieuweToken naar de NFC-pas


  delay(1000); // wacht een seconde voor het lampje
  digitalWrite(GREEN_LED_PIN, LOW);

  // verbreekt de verbinding met de kaart zodat er weer een nieuwe gescant kan worden
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}