import React from 'react';

const WeatherForecast = ({ forecast }) => {
  const daysOfWeek = ['pn', 'wt', 'śr', 'czw', 'pt', 'sb', 'nd'];

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const day = daysOfWeek[dayIndex];
    const formattedDate = `${date.getDate()} ${date.toLocaleDateString('pl-PL', { month: 'short' })}`;
    return { day, formattedDate };
  };

  const nextThreeDays = forecast.length >= 4 ? forecast.slice(1, 4) : [];

  return (
    <div className="weather-forecast-container w-full bg-gradient-to-r from-blue-200 to-blue-200 rounded-lg p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {nextThreeDays.map((day, index) => {
          const iconCode = day.weather[0].icon;
          const { day: dayOfWeek, formattedDate } = formatDate(day.dt);
          const temperature = Math.round(day.temp.day);

          return (
            <div
              key={index}
              className="weather-item flex flex-col items-center text-center"
            >
              <img
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-3"
                src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
                alt={day.weather[0].description}
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
