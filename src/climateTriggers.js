export const provinceCoordinates = {
  "Ilocos Norte": { latitude: 18.2443, longitude: 120.6256 },
  "Ilocos Sur": { latitude: 17.2805, longitude: 120.5365 },
  "La Union": { latitude: 16.5789, longitude: 120.3607 },
  "Pangasinan": { latitude: 16.1052, longitude: 120.2591 },
  "Abra": { latitude: 17.5556, longitude: 120.7906 },
  "Isabela": { latitude: 16.9828, longitude: 122.0087 },
  "Cagayan": { latitude: 18.00, longitude: 121.8 }
};

export const climateTriggers = {
  "Black Shank": {
    conditions: ["wet"],
    optimalTreatment: "Apply Metalaxyl-M/Mefenoxam when conditions are favorable and disease is detected. Destroy stalks and roots immediately following harvest.",
    scoutingAdvice: "Monitor from the seedling stage for wilting and stem lesions, especially after periods of high soil moisture."
  },
  "Blue Mold (Downy Mildew)": {
    conditions: ["cool", "wet", "cloudy"],
    optimalTreatment: "Apply preventative fungicides before disease is established, especially when weather conditions are favorable. Once detected, apply systemic fungicides.",
    scoutingAdvice: "Begin scouting early in the season, especially during cool, wet, and cloudy weather. Check undersides of leaves for bluish-gray mold."
  },
  "Brown Spot": {
    conditions: ["wet"],
    optimalTreatment: "Management is primarily preventative. No specific chemical control mentioned for active outbreaks.",
    scoutingAdvice: "Monitor lower, mature leaves for brown, circular lesions, especially in humid conditions."
  },
  "Frogeye Leaf Spot": {
    conditions: ["wet"],
    optimalTreatment: "Apply appropriate botanical fungicides like Timorex Gold following label instructions upon detection.",
    scoutingAdvice: "Monitor all plant stages, especially in wet weather. Focus on lower leaves for characteristic frog-eye lesions."
  },
  "Damping-off, Basal root rots": {
    conditions: ["wet", "cool"],
    optimalTreatment: "Apply anti-oomycete fungicide to the soil/substrate as a preventive measure or at the first sign of symptoms.",
    scoutingAdvice: "Monitor for brown, moist lesions on the stem at the soil line, especially in cold, wet soils."
  },
  "Damping-off, Collar cankers, Leaf spot (Target Spot)": {
    conditions: ["wet", "hot"],
    optimalTreatment: "Apply registered fungicides like Azoxystrobin to control target spot in the field when conditions are favorable.",
    scoutingAdvice: "Monitor for damping-off in nurseries and reddish-brown cankers or circular leaf spots in the field, especially during periods of high moisture and high temperature."
  },
  "Wildfire and Angular Leaf Spot": {
    conditions: ["wet"],
    optimalTreatment: "In the seedbed, apply copper oxychloride. For severe crop affectation, early harvesting can reduce losses.",
    scoutingAdvice: "Scout seedbeds and fields regularly, especially low-lying areas and after rainfall. Look for water-soaked spots on leaves."
  },
  "Grey mould": {
    conditions: ["wet"],
    optimalTreatment: "Use fungicides like iprodione or pyrimethanil, alternating between them, when grey mould is detected.",
    scoutingAdvice: "Monitor for stem cankers and leaf spots, especially after periods of high humidity or leaf wetness."
  },
  "Black root rot": {
    conditions: ["hot"],
    optimalTreatment: "Management is primarily preventative through crop rotation and sanitation. Some fungicides can be used preventatively.",
    scoutingAdvice: "Monitor for wilting in hot weather. Inspect roots for black rot if above-ground symptoms appear."
  },
  "Anthracnose": {
    conditions: ["wet", "cool", "cloudy"],
    optimalTreatment: "Fungicide use may be an option in some regions, but prevention is key.",
    scoutingAdvice: "Monitor for circular lesions on leaves and cankers on petioles and stems, especially during cool, humid, and low-light conditions."
  },
  "White mould, Powdery mildew": {
    conditions: ["wet", "cool", "cloudy"],
    optimalTreatment: "Apply chemical treatments early, such as with penconazole, during cloudy and cool periods to avoid phytotoxicity.",
    scoutingAdvice: "Monitor for greyish, white, felt-like powdery patches on leaves, especially during cool and humid weather."
  },
  "Black soft rot of stem and leaves, Hollow stalk": {
    conditions: ["wet", "cloudy"],
    optimalTreatment: "Apply bacteriostatic solutions based on copper at the collar level of seedlings. Lower humidity in nurseries.",
    scoutingAdvice: "Monitor for wet, black rot on seedlings, especially during cloudy, wet days. Check for stem rot after topping."
  },
  "Pests of air-cured tobacco leaves": {
    conditions: ["wet"],
    optimalTreatment: "Ensure good ventilation in curing barns to manage temperature and moisture.",
    scoutingAdvice: "Monitor leaves during the curing process for signs of mould and rot, especially when humidity is high."
  },
  "Aphids": {
    conditions: ["warm"],
    optimalTreatment: "Topping can reduce populations. Apply Neem-based products when thresholds are met.",
    scoutingAdvice: "Monitor once a week, beginning 3-4 weeks after transplanting. Check underside of upper leaves, especially as temperatures warm up."
  },
  "Thrips": {
    conditions: ["hot", "dry"],
    optimalTreatment: "Apply appropriate insecticides in the seedbed or field when populations are detected.",
    scoutingAdvice: "Monitor leaf surfaces in the first 3-4 weeks after transplanting. Monitor closely during hot, arid weather."
  },
  "Grasshoppers": {
    conditions: ["hot", "dry"],
    optimalTreatment: "Apply neem to foliage when pests first appear.",
    scoutingAdvice: "Monitor closely during hot, dry years. Take action when there are 10 or more grasshoppers per 50 plants."
  },
  "Root asphyxia": {
    conditions: ["very_wet"],
    optimalTreatment: "No direct treatment. Improve drainage for future crops.",
    scoutingAdvice: "Monitor for sudden wilting of plants after heavy rain or waterlogging."
  },
  "Sunburn (sunscald)": {
    conditions: ["very_hot", "sunny"],
    optimalTreatment: "No direct treatment.",
    scoutingAdvice: "Monitor for browning and drying of leaves on days with extreme heat and intense sun."
  },
  "Climate-related diseases": {
    conditions: ["very_cool"],
    optimalTreatment: "No direct treatment. Protect seedlings from cold.",
    scoutingAdvice: "Monitor for translucent, spoon-shaped leaves on seedlings after cold periods."
  }
};

