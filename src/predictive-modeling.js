import { provinceCoordinates, climateTriggers, triggerThresholds } from './climateTriggers.js';

/**
 * Fetches 7-day weather forecast for a given province.
 * @param {string} provinceName - The name of the province.
 * @returns {Promise<object>} - The weather forecast data from Open Meteo.
 */
async function fetchWeatherForecast(provinceName) {
  const coordinates = provinceCoordinates[provinceName];
  if (!coordinates) {
    throw new Error(`Coordinates not found for province: ${provinceName}`);
  }

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
    throw new Error(`Failed to fetch weather data for ${provinceName}: ${errorData.reason}`);
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
 * Generates pest and disease advisories for a given province based on the 7-day forecast.
 * @param {string} provinceName - The name of the province.
 * @returns {Promise<object>} - An object with advisories keyed by date.
 */
export async function generateAdvisories(provinceName) {
  const forecast = await fetchWeatherForecast(provinceName);
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
 * Generates a summary of geographic risk areas.
 * @returns {Promise<object>} - An object with risk scores for each province.
 */
export async function generateGeographicRisk() {
    const riskSummary = {};
    const provinces = Object.keys(provinceCoordinates);

    // Use Promise.all to fetch and process weather data concurrently
    await Promise.all(provinces.map(async (provinceName) => {
        try {
            const advisories = await generateAdvisories(provinceName);
            let riskScore = 0;
            // The risk score is the total number of pest/disease triggers over the forecast period.
            Object.values(advisories).forEach(dailyAdvisories => {
                if(Array.isArray(dailyAdvisories)) {
                    riskScore += dailyAdvisories.length;
                }
            });
            riskSummary[provinceName] = riskScore;
        } catch (error) {
            console.error(`Could not generate risk for ${provinceName}:`, error);
            riskSummary[provinceName] = -1; // Indicate an error
        }
    }));

    return riskSummary;
}
