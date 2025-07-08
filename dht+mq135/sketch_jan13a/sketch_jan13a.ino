#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <DHT.h>

#define DHTPIN D1         // Pin where DHT11 is connected
#define DHTTYPE DHT11     // DHT11 sensor type

const char* ssid = "Redmi A1+";
const char* password = "syedhassan";

#define FIREBASE_HOST "write Your FIREBASE_HOST"
#define FIREBASE_AUTH "write your FIREBASE_AUTH"

FirebaseConfig config;
FirebaseAuth auth;
FirebaseData firebaseData;

const int sensorPin = A0; 
const float calibrationFactor = 200.0; 

DHT dht(DHTPIN, DHTTYPE);

void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi connected");
}

float readMQ135() {
  long sensorValue = 0;
  for (int i = 0; i < 500; i++) {
    sensorValue += analogRead(sensorPin);  
  }
  sensorValue /= 500; 

  float sensorVoltage = sensorValue * (5.0 / 1023.0);  
  return sensorVoltage;
}

float voltageToConcentration(float voltage) {
  float concentration = voltage * calibrationFactor;
  return concentration;
}

void setup() {
  Serial.begin(57600);
  connectWiFi();

  // Enable internal pull-up resistor for the DHT11
  pinMode(DHTPIN, INPUT_PULLUP);
  
  dht.begin();  // Initialize DHT sensor
  
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("Firebase initialized");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Read MQ135 data
    float sensorVoltage = readMQ135();
    float concentration = voltageToConcentration(sensorVoltage);
    int concentrationInt = static_cast<int>(concentration); 

    // Read DHT11 data
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Failed to read from DHT sensor!");
    } else {
      Serial.print("Temperature: ");
      Serial.println(temperature);
      Serial.print("Humidity: ");
      Serial.println(humidity);
    }

    // Prepare JSON to send to Firebase
    FirebaseJson json;
    json.set("concentration", concentrationInt);
    json.set("temperature", temperature);
    json.set("humidity", humidity);

    String path = "/air_quality_data/latest"; 
    if (Firebase.setJSON(firebaseData, path, json)) {  
      Serial.println("Data successfully sent to Firebase");
    } else {
      Serial.println("Error sending data to Firebase: " + firebaseData.errorReason());
    }
  } else {
    Serial.println("WiFi not connected");
  }

  delay(30000); // Send data every 30 seconds
}