export const triggerThresholds = {
  cool: { temp_max: 20 }, // Average daily temp < 20°C
  very_cool: { temp_max: 15}, // Average daily temp < 15°C
  warm: { temp_min: 24 }, // Average daily temp > 24°C
  hot: { temp_min: 28 }, // Average daily temp > 28°C
  very_hot: { temp_min: 32 }, // Average daily temp > 32°C
  wet: { precipitation_sum: 2, humidity_min: 80 }, // Daily precipitation > 2mm OR relative humidity > 80%
  very_wet: { precipitation_sum: 20 }, // Daily precipitation > 20mm (heavy rain)
  dry: { precipitation_sum: 1, humidity_max: 60 }, // Daily precipitation < 1mm AND relative humidity < 60%
  cloudy: { sunshine_duration_max: 14400 }, // Sunshine duration < 4 hours (14400 seconds)
  sunny: { sunshine_duration_min: 28800 } // Sunshine duration > 8 hours (28800 seconds)
};

export const conditionGroups = {
  "cool,wet,cloudy": "Fungal diseases favored by cool, wet, and cloudy weather",
  "hot,dry": "Pests favored by hot and dry conditions",
  "wet": "Pests and diseases favored by wet or humid conditions",
  "hot": "Pests and diseases favored by hot conditions",
  "cool": "Pests and diseases favored by cool conditions",
  "warm": "Pests favored by warm conditions",
  "very_wet": "Issues related to waterlogging",
  "very_hot,sunny": "Issues related to extreme heat and sun",
  "very_cool": "Issues related to cold snaps"
};
