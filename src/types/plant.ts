export interface PlantProfile {
  id: string;
  name: string;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  waterLevel: number; // 0-100%
  icon: string;
}

export interface SensorData {
  timestamp: string;
  temp_c: number | null;
  humidity_percent: number | null;
  ok: boolean;
  error: string | null;
}

export const PLANT_PROFILES: PlantProfile[] = [
  {
    id: "tomato",
    name: "Tomato",
    tempMin: 18,
    tempMax: 27,
    humidityMin: 60,
    humidityMax: 80,
    waterLevel: 70,
    icon: "🍅",
  },
  {
    id: "basil",
    name: "Basil",
    tempMin: 20,
    tempMax: 30,
    humidityMin: 50,
    humidityMax: 70,
    waterLevel: 65,
    icon: "🌿",
  },
  {
    id: "lettuce",
    name: "Lettuce",
    tempMin: 15,
    tempMax: 21,
    humidityMin: 40,
    humidityMax: 60,
    waterLevel: 75,
    icon: "🥬",
  },
  {
    id: "pepper",
    name: "Bell Pepper",
    tempMin: 21,
    tempMax: 29,
    humidityMin: 50,
    humidityMax: 70,
    waterLevel: 60,
    icon: "🌶️",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    tempMin: 15,
    tempMax: 26,
    humidityMin: 60,
    humidityMax: 80,
    waterLevel: 80,
    icon: "🍓",
  },
];
