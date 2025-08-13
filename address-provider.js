// This script fetches and processes the Philippine address data.
// The service worker will intercept the fetch request and cache the response.
window.addressDataPromise = (async function() {
    const response = await fetch('https://raw.githubusercontent.com/flores-jacob/philippine-regions-provinces-cities-municipalities-barangays/master/philippine_provinces_cities_municipalities_and_barangays_2019v2.json');

    if (!response.ok) {
        console.error('Network response was not ok for address data');
        // The service worker should handle serving from cache, so we don't need complex error handling here.
        // If we get here, it means both network and cache failed.
        window.philippineAddresses = { provinces: [] };
        return false;
    }

    const data = await response.json();

    const provinces = [];
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
                        barangays: municipalityData.barangay_list || []
                    });
                }
            }
            provinces.push({
                name: provinceName,
                municipalities: municipalities
            });
        }
    }

    // Sort provinces alphabetically
    provinces.sort((a, b) => a.name.localeCompare(b.name));

    // Sort municipalities within each province
    provinces.forEach(province => {
        province.municipalities.sort((a, b) => a.name.localeCompare(b.name));
    });

    window.philippineAddresses = { provinces: provinces };
    console.log('Address data processed successfully.');
    return true;

})();
