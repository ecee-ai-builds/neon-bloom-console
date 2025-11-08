import { useState } from "react";
import { Activity, Wifi, Clock, Server, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SystemStatus {
  connected: boolean;
  latency: number | null;
  lastCheck: string | null;
  status: "online" | "offline" | "warning";
}

const Systems = () => {
  const [raspberryPiUrl, setRaspberryPiUrl] = useState<string>("http://192.168.1.100/ai_garden/latest.json");
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    connected: false,
    latency: null,
    lastCheck: null,
    status: "offline",
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(raspberryPiUrl, {
        method: "GET",
        signal: controller.signal,
        mode: "cors",
      });

      clearTimeout(timeoutId);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (response.ok) {
        const data = await response.json();
        
        setSystemStatus({
          connected: true,
          latency,
          lastCheck: new Date().toISOString(),
          status: latency < 100 ? "online" : latency < 500 ? "warning" : "online",
        });

        toast.success("Connection successful", {
          description: `Raspberry Pi responding in ${latency}ms`,
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      setSystemStatus({
        connected: false,
        latency: latency > 5000 ? null : latency,
        lastCheck: new Date().toISOString(),
        status: "offline",
      });

      if (error instanceof Error && error.name === "AbortError") {
        toast.error("Connection timeout", {
          description: "Raspberry Pi not responding (timeout after 5s)",
        });
      } else {
        toast.error("Connection failed", {
          description: `Unable to reach Raspberry Pi: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus.status) {
      case "online":
        return <CheckCircle className="w-8 h-8 text-success" />;
      case "warning":
        return <AlertCircle className="w-8 h-8 text-warning" />;
      case "offline":
        return <XCircle className="w-8 h-8 text-destructive" />;
    }
  };

  const getStatusColor = () => {
    switch (systemStatus.status) {
      case "online":
        return "text-success";
      case "warning":
        return "text-warning";
      case "offline":
        return "text-destructive";
    }
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "--";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch {
      return "--";
    }
  };

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-4rem)] overflow-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground uppercase tracking-wider mb-2">
          SYSTEMS DIAGNOSTICS
        </h1>
        <p className="text-sm text-muted-foreground uppercase">
          Raspberry Pi Connection & Health Monitoring
        </p>
      </div>

      {/* Connection Configuration */}
      <div className="card-tactical rounded p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <Server className="w-4 h-4" />
          RASPBERRY PI CONFIGURATION
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase block mb-2">
              Sensor Data Endpoint URL
            </label>
            <Input
              type="text"
              value={raspberryPiUrl}
              onChange={(e) => setRaspberryPiUrl(e.target.value)}
              placeholder="http://192.168.1.100/ai_garden/latest.json"
              className="font-mono text-sm bg-input border-border"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enter the full URL to your Raspberry Pi's latest.json endpoint
            </p>
          </div>

          <Button
            onClick={checkConnection}
            disabled={isChecking || !raspberryPiUrl}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider"
          >
            {isChecking ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                CHECKING CONNECTION...
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-2" />
                TEST CONNECTION
              </>
            )}
          </Button>
        </div>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Connection Status */}
        <div className="card-tactical rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              CONNECTION STATUS
            </h3>
            {getStatusIcon()}
          </div>
          <p className={`text-2xl font-bold uppercase ${getStatusColor()}`}>
            {systemStatus.status}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {systemStatus.connected ? "Raspberry Pi is reachable" : "Unable to reach Raspberry Pi"}
          </p>
        </div>

        {/* Latency */}
        <div className="card-tactical rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              NETWORK LATENCY
            </h3>
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {systemStatus.latency !== null ? `${systemStatus.latency}ms` : "--"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {systemStatus.latency === null
              ? "No data available"
              : systemStatus.latency < 100
              ? "Excellent response time"
              : systemStatus.latency < 500
              ? "Acceptable response time"
              : "High latency detected"}
          </p>
        </div>

        {/* Last Check */}
        <div className="card-tactical rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              LAST CHECK
            </h3>
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatTimestamp(systemStatus.lastCheck)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {systemStatus.lastCheck ? "Last connection test" : "No tests performed yet"}
          </p>
        </div>
      </div>

      {/* System Information */}
      <div className="card-tactical rounded p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <Server className="w-4 h-4" />
          SYSTEM INFORMATION
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-input/30 p-4 rounded">
            <p className="text-xs text-muted-foreground uppercase mb-1">Hardware</p>
            <p className="text-sm text-foreground font-bold">Raspberry Pi 4/5</p>
          </div>

          <div className="bg-input/30 p-4 rounded">
            <p className="text-xs text-muted-foreground uppercase mb-1">Sensor</p>
            <p className="text-sm text-foreground font-bold">DHT22 (GPIO 4)</p>
          </div>

          <div className="bg-input/30 p-4 rounded">
            <p className="text-xs text-muted-foreground uppercase mb-1">Update Interval</p>
            <p className="text-sm text-foreground font-bold">2 seconds</p>
          </div>

          <div className="bg-input/30 p-4 rounded">
            <p className="text-xs text-muted-foreground uppercase mb-1">Data Format</p>
            <p className="text-sm text-foreground font-bold">JSON</p>
          </div>

          <div className="bg-input/30 p-4 rounded md:col-span-2">
            <p className="text-xs text-muted-foreground uppercase mb-1">Expected Response</p>
            <pre className="text-xs text-foreground font-mono bg-background p-2 rounded mt-2 overflow-x-auto">
{`{
  "timestamp": "2025-11-08T15:23:12",
  "temp_c": 28,
  "humidity_percent": 64,
  "ok": true,
  "error": null
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="card-tactical rounded p-6 bg-destructive/10 border-destructive/30">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
          ⚠️ TROUBLESHOOTING
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Ensure Raspberry Pi is powered on and connected to the network</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Verify the sensor script (dht22_latest.py) is running</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Check that latest.json is accessible via HTTP (may need to set up web server)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Confirm firewall settings allow access to the Raspberry Pi</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Enable CORS on the Raspberry Pi web server if accessing from different origin</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Systems;
