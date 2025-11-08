import { useState, useEffect } from "react";
import { Thermometer, Droplets } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { SensorData } from "@/types/plant";

const Index = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  
  // Target ranges for environmental control
  const targetTemp = { min: 18, max: 27 };
  const targetHumidity = { min: 60, max: 80 };

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold uppercase tracking-wider text-foreground">
            Command Center
          </h1>
          <p className="text-muted-foreground uppercase text-sm tracking-wider">
            Environmental Control System
          </p>
        </div>

        {/* Environmental Metrics */}
        <div className="card-tactical rounded-lg p-8">
          <h2 className="text-lg font-bold uppercase tracking-wider text-foreground mb-6 text-center">
            Environmental Monitoring
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MetricCard
              icon={Thermometer}
              label="Temperature"
              value={sensorData?.temp_c ?? null}
              unit="°C"
              min={targetTemp.min}
              max={targetTemp.max}
              status={getMetricStatus(
                sensorData?.temp_c ?? null,
                targetTemp.min,
                targetTemp.max
              )}
            />
            
            <MetricCard
              icon={Droplets}
              label="Humidity"
              value={sensorData?.humidity_percent ?? null}
              unit="%"
              min={targetHumidity.min}
              max={targetHumidity.max}
              status={getMetricStatus(
                sensorData?.humidity_percent ?? null,
                targetHumidity.min,
                targetHumidity.max
              )}
            />
          </div>
        </div>

        {/* System Status */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Last updated: {sensorData?.timestamp ? new Date(sensorData.timestamp).toLocaleTimeString() : '--'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
