import { useState } from 'react';
import SearchBar from './components/SearchBar'; // Komponent SearchBar
import WeatherForecast from './components/WeatherForecast'; // Nowy komponent
import './App.css'; // Globalne Style 

// Klucz API z OpenWeather!
const API_KEY = '4d4797b18cd0225f3d49762b87f7a913'; 

// Lokalny cache na zapisane miasta i ich współrzędne
const cityCache = {}; 

// Funkcja oczyszczająca input miasta (zabezpieczenie przed dziwnymi znakami)
const sanitizeCityName = (name) => {
  return name.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ \-]/g, '').trim();
};

function App() {
  // Stan na dane pogodowe i błędy
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  // Funkcja pobierająca współrzędne (lat, lon) na podstawie nazwy miasta
  const fetchCoordinates = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      );
      if (!response.ok) {
        if (response.status === 401) throw new Error('Problem z autoryzacją API.');
        if (response.status === 429) throw new Error('Przekroczono limit zapytań API.');
        throw new Error('Błąd pobierania współrzędnych.');
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('Nie znaleziono takiego miasta.');
      }
      return { lat: data[0].lat, lon: data[0].lon };
    } catch (err) {
      throw err;
    }
  };

  // Funkcja pobierająca dane pogodowe (One Call API) na podstawie współrzędnych
  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
      );
      if (!response.ok) {
        if (response.status === 401) throw new Error('Problem z autoryzacją API.');
        if (response.status === 429) throw new Error('Przekroczono limit zapytań API.');
        throw new Error('Błąd pobierania danych pogodowych.');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Funkcja obsługująca kliknięcie "Szukaj" w SearchBar
  const handleSearch = async (city) => {
    setError('');  // czyszczenie poprzednich błędów
    setWeatherData(null); // czyszczenie poprzednich danych pogodowych
    try {
      console.log(`Szukam miasta: ${city}`);

      let lat, lon;
      // Caching współrzędnych miast - oszczędzanie API 
      if (cityCache[city]) {
        console.log('Miasto znalezione w cache.');
        ({ lat, lon } = cityCache[city]);
      } else {
        const safeCity = sanitizeCityName(city);
        const coords = await fetchCoordinates(city);
        lat = coords.lat;
        lon = coords.lon;
        cityCache[city] = { lat, lon };
        console.log('Miasto zapisane do cache.');
      }

      console.log(`Współrzędne dla ${city}: lat=${lat}, lon=${lon}`);
      const weather = await fetchWeatherData(lat, lon);
      console.log('Otrzymane dane pogodowe:', weather);
      setWeatherData(weather);  // Zapisanie danych do stanu React
    } catch (err) {
      console.error('Błąd:', err.message);
      setError(err.message);  // Zapisanie błędu do stanu
    }
  };

  return (
    <div className="App">
      {/* Górny pasek - SearchBar */}
      <div className="bg-blue-500 p-4">
        <h1 className="text-white text-2xl font-bold text-center">Weather App</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Wyświetlanie błędu */}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        {/* Wyświetlanie danych pogodowych */}
        {weatherData && (
        <div style={{ marginTop: '20px', textAlign: 'left', maxWidth: '', margin: '20px auto' }}>
          <h2>Aktualna pogoda:</h2>
          <pre>{JSON.stringify(weatherData.current, null, 2)}</pre>

           {/* Sekcja 3-dniowej Prognozy */}
           <div className="mt-8">
            <h2 className="text-xl font-semibold text-center mb-4">Prognoza na 3 dni</h2>
            <WeatherForecast forecast={weatherData.daily.slice(0, 3)} />
          </div>
        </div>
     )}

      {/* Dolny pasek */}
      <div className="bg-blue-500 p-4 mt-8">
        <p className="text-white text-center">© 2025 Weather App</p>
      </div>
    </div>
  );
}

export default App;
