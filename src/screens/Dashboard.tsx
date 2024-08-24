import { useState, useEffect } from 'react';
import { HourlyForecast, TodayData } from '../types'
import { useWeatherContext } from '../context/WeatherContext';
import { fetchCitiesFromApi } from '../api/useCities';

function Dashboard() {
    const { setQuery, weatherData, errors, getDayOfWeek, getTodayDate } = useWeatherContext();
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);  
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        const loadCities = async () => {
            const citiesData = await fetchCitiesFromApi();
            setCities(citiesData);
        };
        loadCities();
    }, []);

    const fetchSuggestions = (query: string) => {
        if (query === '') {
            setSuggestions([]);
            return;
        }

        const filteredSuggestions = cities.filter(city => 
            city.toLowerCase().includes(query.toLowerCase())
        );

        setSuggestions(filteredSuggestions);
    };
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);
        fetchSuggestions(value);
    };
  
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedCity) {
          setQuery(selectedCity);
          setInput('');
          setSuggestions([]); 
          setSelectedCity(null); 
        }
    };

    const handleSuggestionClick = (city: string) => {
        setInput(city);
        setSelectedCity(city);
        setSuggestions([]);
    };  

    const todayDate = getTodayDate();
    const desiredTimes = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    let tomorrowData: HourlyForecast | undefined;
    let todayData: TodayData | undefined; 
    let filteredHourlyData: HourlyForecast[] = [] ;
  
    if (weatherData) {
      tomorrowData = weatherData.forecast.forecastday[1];
      todayData = weatherData.forecast.forecastday[0];
    }
  
    if (tomorrowData) {
      filteredHourlyData = tomorrowData.hour.filter((hourData: HourlyForecast) => {
        const time = new Date(hourData.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return desiredTimes.includes(time);
      });
    }
    // console.log(todayData?.day.daily_chance_of_rain)
    return (
        <div className="lg:h-screen w-full flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 py-4 lg:py-3 lg:pl-4">
            <section className='w-full lg:w-[75%] h-full'>
                <form className='relative text-slate-300 flex items-center justify-between' onSubmit={handleSubmit}>
                    <input
                        type='text'
                        value={input}
                        onChange={handleChange}
                        placeholder='Search for a city'
                        className='w-[70%] lg:w-[86%] h-12 pl-4 outline-none bg-[#202C3C] rounded-full'
                    />
                    <button
                            type='submit'
                            className='w-[23%] h-11  lg:w-[12%] lg:h-12 text-[#202C3C] bg-slate-400 hover:bg-slate-500 rounded-full relative'
                    >
                        Search
                    </button>
                    {suggestions.length > 0 && (
                        <ul className='absolute w-[97%] top-10 left-1/2 transform translate-x-[-50%] bg-[#202C3C] rounded-b-lg'>
                        {suggestions.map((city, index) => (
                            <li
                            key={index}
                            onClick={() => handleSuggestionClick(city)}
                            className='px-4 py-2 cursor-pointer hover:bg-gray-700'
                            >
                            {city}
                            </li>
                        ))}
                        </ul>
                    )}
                </form>
                <div className='pl-4 pt-7 lg:pl-10'>
                    <h1 className='text-4xl text-white font-bold'>
                    {weatherData && weatherData.location.name}
                    </h1>
                    <p className='text-slate-500 text-xs font-semibold mt-4'>
                    Chance of rain: {todayData?.day.daily_chance_of_rain}%
                    </p>
                    <h1 className='mt-5 text-white text-2xl font-bold'>
                    {weatherData && weatherData.current.temp_c}°C
                    </h1>
                </div>
                <div className='bg-[#202C3C] w-full rounded-lg mt-10 lg:mt-20 px-3 py-6'>
                    <h1 className='uppercase text-xs font-semibold text-slate-300'>Tomorrow's forecast</h1>
                    <div className='flex items-center justify-center mt-6 mb-2 px-3 w-full overflow-x-auto lg:overflow-x-hidden'>
                    {
                        filteredHourlyData && filteredHourlyData.map(( hour, index ) => (
                        <div 
                            key={index} 
                            className={`flex flex-grow items-center justify-center flex-col gap-1 px-6 ${
                            index !== filteredHourlyData.length - 1 ? 'border-r-2 border-gray-500' : ''
                        }`}>
                            <h1 className='uppercase text-[0.7rem] font-semibold text-slate-500'>
                                {new Date(hour.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </h1>
                            <img className='size-8' src={`${hour.condition.icon}`} alt="moderate-rain"/>
                            <h1 className='uppercase text-[0.7rem] font-semibold text-slate-500'> {hour.temp_c}°C </h1>
                        </div>
                        ))
                    }
                    </div>
                </div>
                <div className='bg-[#202C3C] w-full rounded-lg mt-5 px-3 pt-6 pb-12'>
                    <h1 className='uppercase text-xs font-semibold text-slate-300'>Air conditions</h1>
                    <div className='flex items-center justify-center mt-6 mb-2 flex-col gap-5 w-full'>
                    <div className='flex items-center justfiy-center w-full px-2 lg:px-0 lg:w-[80%]'>
                        <div className='flex items-center gap-1 flex-grow flex-col'>
                            <h2 className='text-slate-500 text-xs font-semibold'>Feels like</h2>
                            <h1 className='font-bold text-white text-lg '> {weatherData && weatherData.current.feelslike_c}°C </h1>
                        </div>
                        <div className='flex items-center gap-1 flex-grow flex-col'>
                            <h2 className='text-slate-500 text-xs font-semibold'>UV Index</h2>
                            <h1 className='font-bold text-white text-lg '> {weatherData && weatherData.current.uv} </h1>
                        </div>
                        <div className='flex items-center gap-1 flex-grow flex-col'>
                            <h2 className='text-slate-500 text-xs font-semibold'>Wind</h2>
                            <h1 className='font-bold text-white text-lg '> {weatherData && weatherData.current.wind_kph}km/h </h1>
                        </div>
                        <div className='flex items-center gap-1 flex-grow flex-col'>
                            <h2 className='text-slate-500 text-xs font-semibold'>Visibility</h2>
                            <h1 className='font-bold text-white text-lg '> {weatherData && weatherData.current.vis_km}km </h1>
                        </div>
                        
                    </div>
                    <div className='flex items-center justfiy-center w-full lg:w-[70%]'>
                        <div className='flex items-center gap-1 flex-grow flex-col'>
                            <h2 className='text-slate-500 text-xs font-semibold'>Pressure</h2>
                            <h1 className='font-bold text-white text-lg '> {weatherData && weatherData.current.pressure_mb}hPa </h1>
                        </div>
                        <div className='flex items-center gap-1 flex-grow flex-col'>
                        <h2 className='text-slate-500 text-xs font-semibold'>Sunset</h2>
                        <h1 className='font-bold text-white text-lg '> {todayData?.astro.sunset} </h1>
                        </div>
                        <div className='flex items-center gap-1 flex-grow flex-col'>
                        <h2 className='text-slate-500 text-xs font-semibold'>Humidity</h2>
                        <h1 className='font-bold text-white text-lg '> {weatherData && weatherData.current.humidity}% </h1>
                        </div>
                        <div className='flex items-center gap-1 flex-grow flex-col'>
                        <h2 className='text-slate-500 text-xs font-semibold'>Chance of Rain</h2>
                        <h1 className='font-bold text-white text-lg '> {todayData?.day.daily_chance_of_rain}% </h1>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
            <section className='w-full mt-5 lg:mt-0 lg:w-[24%] h-full rounded-l-lg px-4 py-3 bg-[#202C3C] '>
                <h1 className='uppercase text-xs font-semibold text-slate-300'>
                    7-Day Forecast
                </h1>
                <div className='w-full h-[70%] mt-5'>
                    {weatherData && weatherData.forecast.forecastday.map((forecastDay , index) => (
                    <div key={index} className='flex items-center justify-between pl-2 py-4 border-b border-y-gray-500 flex-grow'>
                        <h1 className='text-xs font-semibold text-slate-300'>{ forecastDay.date === todayDate ? "Today" : getDayOfWeek(forecastDay.date) }</h1>
                        <div className='flex items-center gap-1'>
                        <img className='size-6' src={`${forecastDay.day.condition.icon}`} alt="moderate-rain"/>
                        <h1 className='text-xs text-slate-500 font-semibold'>{forecastDay.day.condition.text}</h1>
                        </div>
                        <h1 className='uppercase text-[0.7rem] font-semibold text-slate-300'> {`${forecastDay.day.maxtemp_c}°C`} </h1>
                    </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Dashboard