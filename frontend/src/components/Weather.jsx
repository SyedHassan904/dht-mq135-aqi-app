import React, { useState, useEffect } from 'react';
import { database, ref, get } from './firebase';
import './Weather.css';
import Aqi_icon from '../assets/air-quality.png';

// AQI Calculation Function
const concentrationToAQI = (concentration) => {
  const cLow = [0, 12, 35.4, 55.4, 150.4, 250.4, 350.4, 500, 501]; // Concentration low limits
  const cHigh = [12, 35.4, 55.4, 150.4, 250.4, 350.4, 500, 1000, 10000]; // Concentration high limits
  const aqiLow = [0, 51, 101, 151, 201, 301, 401, 501, 601]; // AQI low limits
  const aqiHigh = [50, 100, 150, 200, 300, 400, 500, 600, 600]; // AQI high limits

  let aqi = 0;

  for (let i = 0; i < cLow.length - 1; i++) {
    if (concentration >= cLow[i] && concentration < cHigh[i]) {
      aqi = aqiLow[i] + ((concentration - cLow[i]) * (aqiHigh[i] - aqiLow[i])) / (cHigh[i] - cLow[i]);
      break;
    }
  }

  return Math.round(aqi);
};

const getAqiCategory = (aqi) => {
  if (aqi <= 50) return { label: `Good 😊`, color: '#28a745' };
  if (aqi <= 100) return { label: 'Moderate 😐', color: '#ffb400' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups 😷', color: '#ff7f00' };
  if (aqi <= 200) return { label: 'Unhealthy 😫', color: '#e74c3c' };
  if (aqi <= 300) return { label: 'Very Unhealthy 🤢', color: '#c0392b' };
  if (aqi <= 600) return { label: 'Hazardous ☠️', color: '#9b59b6' };
  return { label: 'Extremely Hazardous 🚨', color: '#8e44ad' }; 
};

const Weather = () => {
  const [aqi, setAqi] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [location, setLocation] = useState('Faisalabad');

  useEffect(() => {
    const fetchConcentrationData = async () => {
      try {
        const dbRef = ref(database, 'air_quality_data/latest');
        const snapshot = await get(dbRef);
        const data = snapshot.val();

        if (data) {
          const concentration = Number(data.concentration);
          const temp = Number(data.temperature);
          const hum = Number(data.humidity);

          if (!isNaN(concentration)) {
            const aqiValue = concentrationToAQI(concentration);
            setAqi(aqiValue);
            console.log(aqiValue);
          } else {
            console.error("Invalid concentration value:", concentration);
          }

          if (!isNaN(temp)) setTemperature(temp);
          if (!isNaN(hum)) setHumidity(hum);

        }
      } catch (error) {
        console.error('Error fetching concentration data:', error);
      }
    };

    fetchConcentrationData();
    const interval = setInterval(fetchConcentrationData, 30000);

    return () => clearInterval(interval);
  }, []);

  const { label, color } = aqi !== null ? getAqiCategory(aqi) : { label: 'Loading...', color: '#000f8' };

  return (
    <div className='weather'>
      <img src={Aqi_icon} className='aqiIcon' alt="Weather Icon" />
      <p className='aqi' style={{ color: color }}> AQI {aqi !== null ? aqi : 'N/A'} </p>
      <p className='location'>{location}</p>
      <div className="weatherData">
        <div className="aqiCategory" style={{ backgroundColor: color }}>
          <h3>{label}</h3>
        </div>
        <div className="temperatureHumidity">
          <p>Temperature: {temperature !== null ? `${temperature}°C` : 'N/A'}</p>
          <p>Humidity: {humidity !== null ? `${humidity}%` : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
