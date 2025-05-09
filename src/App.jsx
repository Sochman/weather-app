
import { useState } from 'react';
import SearchBar from './components/SearchBar';  // Komponent wyszukiwarki miast
import WeatherForecast from './components/WeatherForecast';  // Komponent prognozy pogody
import CurrentWeather from './components/CurrentWeather';    // Komponent bieżącej pogody
import './App.css'; // Globalne style (Tailwind CSS i podstawowe ustawienia)

/** Klucz API OpenWeatherMap */
const API_KEY = '4d4797b18cd0225f3d49762b87f7a913';

/** Lokalny cache zapamiętujący współrzędne już wyszukanych miast (aby ograniczyć zapytania) */
const cityCache = {};

/** Funkcja sanitizująca nazwę miasta (usuwa niedozwolone znaki) */
const sanitizeCityName = (name) => {
  return name.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ \-]/g, '').trim();
};

function App() {
  // Stany aplikacji
  const [weatherData, setWeatherData] = useState(null); // dane pogodowe (aktualne + prognoza)
  const [cityName, setCityName] = useState(''); // aktualnie wybrana lokalizacja (nazwa miasta)
  const [error, setError] = useState(''); // komunikat błędu (jeśli wystąpi)


  // Funkcja pobierająca współrzędne (lat, lon) na podstawie nazwy miasta (OpenWeather Geocoding API)
  const fetchCoordinates = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&country=PL&appid=${API_KEY}`
      );
      if (!response.ok) {
        if (response.status === 401) throw new Error('Problem z autoryzacją API.');
        if (response.status === 429) throw new Error('Przekroczono limit zapytań API.');
        throw new Error('Błąd pobierania współrzędnych.');
      }
      const data = await response.json();
      if (data.length === 0 || data[0].country !== 'PL') {
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
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&lang=pl&appid=${API_KEY}`
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

  // Obsługa wyszukiwania miasta (po kliknięciu "Szukaj" w SearchBar)
  const handleSearch = async (city) => {
    setError('');           // reset poprzedniego błędu
    setWeatherData(null);   // wyczyszczenie poprzednich danych pogodowych
    try {
      console.log(`Szukam miasta: ${city}`);
      const safeCity = sanitizeCityName(city); 
      let lat, lon; // oczyszczona nazwa miasta
      // Sprawdzenie cache – jeśli to miasto było już wyszukiwane, użyj zapamiętanych współrzędnych
      if (cityCache[safeCity]) {
        console.log('Miasto znalezione w cache.');
        ({ lat, lon } = cityCache[safeCity]);
      } else {
        const coords = await fetchCoordinates(safeCity);
        lat = coords.lat;
        lon = coords.lon;
        cityCache[safeCity] = { lat, lon };
        console.log('Miasto zapisane do cache.');
      }
      console.log(`Współrzędne dla "${safeCity}": lat=${lat}, lon=${lon}`);
      const weather = await fetchWeatherData(lat, lon);
      console.log('Otrzymane dane pogodowe:', weather);
      setWeatherData(weather);
      setCityName(safeCity);
    } catch (err) {
      console.error('Błąd:', err.message);
      setError(err.message);  // zapisanie komunikatu błędu do stanu
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">Weather App</h1>
        <SearchBar onSearch={handleSearch} />
      </header>

      {error && <div className="error-message">{error}</div>}

      {weatherData && (
        <main className="main">
          <section className="section">
            <h2 className="section__title">Aktualna pogoda</h2>
            <CurrentWeather current={weatherData.current} city={cityName} />
          </section>

          <section className="section">
            <h2 className="section__title">Prognoza na 3 dni</h2>
            <WeatherForecast forecast={weatherData.daily} />
          </section>
        </main>
      )}

      <footer className="footer">
        <p className="footer__text">© 2025 Weather App</p>
      </footer>
    </div>
  );
}

export default App;