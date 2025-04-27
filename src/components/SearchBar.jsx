import { useState } from 'react';
import { cities } from '../cities';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setError('');

    if (value.length > 0) {
      const matches = cities.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() === '') {
      setError('Wprowadź nazwę miasta.');
      return;
    }

    if (!cities.some((c) => c.toLowerCase() === city.toLowerCase())) {
      setError('Nie znaleziono takiego miasta.');
      return;
    }

    onSearch(city);
    setCity('');
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
    setError('');
    // Jeśli chcesz od razu wyszukać po kliknięciu:
    // onSearch(suggestion);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Wyszukiwanie lokalizacji..."
          value={city}
          onChange={handleInputChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </form>

      {error && <div className="search-error">{error}</div>}

      {/* Lista sugestii tylko gdy są dopasowania */}
      {suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="search-suggestion-item"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* Komunikat „Brak wyników” tylko, gdy coś wpisano, ale nie ma dopasowań */}
      {city &&
        suggestions.length === 0 &&
        !cities.some((c) => c.toLowerCase() === city.toLowerCase()) && (
          <div className="search-no-results">Brak wyników</div>
        )}
    </div>
  );
}

export default SearchBar;
