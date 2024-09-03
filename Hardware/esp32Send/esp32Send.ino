//DIBUAT OLEH TIER SINYO
//IG : @Tierkunn_
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Arduino.h>

//Deklerasi Pin Relay
#define R1 14  //R1 Pin
#define R2 26  //R2 Pin
#define R3 13  //R3 Pin
#define R4 12  //R4 Pin

#define PinV1 35
#define PinV2 34
#define PinV3 32
#define PinV4 27
#define PinV5 33

const char* ssid = "AKTI-GUEST";    // Ganti dengan SSID WiFi Anda
const char* password = "guest@123";  // Ganti dengan password WiFi Anda

bool R1_Value = false;
bool R2_Value = false;
bool R3_Value = false;
bool R4_Value = false;

String base_url = "curex.akti.cloud";
String APIHealth = "true";

unsigned long previousMillisPLC = 0;  // Variable to store the last time getSerial() was called
const long intervalPLC = 1000;        // Interval at which to run getSerial() (in milliseconds)

float voltage1;  //real value
float voltage2;  //real value
float voltage3;  //real value
float voltage4;  //real value
float voltage5;  //real value

#define REF_VOLTAGE 4.0
#define ADC_RESOLUTION 4096.0
#define R1_Values 30000.0  // resistor values in voltage sensor (in ohms)
#define R2_Values 7500.0   // resistor values in voltage sensor (in ohms)

float offset = 00.0;

void setup() {
  Serial.begin(9600);

  //Pinmode relay
  pinMode(R1, OUTPUT);
  pinMode(R2, OUTPUT);
  pinMode(R3, OUTPUT);
  pinMode(R4, OUTPUT);

  //Set OFF saat starting
  digitalWrite(R1, HIGH);
  digitalWrite(R2, HIGH);
  digitalWrite(R3, HIGH);
  digitalWrite(R4, HIGH);
  //Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
}

void loop() {
  connectionHandler();
  relayController();
  // Check if it's time to run getSerial
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillisPLC >= intervalPLC) {
    previousMillisPLC = currentMillis;
    getSensor();
  }
}

void connectionHandler() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Disconnected. Reconnecting...");
    WiFi.disconnect();
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.println("Reconnecting to WiFi...");
    }
    Serial.println("Reconnected to WiFi");
  }
}

void relayController() {
  getRelayInfo();
  if (R1_Value == true) {
    digitalWrite(R1, LOW);
    //callbackAuto();
  } else {
    digitalWrite(R1, HIGH);
  }

  if (R2_Value == true) {
    digitalWrite(R2, LOW);
    //callbackFaultReset();
  } else {
    digitalWrite(R2, HIGH);
  }

  if (R3_Value == true) {
    digitalWrite(R3, LOW);
    //callbackMasterOn();
  } else {
    digitalWrite(R3, HIGH);
  }

  if (R4_Value == true) {
    digitalWrite(R4, LOW);
    //callbackMasterOn();
  } else {
    digitalWrite(R4, HIGH);
  }
}

void getRelayInfo() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = "http://" + base_url + "/api/internal/relay";

    Serial.print("Sending HTTP GET request to: ");
    Serial.println(url);

    http.begin(url);

    int httpCode = http.GET();
    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        Serial.println("Response payload:");
        Serial.println(payload);

        DynamicJsonDocument doc(1024);
        deserializeJson(doc, payload);
        R1_Value = doc["relay"]["relay1"].as<bool>();
        R2_Value = doc["relay"]["relay2"].as<bool>();
        R3_Value = doc["relay"]["relay3"].as<bool>();
        R4_Value = doc["relay"]["relay4"].as<bool>();

        APIHealth = "Yes";
      } else {
        Serial.print("HTTP request failed with error code: ");
        Serial.println(httpCode);
        APIHealth = "No";
      }
    } else {
      Serial.print("HTTP request failed with error code: ");
      Serial.println(httpCode);
      APIHealth = "No";
    }

    http.end();
  }
}

void getSensor() {
  int adc_value = analogRead(PinV1);
  float voltage_adc = ((float)adc_value * REF_VOLTAGE) / ADC_RESOLUTION;
  float voltage_in = voltage_adc * (R1_Values + R2_Values) / R2_Values;
  Serial.print("Measured Voltage 1 = ");
  Serial.println(voltage_in, 2);
  voltage1 = voltage_in;

  //================================================================
  int adc_value2 = analogRead(PinV2);
  float voltage_adc2 = ((float)adc_value2 * REF_VOLTAGE) / ADC_RESOLUTION;
  float voltage_in2 = voltage_adc2 * (R1_Values + R2_Values) / R2_Values;
  Serial.print("Measured Voltage 2 = ");
  Serial.println(voltage_in2, 2);
  voltage2 = voltage_in2;

  //================================================================
  int adc_value3 = analogRead(PinV3);
  float voltage_adc3 = ((float)adc_value3 * REF_VOLTAGE) / ADC_RESOLUTION;
  float voltage_in3 = voltage_adc3 * (R1_Values + R2_Values) / R2_Values;
  Serial.print("Measured Voltage 3 = ");
  Serial.println(voltage_in3, 2);
  voltage3 = voltage_in3;

  //================================================================
  int adc_value4 = analogRead(PinV4);
  float voltage_adc4 = ((float)adc_value4 * REF_VOLTAGE) / ADC_RESOLUTION;
  float voltage_in4 = voltage_adc4 * (R1_Values + R2_Values) / R2_Values;
  Serial.print("Measured Voltage 4 = ");
  Serial.println(voltage_in4, 2);
  voltage4 = voltage_in4;

  //================================================================
  int adc_value5 = analogRead(PinV5);
  float voltage_adc5 = ((float)adc_value5 * REF_VOLTAGE) / ADC_RESOLUTION;
  float voltage_in5 = voltage_adc5 * (R1_Values + R2_Values) / R2_Values;
  Serial.print("Measured Voltage 5 = ");
  Serial.println(voltage_in5, 2);
  voltage5 = voltage_in5;

  delay(500);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = "http://" + base_url + "/api/internal/sensor/" + String(voltage1) + "/" + String(voltage2) + "/" + String(voltage3) + "/" + String(voltage4) + "/" + String(voltage5);

    Serial.print("Sending HTTP GET request to: ");
    Serial.println(url);

    http.begin(url);

    int httpCode = http.GET();
    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        Serial.println("Response payload:");
        Serial.println(payload);

        DynamicJsonDocument doc(1024);
        deserializeJson(doc, payload);

        APIHealth = "Yes";
      } else {
        Serial.print("HTTP request failed with error code: ");
        Serial.println(httpCode);
        APIHealth = "No";
      }
    } else {
      Serial.print("HTTP request failed with error code: ");
      Serial.println(httpCode);
      APIHealth = "No";
    }

    http.end();
  }
}