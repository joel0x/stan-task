import { useEffect, useState } from "react";
import hotBg from "./assets/hotBg.jpg";
import Description from "./components/Description";
import coldBg from "./assets/coldBg.jpg";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [city, setCity] = useState("Paris");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);
  const [error, setError] = useState(null);

  const cityList = ["Paris", "London", "New York", "Tokyo", "Sydney", "Bangalore", "kolkata", "uttarakhand"];

  const fetchWeatherData = async () => {
    try {
      setError(null);
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      const threshold = units === "metric" ? 20 : 60;
      setBg(data.temp <= threshold ? coldBg : hotBg);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Invalid city name. Please enter a valid city.");
      } else {
        setError("Error fetching weather data. Please try again later.");
      }
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = () => {
    setUnits((prevUnits) => (prevUnits === "metric" ? "imperial" : "metric"));
  };

  const handleRes = () => {
    const inputElement = document.querySelector('input[name="city"]');
    if (inputElement) {
      const newCity = inputElement.value;
      setCity(newCity);
      fetchWeatherData();
    }
  };

  const enterKeyPressed = async (e) => {
    if (e.key === 'Enter') {
      setCity(e.target.value);
      e.target.blur();
      await fetchWeatherData();
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section sectInputs">
              <input
                list="cities"
                onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                placeholder="Enter city ..."
              />
              <datalist id="cities">
                {cityList.map((city, index) => (
                  <option key={index} value={city} />
                ))}
              </datalist>
              <button onClick={handleRes}>Enter</button>
              <button onClick={handleUnitsClick}>°F</button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="section sectTemp">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${units === "metric" ? "C" : "F"}`}</h1>
              </div>
            </div>
            {/* bottom description */}
            <Description weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
