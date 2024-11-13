#include <SPI.h>
#include <MFRC522.h>
#include <EEPROM.h>
#include <WiFi.h>

#define RST_PIN         22
#define SS_PIN          5
#define GREEN_LED_PIN   2
#define RED_LED_PIN     4
#define EEPROM_SIZE 16


MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.
MFRC522::MIFARE_Key key;

byte newToken[16];
byte correctToken[16];
byte buffer[18];

const char* ssid = "WiFi";
const char* password = "password";



void setup() {
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);

  Serial.begin(115200); // Initialize serial communications with the PC
  while (!Serial);    // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
  delay(2000);
  SPI.begin();        // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522 card
  EEPROM.begin(EEPROM_SIZE);

  // Prepare the key (used both as key A and as key B)
  // using FFFFFFFFFFFFh which is the default at chip delivery from the factory
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
  set_correct_token();
  initWiFi();
}


void loop() {
  

  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if ( ! mfrc522.PICC_IsNewCardPresent())
    return;

    

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial())
    return;

  // for (int i = 0; i < 16; i++) {
  //   Serial.print(correctToken[i], HEX);
  //   Serial.print(" ");
  // } 
  // Serial.println();

  byte blockAddr = 4;
  MFRC522::StatusCode status;
  byte size = sizeof(buffer);
  byte trailerBlock = 5;

  // Authenticate using key A
  Serial.println(F("Authenticating using key A..."));
  status = (MFRC522::StatusCode) mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, trailerBlock, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  Serial.print(F("Reading data from block ")); Serial.print(blockAddr);
  Serial.println(F(" ..."));
  status = (MFRC522::StatusCode) mfrc522.MIFARE_Read(blockAddr, buffer, &size);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Read() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }
  Serial.print(F("Data in block ")); Serial.print(blockAddr); Serial.println(F(":"));
  dump_byte_array(buffer, 16); Serial.println();
  Serial.println();

  
  if (!check_uid()) {
    Serial.println("access denied");
    digitalWrite(RED_LED_PIN, HIGH);
    delay(1000);
    digitalWrite(RED_LED_PIN, LOW);
    Serial.println();

    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    return;
  } else {
    Serial.println("access granted");
    digitalWrite(GREEN_LED_PIN, HIGH);
    Serial.println();
  }

  generate_new_token();

  Serial.println(F("Authenticating again using key B..."));
  status = (MFRC522::StatusCode) mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_B, trailerBlock, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  Serial.print(F("Writing data into block ")); Serial.print(blockAddr);
  Serial.println(F(" ..."));
  dump_byte_array(newToken, 16); Serial.println();
  status = (MFRC522::StatusCode) mfrc522.MIFARE_Write(blockAddr, newToken, 16);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
  } else {
  Serial.println();
  save_new_token();  
  set_correct_token();
  delay(1000);
  }



  digitalWrite(GREEN_LED_PIN, LOW);

  // Halt PICC
  mfrc522.PICC_HaltA();
  // Stop encryption on PCD
  mfrc522.PCD_StopCrypto1();
}


void dump_byte_array(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
  Serial.println();
}


bool check_uid() {
  bool checked = true;
  for(int i = 0; i < sizeof(correctToken); i++){
    if(buffer[i] != correctToken[i])
    {
      checked = false;
    }
  }
  return checked;
}


void generate_new_token(){
  for (int i = 0; i < 16; i++){
    newToken[i] = random(0, 255);
  }
}


void save_new_token() {
  for(int i = 0; i < 16; i++){
    EEPROM.write(i, newToken[i]);
  }
}


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