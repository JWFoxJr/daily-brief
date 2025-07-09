import { useState, useEffect } from 'react';

function Weather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(() => localStorage.getItem('fallbackCity') || '');
  const [input, setInput] = useState('');
  const [unit, setUnit] = useState('F'); // F or C
  const apiKey = '<YOUR API KEY>';
  
  // Generic fetch logic
  function fetchWeather(url) {
    const cacheKey = url;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = (Date.now() - timestamp) / 1000;
      if (age < 600) { // less than 10 minutes old
        setWeather({ ...data, timestamp }); // ✅ Set timestamp in state
        return;
      }
    }
    fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod === 200) {
        const parsedData = {
          temp: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          location: data.name,
          wind: data.wind.speed,
          humidity: data.main.humidity,
          timestamp: Date.now() // ✅ Add timestamp to display later
        };
        localStorage.setItem(cacheKey, JSON.stringify({
          data: parsedData,
          timestamp: Date.now()
        }));
        setWeather(parsedData); // ✅ Fix was here
      } else {
        setWeather({ error: 'Location not found.' });
      }
    })
    .catch(() => setWeather({ error: 'Failed to fetch weather data' }));
  }
  
  // Fetch weather by lat/lon
  function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    fetchWeather(url);
  }
  
  // Fetch weather by city name
  function fetchWeatherByCity(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    fetchWeather(url);
  }
  
  function convertTemp(temp) {
    return unit === 'F' ? `${temp}°F` : `${((temp - 32) * 5 / 9).toFixed(1)}°C`;
  }
  
  function formatTime(ms) {
    const date = new Date(ms);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  function initLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          if (city) fetchWeatherByCity(city);
          else setWeather({ error: 'Location unavailable. Please enter your city.' });
        }
      );
    } else {
      if (city) fetchWeatherByCity(city);
      else setWeather({ error: 'Geolocation not supported.' });
    }
  }
  
  useEffect(() => {
    initLocation();
  }, [city]); // Now safe and clean
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
          },
          () => {
            if (city) fetchWeatherByCity(city);
          }
        );
      }
    }, 10 * 60 * 1000); // ✅ 10 minutes
    
    return () => clearInterval(interval); // Clean up
  }, [city]);
  
  // Handle city input submit
  function handleCitySubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    localStorage.setItem('fallbackCity', input.trim());
    setCity(input.trim());
    fetchWeatherByCity(input.trim());
    setInput('');
  }
  
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
        <span>🌦️</span> Weather
      </h2>
        {weather ? (
          weather.error ? (
          <p>{weather.error}</p>
        ) : (
        <div>
          <p>
          <strong>{weather.location}</strong>: {convertTemp(weather.temp)} - {weather.description}
          {weather.timestamp && (
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Last updated: {formatTime(weather.timestamp)}
            </p>
          )}
          </p>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>💨 Wind: {weather.wind} mph</li>
            <li>💧 Humidity: {weather.humidity}%</li>
          </ul>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
          />
          <button onClick={() => setUnit(unit === 'F' ? 'C' : 'F')} className="px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 border">
            Switch to °{unit === 'F' ? 'C' : 'F'}
          </button>
        </div>
      )
    ) : (
      <p>Loading...</p>
    )}
    
    {/* Fallback City Input */}
    <form onSubmit={handleCitySubmit} style={{ marginTop: '1rem' }}>
      <label>
        Enter City:
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. Denver"
          style={{ marginLeft: '0.5rem' }}
        />
      </label>
      <button type="submit" style={{ marginLeft: '0.5em' }}>Update</button>
      </form>
    </div>
  );
}

export default Weather;