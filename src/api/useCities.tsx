// api/useCities.ts

interface CityApiResponse {
    data: { city: string }[];
}

export const fetchCitiesFromApi = async (): Promise<string[]> => {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: CityApiResponse = await response.json();
        if (data && data.data && Array.isArray(data.data)) {
            return data.data.map(item => item.city);
        } else {
            throw new Error('Unexpected API response format');
        }
    } catch (error) {
        console.error('Error fetching cities from API:', error);
        return [];
    }
};
