import React, { useState } from 'react';
import "./Style.css";

const WeatherApp = () => {
  const weatherApi = {
    key: '820b817bc39d52dac15c774cb4cd0fe1',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
  };

  const [cityQuery, setCityQuery] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchWeatherData = async () => {
    if (cityQuery === '') {
      setErrorMessage('Please enter a city name');
      return;
    }

    setIsLoading(true);
    setNotFoundMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`${weatherApi.baseUrl}?q=${cityQuery}&appid=${weatherApi.key}`);
      const data = await response.json();

      if (data.cod === '404') {
        setNotFoundMessage('City not found');
        setWeatherData({});
      } else {
        setWeatherData(data);
      }
    } catch (error) {
      setNotFoundMessage('Unable to retrieve data for this location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      fetchWeatherData();
    }
  };

  return (
    <div id='app'>
      <h1>🌞 ⛅ ☔ Weather Around the 🌎</h1>
      <div className='weather'>
        <input
          type="text"
          id="city-search"
          placeholder="Enter a city name..."
          onChange={(e) => setCityQuery(e.target.value)}
          onKeyPress={handleEnterKey}
        />
        <input type="submit" value="Search" id="search-btn" onClick={fetchWeatherData} />
      </div>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {isLoading && <p>Loading...</p>}
      {notFoundMessage && <p style={{ color: 'red' }}>{notFoundMessage}</p>}

      {weatherData.main && (
        <div id='weather-data' className='display'>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            alt={weatherData.weather[0].description}
          />
          <h2>{weatherData.name}</h2>
          <p><strong>Temperature:</strong> {Math.round(weatherData.main.temp - 273.15)}°C</p>
          <p><strong>Description:</strong> {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
