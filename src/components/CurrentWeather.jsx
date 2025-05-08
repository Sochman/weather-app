import React from 'react';
import './CurrentWeather.css';

const CurrentWeather = ({ current, city }) => {
  if (!current) return null;

// Wyodrębnienie potrzebnych danych z obiektu bieżącej pogody
  const temperature = Math.round(current.temp);
  const description = current.weather?.[0]?.description || '';
  const iconCode = current.weather?.[0]?.icon || '';

// Konwersja prędkości wiatru z m/s na km/h
  const windSpeed = Math.round(current.wind_speed * 3.6); 
  const pressure = current.pressure;
  const humidity = current.humidity;
// URl do ikony pogoowej 
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@4x.png` : '';

  return (
    <div className="current-weather">
      {/* Ikona pogody */}
      {iconUrl && (
        <div className="current-weather__icon">
          <img src={iconUrl} alt={description} />
        </div>
      )}

      {/* Informacje pogodowe */}
      <div className="current-weather__info">
        {city && <h3 className="current-weather__city">{city}</h3>}
        <p>Temperatura: {temperature}°C</p>
        {description && <p>Pogoda: {description.charAt(0).toUpperCase() + description.slice(1)}</p>}
        <p>Wiatr: {windSpeed} km/h</p>
        <p>Ciśnienie: {pressure} hPa</p>
        <p>Wilgotność: {humidity}%</p>
      </div>
    </div>
  );
};

export default CurrentWeather;
