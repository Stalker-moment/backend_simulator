#include <PZEM004Tv30.h>
#include <WiFiManager.h>  // Library untuk WiFiManager
#define RXD2 16
#define TXD2 17

// Inisialisasi PZEM004Tv30 dengan parameter yang benar
PZEM004Tv30 pzem_r(Serial2, RXD2, TXD2);

float vr;
float ir;
float freq;
float pf_r;
float energy;
float power;

WiFiManager wm;

// Konfigurasi nama AP dan password sebagai variabel global
const char* apName = "CNC_LASER";         // Nama AP
const char* apPassword = "CNC_LASER123";  // Password AP

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);

  handler_wifi();
  
  // Jika berhasil terhubung, print alamat IP
  Serial.println("Connected to WiFi!");
  Serial.println("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  handler_wifi();
  baca_pzem();
  Serial.print("Volt: ");
  Serial.print(vr, 2);
  Serial.print(" V, ");
  Serial.print("Curr: ");
  Serial.print(ir, 3);
  Serial.print(" A, ");
  Serial.print("PF: ");
  Serial.print(pf_r, 2);
  Serial.println(" %, ");
  Serial.print("Power: ");
  Serial.print(power);
  Serial.print(" W, ");
  Serial.print("Energy: ");
  Serial.print(energy, 3);
  Serial.print(" kWh, ");
  Serial.print("Freq: ");
  Serial.print(freq, 1);
  Serial.println(" Hz");
  Serial.println();
  delay(2000);
}

void handler_wifi() {
  // Mulai WiFiManager dalam mode konfigurasi
  wm.autoConnect(apName, apPassword);
}

void baca_pzem() {
  vr = pzem_r.voltage();
  ir = pzem_r.current();
  freq = pzem_r.frequency();
  pf_r = pzem_r.pf();
  power = pzem_r.power();
  energy = pzem_r.energy();
}