import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { TodayData } from '../types';
import { useWeatherContext } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';

// Custom hook to change map view
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

function Location() {
  const { theme } = useTheme();
  const { weatherData, setQuery } = useWeatherContext();
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (weatherData && weatherData.location) {
      const { lat, lon } = weatherData.location;
      setPosition([lat, lon]);
    }
  }, [weatherData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
    setInputValue('');
  };

  let todayData: TodayData | undefined; 

  if (weatherData) {
    todayData = weatherData.forecast.forecastday[0];
  }

  return (
    <div className={`h-[80%] lg:h-screen w-full flex flex-col lg:flex-row items-center justify-between py-10 relative z-30 ${theme === 'dark' ? 'bg-[#121212]' : 'bg-[#F5F5F5]'}`}>
  <div className='h-[40vh] lg:h-screen lg:py-5 px-5 lg:px-10 w-full lg:w-[63%] '>
            <div className='py-4 w-full'>
                <form onSubmit={handleSearch} className='flex items-center justify-between'>
                    <input
                        type='text'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='Enter city name'
                        className='p-2 w-[70%] lg:w-[78%] h-12 pl-4 outline-none bg-[#202C3C] rounded-full text-slate-400'
                    />
                    <button
                        type='submit'
                        className='w-[25%] lg:w-[20%] h-12 text-[#202C3C] bg-slate-400 hover:bg-slate-500 rounded-full'
                    >
                        Search
                    </button>
                </form>
            </div>
            <MapContainer center={position} zoom={10} className='h-full w-full lg:h-[90%]'>
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <ChangeView center={position} zoom={10} />
                <Marker position={position}>
                <Popup>
                    {weatherData?.location.name}<br />
                    {weatherData?.current.condition.text}<br />
                    Temperature: {weatherData?.current.temp_c}°C
                </Popup>
                </Marker>
            </MapContainer>
        </div>
    <div className={`w-full mt-28 px-5 lg:px-0 lg:w-[35%] lg:h-screen lg:pt-10 pb-2 lg:pl-10 ${theme === 'dark' ? 'bg-[#202C3C]' : 'bg-white'}`}>
        <div className={`py-5 lg:py-0 lg:pt-5 w-full h-full rounded-lg lg:rounded-none lg:rounded-l-lg pl-5 ${theme === 'dark' ? 'bg-[#202C3C]' : 'bg-white'}`}>
            <h1 className={`uppercase font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-[#202C3C]'}`}>Weather Data</h1>
            <div className={`mt-5 pl-4 flex flex-col justify-center gap-6 ${theme === 'dark' ? 'text-slate-300' : 'text-[#202C3C]'}`}>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>Temperature:</h1>
                    <div className='flex items-center gap-1'>
                        <img className='size-6' src={`${weatherData?.current.condition.icon}`} alt="weather-icon"/>
                        <p className='uppercase text-[0.7rem] font-semibold'>{weatherData?.current.condition.text}</p>
                        <p className='uppercase text-[0.7rem] font-semibold'> {weatherData?.current.temp_c}°C </p>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>Pressure:</h1>
                    <p className='uppercase text-[0.7rem] font-semibold'> {weatherData?.current.pressure_mb}hPa </p>
                </div>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>Humidity:</h1>
                    <p className='uppercase text-[0.7rem] font-semibold'> {weatherData?.current.humidity}% </p>
                </div>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>Wind:</h1>
                    <p className='uppercase text-[0.7rem] font-semibold'> {weatherData?.current.wind_kph}km/h </p>
                </div>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>Visibility:</h1>
                    <p className='uppercase text-[0.7rem] font-semibold'> {weatherData?.current.vis_km}km </p>
                </div>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>UV Index:</h1>
                    <p className='uppercase text-[0.7rem] font-semibold'> {weatherData?.current.uv} </p>
                </div>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>Sunrise:</h1>
                    <p className='uppercase text-[0.7rem] font-semibold'> {todayData?.astro.sunrise} </p>
                </div>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>Sunset:</h1>
                    <p className='uppercase text-[0.7rem] font-semibold'> {todayData?.astro.sunset} </p>
                </div>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>Sun Up:</h1>
                    <p className='text-[0.7rem] font-semibold'> {todayData?.astro.is_sun_up === 0 ? "No" : "Yes"} </p>
                </div>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>Chance of Rain:</h1>
                    <p className='uppercase text-[0.7rem] font-semibold'> {todayData?.day.daily_chance_of_rain}% </p>
                </div>
                <div className='flex items-center gap-4'>
                    <h1 className='uppercase text-xs font-semibold'>Chance of Snow:</h1>
                    <p className='uppercase text-[0.7rem] font-semibold'> {todayData?.day.daily_chance_of_snow}% </p>
                </div>
            </div>
        </div>
    </div>
</div>
  );
}

export default Location;
