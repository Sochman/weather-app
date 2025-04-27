import SearchBar from './components/SearchBar';

function App() {
  const handleSearch = (city) => {
    console.log('Wyszukano miasto:', city);
    // Tu będzie później integracja z OpenWeatherMap API
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', margin: '20px' }}>Weather App</h1>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}

export default App;
