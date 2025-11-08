import { useState, useEffect } from "react";
import { Thermometer, Droplets, Droplet } from "lucide-react";
import { PlantProfileCard } from "@/components/PlantProfileCard";
import { MetricCard } from "@/components/MetricCard";
import { ActivityLog } from "@/components/ActivityLog";
import { ControlButtons } from "@/components/ControlButtons";
import { PLANT_PROFILES, PlantProfile, SensorData } from "@/types/plant";
import { toast } from "sonner";

const Index = () => {
  const [selectedPlant, setSelectedPlant] = useState<PlantProfile>(PLANT_PROFILES[0]);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [waterLevel, setWaterLevel] = useState<number>(75);
  const [isLightOn, setIsLightOn] = useState<boolean>(false);
  const [activityLog, setActivityLog] = useState<Array<{timestamp: string; message: string; highlight?: string}>>([]);

  // Listen for plant updates from AI chat
  useEffect(() => {
    const handlePlantUpdate = (event: CustomEvent) => {
      const plantData = event.detail;
      
      // Create or update plant profile
      const newPlant: PlantProfile = {
        id: plantData.name.toLowerCase().replace(/\s+/g, "_"),
        name: plantData.name,
        tempMin: plantData.tempMin,
        tempMax: plantData.tempMax,
        humidityMin: plantData.humidityMin,
        humidityMax: plantData.humidityMax,
        waterLevel: plantData.waterLevel,
        icon: "🌱",
      };
      
      setSelectedPlant(newPlant);
      
      const logEntry = {
        timestamp: new Date().toISOString(),
        message: `Plant profile updated to ${plantData.name} via AI Integration`,
        highlight: plantData.name,
      };
      setActivityLog(prev => [logEntry, ...prev.slice(0, 9)]);
    };

    window.addEventListener("plantUpdated", handlePlantUpdate as EventListener);
    
    // Check for saved plant on mount
    const savedPlantData = localStorage.getItem("selectedPlantData");
    if (savedPlantData) {
      try {
        const plantData = JSON.parse(savedPlantData);
        const newPlant: PlantProfile = {
          id: plantData.name.toLowerCase().replace(/\s+/g, "_"),
          name: plantData.name,
          tempMin: plantData.tempMin,
          tempMax: plantData.tempMax,
          humidityMin: plantData.humidityMin,
          humidityMax: plantData.humidityMax,
          waterLevel: plantData.waterLevel,
          icon: "🌱",
        };
        setSelectedPlant(newPlant);
      } catch (error) {
        console.error("Failed to load saved plant:", error);
      }
    }

    return () => {
      window.removeEventListener("plantUpdated", handlePlantUpdate as EventListener);
    };
  }, []);

  // Mock data polling
  useEffect(() => {
    const fetchSensorData = () => {
      const mockData: SensorData = {
        timestamp: new Date().toISOString(),
        temp_c: 22.5 + (Math.random() * 4 - 2),
        humidity_percent: 65 + (Math.random() * 10 - 5),
        ok: Math.random() > 0.1,
        error: null,
      };
      setSensorData(mockData);
      
      // Add activity log entry occasionally
      if (Math.random() > 0.8) {
        const messages = [
          `Climate ${mockData.ok ? 'optimal' : 'warning'} for ${selectedPlant.name}`,
          `Temperature adjusted to ${mockData.temp_c?.toFixed(1)}°C`,
          `Humidity stabilized at ${mockData.humidity_percent?.toFixed(1)}%`,
          `Water level maintained at ${waterLevel}%`,
        ];
        const newEntry = {
          timestamp: mockData.timestamp,
          message: messages[Math.floor(Math.random() * messages.length)],
          highlight: selectedPlant.name,
        };
        setActivityLog(prev => [newEntry, ...prev.slice(0, 9)]);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 2000);
    return () => clearInterval(interval);
  }, [selectedPlant, waterLevel]);

  const getMetricStatus = (
    value: number | null,
    min: number,
    max: number
  ): "optimal" | "warning" | "critical" | "offline" => {
    if (value === null) return "offline";
    if (value >= min && value <= max) return "optimal";
    const deviation = Math.max(Math.abs(value - min), Math.abs(value - max));
    if (deviation < (max - min) * 0.2) return "warning";
    return "critical";
  };

  const handleWater = () => {
    const newWaterLevel = Math.min(100, waterLevel + 15);
    setWaterLevel(newWaterLevel);
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: `Watering initiated for ${selectedPlant.name} - Level increased to ${newWaterLevel}%`,
      highlight: selectedPlant.name,
    };
    setActivityLog(prev => [logEntry, ...prev.slice(0, 9)]);
    toast.success("Watering system activated", {
      description: `Water level increased to ${newWaterLevel}%`,
    });
  };

  const handleLight = () => {
    setIsLightOn(!isLightOn);
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: `Grow light ${!isLightOn ? 'activated' : 'deactivated'} for ${selectedPlant.name}`,
      highlight: selectedPlant.name,
    };
    setActivityLog(prev => [logEntry, ...prev.slice(0, 9)]);
    toast.success(`Light ${!isLightOn ? 'turned on' : 'turned off'}`, {
      description: `Grow light ${!isLightOn ? 'activated' : 'deactivated'}`,
    });
  };

  const handlePlantSelect = (plant: PlantProfile) => {
    setSelectedPlant(plant);
    localStorage.setItem("selectedPlantName", plant.name);
    localStorage.setItem("selectedPlantData", JSON.stringify({
      name: plant.name,
      tempMin: plant.tempMin,
      tempMax: plant.tempMax,
      humidityMin: plant.humidityMin,
      humidityMax: plant.humidityMax,
      waterLevel: plant.waterLevel,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Control Buttons */}
      <ControlButtons
        onWater={handleWater}
        onLight={handleLight}
        isLightOn={isLightOn}
      />

      {/* Plant Profile Cards - Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANT_PROFILES.slice(0, 3).map((plant) => (
          <PlantProfileCard
            key={plant.id}
            plant={plant}
            isActive={selectedPlant.id === plant.id}
            onClick={() => handlePlantSelect(plant)}
          />
        ))}
      </div>

      {/* Environmental Metrics */}
      <div className="card-tactical rounded p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
          ENVIRONMENTAL CONTROL
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            icon={Thermometer}
            label="Temperature"
            value={sensorData?.temp_c ?? null}
            unit="°C"
            min={selectedPlant.tempMin}
            max={selectedPlant.tempMax}
            status={getMetricStatus(
              sensorData?.temp_c ?? null,
              selectedPlant.tempMin,
              selectedPlant.tempMax
            )}
          />
          
          <MetricCard
            icon={Droplets}
            label="Humidity"
            value={sensorData?.humidity_percent ?? null}
            unit="%"
            min={selectedPlant.humidityMin}
            max={selectedPlant.humidityMax}
            status={getMetricStatus(
              sensorData?.humidity_percent ?? null,
              selectedPlant.humidityMin,
              selectedPlant.humidityMax
            )}
          />
          
          <MetricCard
            icon={Droplet}
            label="Water Level"
            value={waterLevel}
            unit="%"
            min={selectedPlant.waterLevel - 10}
            max={selectedPlant.waterLevel + 10}
            status={getMetricStatus(
              waterLevel,
              selectedPlant.waterLevel - 10,
              selectedPlant.waterLevel + 10
            )}
          />
        </div>
      </div>

      {/* Activity Log */}
      <ActivityLog entries={activityLog} />
    </div>
  );
};

export default Index;
