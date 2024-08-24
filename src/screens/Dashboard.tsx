import { useState, useEffect } from 'react';
import Select from 'react-select';
import { HourlyForecast, TodayData } from '../types'
import { useWeatherContext } from '../context/WeatherContext';

function Dashboard() {
    const { setQuery, weatherData, errors, getDayOfWeek, getTodayDate } = useWeatherContext();
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    useEffect(() => {
        const cachedCities = localStorage.getItem('citySuggestions');
        if (cachedCities) {
            setSuggestions(JSON.parse(cachedCities));
        }
    }, []);
    const fetchSuggestions = async (query: string) => {
        try {
            const cachedCities = localStorage.getItem('citySuggestions');
            let citySuggestions = [];
    
            if (cachedCities) {
                citySuggestions = JSON.parse(cachedCities);
            } else {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities');
                const data = await response.json();
    
                if (data && data.data && Array.isArray(data.data)) {
                    citySuggestions = data.data.map((item: any) => ({
                        value: item.city,
                        label: item.city
                    }));
                    
                    localStorage.setItem('citySuggestions', JSON.stringify(citySuggestions));
                } else {
                    console.error('Unexpected API response format', data);
                }
            }
            
            const filteredSuggestions = citySuggestions.filter(city =>
                city.label.toLowerCase().includes(query.toLowerCase())
            );
    
            setSuggestions(filteredSuggestions);
        } catch (error) {
            console.error('Error fetching city suggestions:', error);
        }
    };
    
    
    const handleChange = (selectedOption: any) => {
        if (selectedOption) {
            setSelectedCity(selectedOption.value);
            setInput(selectedOption.label);
            setSuggestions([]);
        }
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
    console.log(todayData?.day.daily_chance_of_rain)
    return (
        <div className="h-screen w-full bg-no-repeat bg-cover bg-center flex items-center justify-between py-3 pl-4">
            <section className='w-[75%] h-full'>
            <form className='relative text-slate-300 bg-[#202C3C]' onSubmit={handleSubmit}>
                <Select
                    inputValue={input}
                    onInputChange={(value) => {
                        setInput(value);
                        fetchSuggestions(value);
                    }}
                    options={suggestions}
                    onChange={handleChange}
                    placeholder="Search for a city"
                    className='text-black outline-none bg-[#202C3C] rounded-full'
                    isClearable
                />
            </form>
            <div className='pt-7 pl-10'>
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
            <div className='bg-[#202C3C] w-full rounded-lg mt-20 px-3 py-6'>
                <h1 className='uppercase text-xs font-semibold text-slate-300'>Tomorrow's forecast</h1>
                <div className='flex items-center justify-center mt-6 mb-2 px-3 w-full'>
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
                <div className='flex items-center justfiy-center w-[80%]'>
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
                    <div className='flex items-center gap-1 flex-grow flex-col'>
                    <h2 className='text-slate-500 text-xs font-semibold'>Pressure</h2>
                    <h1 className='font-bold text-white text-lg '> {weatherData && weatherData.current.pressure_mb}hPa </h1>
                    </div>
                </div>
                <div className='flex items-center justfiy-center w-[60%]'>
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
            <section className='w-[24%] h-full rounded-l-lg px-4 py-3 bg-[#202C3C] '>
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