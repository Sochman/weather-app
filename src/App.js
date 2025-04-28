import { useState } from 'react';
import SearchBar from './components/SearchBar'; //Komponent SearchBar
import './App.css'; // Globalne Style 

// Klucz API z OpenWeather!
const API_KEY = 'Klucz Api'; 

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
      // Caching współrzędnych miast - oszczedzanie Api 
      if (cityCache[city]){
        console.log('Miasto znalezione w cache.');
        ({lat, lon} = cityCache[city]);
      }else{
        const safeCity = sanitizeCityName(city)
        const coords = await fetchCoordinates(city);
        lat = coords.lat;
        lon = coords.lon;
        cityCache[city] = {lat, lon};
        console.log("Miasto zapisane do cache.");
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
    <div className="App" style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ textAlign: 'center', margin: '20px' }}>Weather App</h1>
      <SearchBar onSearch={handleSearch} />
      
       {/* Wyświetlanie błędu */}
      {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}

      {/* Wyświetlanie danych pogodowych */}
      {weatherData && (
        <div style={{ marginTop: '20px', textAlign: 'left', maxWidth: '600px', margin: '20px auto' }}>
          <h2>Aktualna pogoda:</h2>
          <pre>{JSON.stringify(weatherData.current, null, 2)}</pre>

          <h2>Prognoza na 3 dni:</h2>
          <pre>{JSON.stringify(weatherData.daily.slice(0, 3), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
