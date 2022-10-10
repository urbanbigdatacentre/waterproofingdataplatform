/*
 * Weather index mapping:
 *  0: Sol
 *  1: Sol entre nuvens
 *  2: Chuva
 *  3: Chuva forte
 *  4: Nuvens
 *  5: Céu limpo
 *
 */

function getWeatherForecast() {
  return {
    city: "São Jose dos Campos",
    state: "SP",
    today_forecast: {
      date: "18 de Março",
      morning_weather_index: 1,
      evening_weather_index: 1,
      night_weather_index: 4,
      rain_probability: 10,
    },
    next_forecast: [
      {
        week_day: "Segunda",
        date: "19/03",
        weather_index: 0,
        rain_fall_mm: 0,
      },
      {
        week_day: "Terça",
        date: "20/03",
        weather_index: 2,
        rain_fall_mm: 5,
      },
      {
        week_day: "Quarta",
        date: "21/03",
        weather_index: 2,
        rain_fall_mm: 5,
      },
      {
        week_day: "Quinta",
        date: "22/03",
        weather_index: 2,
        rain_fall_mm: 5,
      },
      {
        week_day: "Sexta",
        date: "23/03",
        weather_index: 1,
        rain_fall_mm: 0,
      },
    ],
  };
}

export default getWeatherForecast;
