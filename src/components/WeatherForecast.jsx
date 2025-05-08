import React from 'react';
import './WeatherForecast.css';

// Komponent odpowiedzialny za wyświetlenie 3-dniowej prognozy pogody (od jutra)
const WeatherForecast = ({ forecast }) => {
  // Skróty nazw dni tygodnia w języku polskim (poniedziałek = 0)
  const daysOfWeek = ['pn', 'wt', 'śr', 'czw', 'pt', 'sb', 'nd'];

  // Funkcja pomocnicza do formatowania daty (timestamp z API)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const day = daysOfWeek[dayIndex];
    const formattedDate = `${date.getDate()} ${date.toLocaleDateString('pl-PL', { month: 'short' })}`;
    return { day, formattedDate };
  };

  // Sprawdzenie, czy forecast zawiera wystarczającą liczbę dni
  const nextThreeDays = forecast.length >= 4 ? forecast.slice(1, 4) : [];

  return (
    <div className="weather-forecast-container">
      <div className="weather-forecast-list">
        {nextThreeDays.map((day, index) => {
          const iconCode = day.weather[0].icon;
          const { day: dayOfWeek, formattedDate } = formatDate(day.dt);
          const temperature = Math.round(day.temp.day);

          return (
            <div key={index} className="weather-item">
              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
                alt={day.weather[0].description}
              />
              <div className="forecast-day">{dayOfWeek}</div>
              <div className="forecast-date">{formattedDate}</div>
              <div className="forecast-temp">{temperature}°C</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
