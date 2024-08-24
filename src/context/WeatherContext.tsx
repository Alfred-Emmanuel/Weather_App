import React, { createContext, useState, useContext, useEffect } from 'react';
import { ErrorType, LocationData } from '../types';

interface WeatherContextType {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  weatherData: LocationData | null;
  errors: ErrorType[];
  getDayOfWeek: (dateInput: string) => string;
  getTodayDate: () => string;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState('Lagos');
  const [weatherData, setWeatherData] = useState<LocationData | null>(null);
  const [errors, setErrors] = useState<ErrorType[]>([]);

  const BASE_URL = 'http://api.weatherapi.com/v1/';
  const API_KEY = 'a2b1d628fdcc48d08e0163155242308';
  const forecast_endpoint = 'forecast.json';
  const DAYS = 7;

  const WEATHER_FORECAST_URL = `${BASE_URL}${forecast_endpoint}?key=${API_KEY}&query=${query}&days=${DAYS}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(WEATHER_FORECAST_URL);
        const result = await response.json();
        setWeatherData(result);
      } catch (error) {
        console.error('Error fetching weather forecast data:', error);
        setErrors(prevErrors => [...prevErrors, error as ErrorType]);
      }
    };

    fetchData();
  }, [query]);

  function getDayOfWeek(dateInput: string) {
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <WeatherContext.Provider value={{ query, setQuery, weatherData, errors, getDayOfWeek, getTodayDate }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
};
