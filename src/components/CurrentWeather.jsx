import React from 'react';

const CurrentWeather = ({ current, city }) => {
  if (!current) return null;
  
  // Wyodrębnienie potrzebnych danych z obiektu bieżącej pogody
  const temperature = Math.round(current.temp);
  const description = current.weather && current.weather[0] ? current.weather[0].description : '';
  const iconCode = current.weather && current.weather[0] ? current.weather[0].icon : '';
  const windSpeed = current.wind_speed;
  
  // Konwersja prędkości wiatru z m/s na km/h
  const windSpeedKmh = Math.round(windSpeed * 3.6);
  const pressure = current.pressure;
  const humidity = current.humidity;
  
  // URL do ikony pogodowej
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@4x.png` : '';
  
  return (
    <div className="flex items-center justify-center space-x-8 p-8 rounded-xl bg-white/70 shadow-md mx-4 backdrop-blur-sm">
      {/* Ikona pogody */}
      {iconUrl && (
        <img 
          src={iconUrl} 
          alt={description} 
          style={{ width: '200px', height: '200px' }} 
        />
      )}
      {/* Karta z danymi bieżącej pogody */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {city && <h3 className="text-center text-xl font-semibold mb-2">{city}</h3>}
        <p>Temperatura: {temperature}°C</p>
        {description && <p>Pogoda: {description.charAt(0).toUpperCase() + description.slice(1)}</p>}
        <p>Wiatr: {windSpeedKmh} km/h</p>
        <p>Ciśnienie: {pressure} hPa</p>
        <p>Wilgotność: {humidity}%</p>
      </div>
    </div>
  );
};

export default CurrentWeather;
