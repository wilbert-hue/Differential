const fs = require('fs');
const path = require('path');

// Years: 2021-2033
const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];

// Geographies with their region grouping (North America only)
const regions = {
  "North America": ["U.S.", "Canada"]
};

// New segment definitions with market share splits (proportions within each segment type)
const segmentTypes = {
  "By Differential Type": {
    "Open Differential": 0.38,
    "Limited Slip Differential (LSD)": 0.22,
    "Locking Differential": 0.15,
    "Torque Vectoring Differential": 0.11,
    "Disconnected Differential": 0.08,
    "Others (Electronic / Active Differential (eLSD), etc.)": 0.06
  },
  "By Drivetrain Configuration": {
    "Front-Wheel Drive (FWD)": 0.42,
    "Rear-Wheel Drive (RWD)": 0.28,
    "All-Wheel Drive / Four-Wheel Drive (AWD/4WD)": 0.30
  },
  "By Propulsion": {
    "Internal Combustion Engine (ICE) Vehicles": 0.70,
    "Hybrid Vehicles": 0.18,
    "Battery Electric Vehicles (BEV)": 0.12
  },
  "By Sales Channel": {
    "OEM (Original Equipment Manufacturer)": 0.72,
    "Aftermarket": 0.28
  }
};

// Regional base values (USD Million) for 2021 - total market per region
// North America Automotive Differential market ~$3.2B in 2021
const regionBaseValues = {
  "North America": 3200
};

// Country share within region (must sum to ~1.0)
const countryShares = {
  "North America": { "U.S.": 0.85, "Canada": 0.15 }
};

// Growth rates (CAGR) per region
const regionGrowthRates = {
  "North America": 0.058
};

// Segment-specific growth multipliers (relative to regional base CAGR)
const segmentGrowthMultipliers = {
  "By Differential Type": {
    "Open Differential": 0.85,
    "Limited Slip Differential (LSD)": 1.05,
    "Locking Differential": 1.10,
    "Torque Vectoring Differential": 1.45,
    "Disconnected Differential": 1.55,
    "Others (Electronic / Active Differential (eLSD), etc.)": 1.35
  },
  "By Drivetrain Configuration": {
    "Front-Wheel Drive (FWD)": 0.88,
    "Rear-Wheel Drive (RWD)": 0.95,
    "All-Wheel Drive / Four-Wheel Drive (AWD/4WD)": 1.25
  },
  "By Propulsion": {
    "Internal Combustion Engine (ICE) Vehicles": 0.78,
    "Hybrid Vehicles": 1.30,
    "Battery Electric Vehicles (BEV)": 1.85
  },
  "By Sales Channel": {
    "OEM (Original Equipment Manufacturer)": 0.98,
    "Aftermarket": 1.08
  }
};

// Volume multiplier: units per USD Million (~10,000 units per $1M for differentials)
const volumePerMillionUSD = 9500;

// Seeded pseudo-random for reproducibility
let seed = 42;
function seededRandom() {
  seed = (seed * 16807 + 0) % 2147483647;
  return (seed - 1) / 2147483646;
}

function addNoise(value, noiseLevel = 0.03) {
  return value * (1 + (seededRandom() - 0.5) * 2 * noiseLevel);
}

function roundTo1(val) {
  return Math.round(val * 10) / 10;
}

function roundToInt(val) {
  return Math.round(val);
}

function generateTimeSeries(baseValue, growthRate, roundFn) {
  const series = {};
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const rawValue = baseValue * Math.pow(1 + growthRate, i);
    series[year] = roundFn(addNoise(rawValue));
  }
  return series;
}

function generateData(isVolume) {
  const data = {};
  const roundFn = isVolume ? roundToInt : roundTo1;
  const multiplier = isVolume ? volumePerMillionUSD : 1;

  // Generate data for each region and country
  for (const [regionName, countries] of Object.entries(regions)) {
    const regionBase = regionBaseValues[regionName] * multiplier;
    const regionGrowth = regionGrowthRates[regionName];

    // Region-level data
    data[regionName] = {};
    for (const [segType, segments] of Object.entries(segmentTypes)) {
      data[regionName][segType] = {};
      for (const [segName, share] of Object.entries(segments)) {
        const segGrowth = regionGrowth * segmentGrowthMultipliers[segType][segName];
        const segBase = regionBase * share;
        data[regionName][segType][segName] = generateTimeSeries(segBase, segGrowth, roundFn);
      }
    }

    // Add "By Country" for each region
    data[regionName]["By Country"] = {};
    for (const country of countries) {
      const cShare = countryShares[regionName][country];
      const countryGrowthVariation = 1 + (seededRandom() - 0.5) * 0.06;
      const countryBase = regionBase * cShare;
      const countryGrowth = regionGrowth * countryGrowthVariation;
      data[regionName]["By Country"][country] = generateTimeSeries(countryBase, countryGrowth, roundFn);
    }

    // Country-level data
    for (const country of countries) {
      const cShare = countryShares[regionName][country];
      const countryBase = regionBase * cShare;
      const countryGrowthVariation = 1 + (seededRandom() - 0.5) * 0.04;
      const countryGrowth = regionGrowth * countryGrowthVariation;

      data[country] = {};
      for (const [segType, segments] of Object.entries(segmentTypes)) {
        data[country][segType] = {};
        for (const [segName, share] of Object.entries(segments)) {
          const segGrowth = countryGrowth * segmentGrowthMultipliers[segType][segName];
          const segBase = countryBase * share;
          const shareVariation = 1 + (seededRandom() - 0.5) * 0.1;
          data[country][segType][segName] = generateTimeSeries(segBase * shareVariation, segGrowth, roundFn);
        }
      }
    }
  }

  return data;
}

// Generate both datasets
seed = 42;
const valueData = generateData(false);
seed = 7777;
const volumeData = generateData(true);

// Build segmentation_analysis.json (Global structure with empty leaves)
const segmentationAnalysis = { Global: {} };
for (const [segType, segments] of Object.entries(segmentTypes)) {
  segmentationAnalysis.Global[segType] = {};
  for (const segName of Object.keys(segments)) {
    segmentationAnalysis.Global[segType][segName] = {};
  }
}
segmentationAnalysis.Global["By Region"] = {};
for (const [regionName, countries] of Object.entries(regions)) {
  segmentationAnalysis.Global["By Region"][regionName] = {};
  for (const country of countries) {
    segmentationAnalysis.Global["By Region"][regionName][country] = {};
  }
}

// Write files
const outDir = path.join(__dirname, 'public', 'data');
fs.writeFileSync(path.join(outDir, 'value.json'), JSON.stringify(valueData, null, 2));
fs.writeFileSync(path.join(outDir, 'volume.json'), JSON.stringify(volumeData, null, 2));
fs.writeFileSync(path.join(outDir, 'segmentation_analysis.json'), JSON.stringify(segmentationAnalysis, null, 2));

console.log('Generated value.json, volume.json, segmentation_analysis.json successfully');
console.log('Geographies:', Object.keys(valueData));
console.log('Segment types:', Object.keys(valueData['North America']));
