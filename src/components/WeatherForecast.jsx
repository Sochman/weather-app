import React from 'react';

// Komponent odpowiedzialny za wyświetlenie 3-dniowej prognozy pogody (od jutra)
const WeatherForecast = ({ forecast }) => {
  // Skróty nazw dni tygodnia w języku polskim (poniedziałek = 0)
  const daysOfWeek = ['pn', 'wt', 'śr', 'czw', 'pt', 'sb', 'nd'];

  // Funkcja pomocnicza do formatowania daty (timestamp z API)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Konwersja sekund na milisekundy
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Dostosowanie indeksu (0 = niedziela)
    const day = daysOfWeek[dayIndex]; // Nazwa dnia tygodnia
    const formattedDate = `${date.getDate()} ${date.toLocaleDateString('pl-PL', { month: 'short' })}`; // Format np. "9 maj"
    return { day, formattedDate };
  };

  // Sprawdzenie, czy forecast zawiera wystarczającą liczbę dni
  const nextThreeDays = forecast.length >= 4 ? forecast.slice(1, 4) : [];

  return (
    <div className="weather-forecast-container w-100 bg-gradient-to-r from-blue-200 to-blue-200 rounded-lg p-5">
      <div className="flex justify-center space-x-24">
        {nextThreeDays.map((day, index) => {
          const iconCode = day.weather[0].icon; // Kod ikony z API (np. "01d")
          const { day: dayOfWeek, formattedDate } = formatDate(day.dt); // Sformatowane dane daty
          const temperature = Math.round(day.temp.day); // Zaokrąglona temperatura dzienna

          return (
            <div
              key={index}
              className="weather-item flex flex-col items-center"
            >
              {/* Ikona pogody pobrana z serwisu OpenWeatherMap */}
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
              {/* Dzień tygodnia (np. "pt") */}
              <div className="text-gray-800 text-base font-medium">{dayOfWeek}</div>
              {/* Data (np. "9 maj") */}
              <div className="text-gray-600 text-sm">{formattedDate}</div>
              {/* Temperatura w °C */}
              <div className="text-gray-800 text-xl font-semibold mt-2">{temperature}°C</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
