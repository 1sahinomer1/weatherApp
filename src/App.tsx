import { useState } from "react";
import { WeatherData } from "./utils/Type";
import { Animated } from "react-animated-css";
import { useSpring, animated } from "react-spring";
import { AiFillGithub } from "react-icons/ai";

import "./styles/App.scss";

function App() {
  const API_KEY = "38ace56c0aa32b623cc52477ac42996b";
  const [cityName, setCityName] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [color, setColor] = useState<string>("");

  const calc = (x, y) => [
    -(y - window.innerHeight / 2) / 20,
    (x - window.innerWidth / 2) / 20,
    1.1,
  ];
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  const trans: any = (x: number, y: number, s: number) =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  const fetchWeather = async (cityName: string) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&lang=tr&units=metric`
    );
    if (response.status === 200) {
      let weatherData: WeatherData = await response.json();
      setWeatherData(weatherData);
      if (weatherData.main.temp) {
        weatherData.main.temp > 0 ? setColor("red") : setColor("blue");
      }
    }
  };

  const onInput = (e) => {
    setCityName(e.target.value);
    fetchWeather(e.target.value);
  };

  return (
    <div className="App">
      <div
        className="container"
        style={{
          backgroundColor: color,
          transition: "background-color 1s linear",
        }}
      >
        <Animated
          animationIn="bounceInLeft"
          animationOut="fadeOut"
          isVisible={true}
        >
          <input
            type="text"
            onInput={onInput}
            value={cityName}
            placeholder="entry city"
          />
        </Animated>
        {weatherData && (
          <animated.div
            onMouseMove={({ clientX: x, clientY: y }) =>
              set({ xys: calc(x, y) })
            }
            onMouseLeave={() => set({ xys: [0, 0, 1] })}
            style={{
              transform: props.xys.interpolate(trans),
            }}
          >
            <div className="city">
              <h2 className="cityName">
                <span>{weatherData?.name}</span>
                <sup>{weatherData?.sys.country}</sup>
              </h2>
              <div className="cityTemp">
                {Math.round(weatherData.main.temp)}
                <sup>&deg;C</sup>
              </div>
              <div className="info">
                <img
                  className="city-icon"
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                />
                <p>{weatherData.weather[0].description}</p>
                <div className="github">
                  <a href="https://github.com/1sahinomer1">
                    <AiFillGithub size={25} />
                  </a>
                </div>
              </div>
            </div>
          </animated.div>
        )}
      </div>
    </div>
  );
}

export default App;
