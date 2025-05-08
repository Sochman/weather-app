import { useState } from 'react';
import { cities } from '../cities'; // Import listy miast
import './SearchBar.css'; // Import stylów dla SearchBar

// Komponent SearchBar: umożliwia użytkownikowi wyszukiwanie miast
function SearchBar({ onSearch }) {
  const [city, setCity] = useState(''); // Aktualnie wpisana nazwa miasta
  const [suggestions, setSuggestions] = useState([]); // Lista sugerowanych miast na podstawie wpisu
  const [error, setError] = useState(''); // Wiadomość o błędzie (np. puste pole lub nieprawidłowe miasto)

  // Funkcja obsługująca zmianę wartości inputa (wpisywanie miasta)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setError(''); // Reset błędu po kazdej zmianie

    if (value.length > 0) {
      // Filtruj miasta, które zaczynają się od wpisanych liter
      const matches = cities.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      // Jeśli input jest pusty - czyścimy sugestię 
      setSuggestions([]);
    }
  };

 // Funkcja obsługująca kliknięcie "Szukaj" lub naciśnięcie Enter
  const handleSubmit = (e) => {
    e.preventDefault();  // Blokowanie domyślnego odświerzania strony
    if (city.trim() === '') {
      setError('Wprowadź nazwę miasta.');
      return;
    }

    if (!cities.some((c) => c.toLowerCase() === city.toLowerCase())) {
      setError('Nie znaleziono takiego miasta.');
      return;
    }
    onSearch(city); // Przekazanie poprawnego miasta do App.jsx
    setCity(''); // Wyczyszczenie inputa
    setSuggestions([]); // Wyczyszczenie sugestii
   
  };
   // Funkcja obsługująca kliknięcie na sugestię miasta
  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion); // Ustawienie klikniętego miasta w polu input
    setSuggestions([]); // Wyczyszczenie listy sugestii
    setError(''); // Reset błędu
    // Jeśli chcemy od razu wyszukać po kliknięciu:
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