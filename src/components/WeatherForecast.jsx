import React from 'react';

const WeatherForecast = ({ forecast }) => {
  // Tablica skrótów dni tygodnia w języku polskim
  const daysOfWeek = ['pn', 'wt', 'śr', 'czw', 'pt', 'sb', 'nd'];

  // Funkcja do formatowania daty
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Dostosowanie do indeksu tablicy (0 = nd)
    const day = daysOfWeek[dayIndex];
    const formattedDate = `${date.getDate()} ${date.toLocaleDateString('pl-PL', { month: 'short' })}`;
    return { day, formattedDate };
  };

  return (
    <div className="weather-forecast-container w-100 bg-gradient-to-r from-blue-200 to-blue-200 rounded-lg p-5">
      <div className="flex justify-center space-x-24">
        {forecast.map((day, index) => {
          const iconCode = day.weather[0].icon;
          const { day: dayOfWeek, formattedDate } = formatDate(day.dt);
          const temperature = Math.round(day.temp.day);

          return (
            <div
              key={index}
              className="weather-item flex flex-col items-center"
            >
              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
                alt={day.weather[0].description}
                style={{
                  width: '200px',
                  height: '200px',
                  marginBottom: '12px',
                }}
              />
              <div className="text-gray-800 text-base font-medium">{dayOfWeek}</div>
              <div className="text-gray-600 text-sm">{formattedDate}</div>
              <div className="text-gray-800 text-xl font-semibold mt-2">{temperature}°C</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;