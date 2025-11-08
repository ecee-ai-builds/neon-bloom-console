import { useState, useEffect } from "react";
import { Thermometer, Droplets, Droplet } from "lucide-react";
import { PlantSelector } from "@/components/PlantSelector";
import { MetricCard } from "@/components/MetricCard";
import { StatusIndicator } from "@/components/StatusIndicator";
import { PLANT_PROFILES, PlantProfile, SensorData } from "@/types/plant";

const Index = () => {
  const [selectedPlant, setSelectedPlant] = useState<PlantProfile>(PLANT_PROFILES[0]);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [waterLevel, setWaterLevel] = useState<number>(75); // Simulated for now

  // Mock data polling - Replace with actual API call to your Raspberry Pi
  useEffect(() => {
    const fetchSensorData = () => {
      // For demo purposes, we'll use mock data
      // In production, this would fetch from: http://your-raspberry-pi/ai_garden/latest.json
      const mockData: SensorData = {
        timestamp: new Date().toISOString(),
        temp_c: 22.5 + (Math.random() * 4 - 2), // Random temp around 22.5°C
        humidity_percent: 65 + (Math.random() * 10 - 5), // Random humidity around 65%
        ok: Math.random() > 0.1, // 90% uptime
        error: null,
      };
      setSensorData(mockData);
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 2000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary glow-cyan mb-2 uppercase tracking-wider">
            PLANT.AI
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest text-sm">
            Climate Control System v1.0
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
        </header>

        {/* Status Bar */}
        <StatusIndicator 
          isOnline={sensorData?.ok ?? false} 
          lastUpdate={sensorData?.timestamp ?? null}
        />

        {/* Plant Selector */}
        <PlantSelector 
          selectedPlant={selectedPlant} 
          onSelectPlant={setSelectedPlant}
        />

        {/* Metrics Grid */}
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

        {/* Info Footer */}
        <div className="card-cyber rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary">●</span> Real-time monitoring
            <span className="mx-4">|</span>
            <span className="text-secondary">●</span> Auto-adjusting climate
            <span className="mx-4">|</span>
            <span className="text-accent">●</span> Plant-optimized care
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
