export type ErrorType = Error | string;

export interface LocationData {
  location: {
    name: string;
    region: string,
    country: string
  },
  current: {
    temp_c: number,
    temp_f: number,
    is_day: number,
    condition: {
        text: string,
        icon: string,
        code: number
    },
    wind_mph: number,
    wind_kph: number,
    wind_degree: number,
    wind_dir: string,
    pressure_mb: number,
    pressure_in: number,
    humidity: number,
    feelslike_c: number,
    feelslike_f: number,
    uv: number,
    vis_km: number,
  },
  forecast: {
    forecastday: [
        {
            date: string,
            day: {
                maxtemp_c: number,
                condition: {
                    text: string,
                    icon: string,
                    code: number
                },
            }
        }
    ]
  },
}

export interface HourlyForecast {
    time: string;
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    hour: string
}

export interface TodayData {
    day: {
        maxtemp_c: number,
        maxtemp_f: number,
        mintemp_c: number,
        mintemp_f: number,
        avgtemp_c: number,
        avgtemp_f: number,
        maxwind_mph: number,
        maxwind_kph: number,
        totalprecip_mm: number,
        totalprecip_in: number,
        totalsnow_cm: number,
        avgvis_km: number,
        avgvis_miles: number,
        avghumidity: number,
        daily_will_it_rain: number,
        daily_chance_of_rain: number,
        daily_will_it_snow: number,
        daily_chance_of_snow: number,
        condition: {
            text: string,
            icon: string,
            code: number
        },
        uv: number
    },
    astro: {
        sunrise: number,
        sunset: number,
        moonrise: number,
        moonset: number,
        moon_phase: string,
        moon_illumination: number,
        is_moon_up: number,
        is_sun_up: number
    },
}

export interface City {
    value: string;
    label: string;
  }
