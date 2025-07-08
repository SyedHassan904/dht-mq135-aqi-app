# Air Quality Monitoring System 🌫️🌡️

This project is a real-time Air Quality Monitoring System using the **ESP8266 (NodeMCU)**, **MQ135 gas sensor**, and **DHT11 temperature & humidity sensor**. Data is pushed to **Firebase Realtime Database**, and displayed on a **React-based web dashboard** with AQI (Air Quality Index) interpretation.

---

## 📦 Features

- 🔥 Firebase integration for real-time cloud storage
- 🌡️ Temperature and humidity monitoring via DHT11
- 🧪 Gas concentration monitoring using MQ135
- 🌐 WiFi (ESP8266) based data transmission
- 🖥️ React frontend to display:
  - Air Quality Index (AQI)
  - Temperature (°C)
  - Humidity (%)
  - AQI category with color-coded feedback

---

## 🧰 Hardware Used

- ESP8266 NodeMCU
- MQ135 Gas Sensor
- DHT11 Temperature and Humidity Sensor
- Jumper wires
- Breadboard

---

## ⚙️ Arduino Setup

### 🔌 Libraries Required

Install the following libraries in the Arduino IDE:

- `ESP8266WiFi`
- `FirebaseESP8266` (by Mobizt)
- `DHT sensor library` (by Adafruit)
- `Adafruit Unified Sensor`

### 🧾 Arduino Code Configuration

```cpp
#define FIREBASE_HOST "your-project-id.firebaseio.com"
#define FIREBASE_AUTH "your-firebase-database-secret"
Replace with your Firebase Realtime Database credentials.

---

Example JSON:
Always show details
{
  "concentration": 125,
  "temperature": 28.4,
  "humidity": 62
}
---
🧑‍💻 React Frontend

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "xxxxxx",
  appId: "1:xxxx:web:xxxx"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
---


📊 AQI Conversion Logic
AQI is calculated using EPA standards:


const concentrationToAQI = (concentration) => {
  // Maps gas concentration to AQI using breakpoint tables
};
AQI Categories
AQI Range	Description	Emoji	Color
0–50	Good	😊	Green
51–100	Moderate	😐	Yellow
101–150	Unhealthy for Sensitive Groups	😷	Orange
151–200	Unhealthy	😫	Red
201–300	Very Unhealthy	🤢	Dark Red
301–600	Hazardous	☠️	Purple
601+	Extremely Hazardous	🚨	Violet
---

🔁 Data Refresh Rate
ESP8266 sends data every 30 seconds
React app fetches latest data every 30 seconds

---

🚀 Getting Started
Flash the ESP8266 using Arduino IDE
Run the React app:
npm install
npm run dev
View real-time AQI at http://localhost:5173
---

📌 License
This project is open-source and free to use for educational purposes.

---
👨‍💻 Developed By
Syed Hassan