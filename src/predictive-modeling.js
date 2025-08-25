import { municipalityCoordinates } from './municipalityCoordinates.js';
import { climateTriggers, triggerThresholds } from './climateTriggers.js';

/**
 * Fetches 7-day weather forecast for a given municipality.
 * @param {string} provinceName - The name of the province.
 * @param {string} municipalityName - The name of the municipality.
 * @returns {Promise<object>} - The weather forecast data from Open Meteo.
 */
async function fetchWeatherForecast(provinceName, municipalityName) {
  const province = municipalityCoordinates[provinceName];
  if (!province) {
    throw new Error(`Province not found: ${provinceName}`);
  }
  const municipality = province[municipalityName];
  if (!municipality) {
    throw new Error(`Municipality not found: ${municipalityName}`);
  }

  const coordinates = {
    latitude: municipality.lat,
    longitude: municipality.lng
  };

  const params = [
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_sum',
    'relative_humidity_2m_max',
    'relative_humidity_2m_min',
    'sunshine_duration'
  ].join(',');

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=${params}&timezone=Asia/Manila&forecast_days=7`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch weather data for ${municipalityName}, ${provinceName}: ${errorData.reason}`);
  }
  return await response.json();
}

/**
 * Checks if a day's weather data meets a set of climate conditions.
 * @param {object} dailyWeather - The weather data for a single day.
 * @param {string[]} conditions - An array of condition keys (e.g., ['cool', 'wet']).
 * @returns {boolean} - True if all conditions are met, false otherwise.
 */
function checkConditions(dailyWeather, conditions) {
  return conditions.every(condition => {
    const threshold = triggerThresholds[condition];
    if (!threshold) return false;

    const avg_temp = (dailyWeather.temperature_2m_max + dailyWeather.temperature_2m_min) / 2;
    const avg_humidity = (dailyWeather.relative_humidity_2m_max + dailyWeather.relative_humidity_2m_min) / 2;

    if (threshold.temp_max !== undefined && avg_temp >= threshold.temp_max) return false;
    if (threshold.temp_min !== undefined && avg_temp <= threshold.temp_min) return false;

    if (condition === 'wet') {
        if (dailyWeather.precipitation_sum < threshold.precipitation_sum && avg_humidity < threshold.humidity_min) return false;
    } else if (condition === 'dry') {
        if (dailyWeather.precipitation_sum >= threshold.precipitation_sum || avg_humidity >= threshold.humidity_max) return false;
    } else {
        if (threshold.precipitation_sum !== undefined && dailyWeather.precipitation_sum < threshold.precipitation_sum) return false;
    }

    if (threshold.humidity_max !== undefined && avg_humidity >= threshold.humidity_max) return false;
    if (threshold.humidity_min !== undefined && avg_humidity <= threshold.humidity_min) return false;

    if (threshold.sunshine_duration_max !== undefined && dailyWeather.sunshine_duration >= threshold.sunshine_duration_max) return false;
    if (threshold.sunshine_duration_min !== undefined && dailyWeather.sunshine_duration <= threshold.sunshine_duration_min) return false;

    return true;
  });
}

/**
 * Generates pest and disease advisories for a given municipality based on the 7-day forecast.
 * @param {string} provinceName - The name of the province.
 * @param {string} municipalityName - The name of the municipality.
 * @returns {Promise<object>} - An object with advisories keyed by date.
 */
export async function generateAdvisories(provinceName, municipalityName) {
  const forecast = await fetchWeatherForecast(provinceName, municipalityName);
  const advisories = {};

  if (!forecast.daily || !forecast.daily.time) {
    return { error: "Could not retrieve forecast data." };
  }

  forecast.daily.time.forEach((date, index) => {
    const dailyWeather = {
      temperature_2m_max: forecast.daily.temperature_2m_max[index],
      temperature_2m_min: forecast.daily.temperature_2m_min[index],
      precipitation_sum: forecast.daily.precipitation_sum[index],
      relative_humidity_2m_max: forecast.daily.relative_humidity_2m_max[index],
      relative_humidity_2m_min: forecast.daily.relative_humidity_2m_min[index],
      sunshine_duration: forecast.daily.sunshine_duration[index]
    };

    const triggeredPests = [];

    for (const pestName in climateTriggers) {
      const trigger = climateTriggers[pestName];
      if (checkConditions(dailyWeather, trigger.conditions)) {
        triggeredPests.push({
          name: pestName,
          ...trigger
        });
      }
    }

    if (triggeredPests.length > 0) {
      advisories[date] = triggeredPests;
    }
  });

  return advisories;
}

/**
 * Generates a summary of geographic risk areas for all municipalities.
 * @returns {Promise<object>} - An object with risk scores for each municipality, nested under its province.
 */
export async function generateGeographicRisk() {
    const riskSummary = {};
    const promises = [];

    for (const provinceName in municipalityCoordinates) {
        riskSummary[provinceName] = {};
        for (const municipalityName in municipalityCoordinates[provinceName]) {
            const promise = generateAdvisories(provinceName, municipalityName)
                .then(advisories => {
                    let riskScore = 0;
                    if (!advisories.error) {
                        Object.values(advisories).forEach(dailyAdvisories => {
                            riskScore += dailyAdvisories.length;
                        });
                    } else {
                        riskScore = -1; // Indicate an error
                    }
                    riskSummary[provinceName][municipalityName] = {
                        score: riskScore,
                        coords: municipalityCoordinates[provinceName][municipalityName]
                    };
                })
                .catch(error => {
                    console.error(`Could not generate risk for ${municipalityName}, ${provinceName}:`, error);
                    riskSummary[provinceName][municipalityName] = {
                        score: -1,
                        coords: municipalityCoordinates[provinceName][municipalityName]
                    };
                });
            promises.push(promise);
        }
    }

    await Promise.all(promises);
    return riskSummary;
}
