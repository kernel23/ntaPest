import { useState, useEffect } from 'react';

const ADDRESS_URL = 'https://raw.githubusercontent.com/flores-jacob/philippine-regions-provinces-cities-municipalities-barangays/master/philippine_provinces_cities_municipalities_and_barangays_2019v2.json';

// This hook fetches and processes the address data.
// In a real app, this might be cached in context or a state management library
// to avoid re-fetching on every component mount.
export const useAddress = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(ADDRESS_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok for address data');
        }
        const data = await response.json();

        const provinceList = [];
        for (const regionCode in data) {
          const region = data[regionCode];
          for (const provinceName in region.province_list) {
            const provinceData = region.province_list[provinceName];
            const municipalities = [];
            if (provinceData.municipality_list) {
              for (const municipalityName in provinceData.municipality_list) {
                const municipalityData = provinceData.municipality_list[municipalityName];
                municipalities.push({
                  name: municipalityName,
                  barangays: municipalityData.barangay_list || [],
                });
              }
            }
            provinceList.push({
              name: provinceName,
              municipalities: municipalities,
            });
          }
        }

        // Sort provinces alphabetically
        provinceList.sort((a, b) => a.name.localeCompare(b.name));

        // Sort municipalities within each province
        provinceList.forEach(province => {
          province.municipalities.sort((a, b) => a.name.localeCompare(b.name));
        });

        setProvinces(provinceList);
      } catch (err) {
        console.error('Failed to fetch or process address data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  return { provinces, loading, error };
};
