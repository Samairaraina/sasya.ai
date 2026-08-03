import { prisma } from '../../lib/prisma';

export class WeatherService {
  static async getWeather(location: string) {
    // Return cached weather or fetch from external API
    let weather = await prisma.weather.findUnique({
      where: { location }
    });

    // Mock fetch if not found or older than 1 hour
    if (!weather || new Date().getTime() - weather.updatedAt.getTime() > 3600000) {
      // e.g. const res = await axios.get(`api.openweathermap.org...`)
      const fetchedData = {
        temperature: 28.5 + (Math.random() * 5),
        humidity: 60 + (Math.random() * 20),
        rainfall: Math.random() > 0.7 ? Math.random() * 10 : 0
      };

      weather = await prisma.weather.upsert({
        where: { location },
        update: fetchedData,
        create: {
          location,
          ...fetchedData
        }
      });
    }

    return weather;
  }
}
