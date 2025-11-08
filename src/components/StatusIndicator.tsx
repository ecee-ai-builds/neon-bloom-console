import { Activity, WifiOff } from "lucide-react";

interface StatusIndicatorProps {
  isOnline: boolean;
  lastUpdate: string | null;
}

export const StatusIndicator = ({ isOnline, lastUpdate }: StatusIndicatorProps) => {
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      });
    } catch {
      return "Invalid time";
    }
  };

  return (
    <div className="card-cyber rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isOnline ? (
          <Activity className="w-5 h-5 text-success animate-pulse" />
        ) : (
          <WifiOff className="w-5 h-5 text-destructive" />
        )}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">System Status</p>
          <p className={`font-bold ${isOnline ? "text-success" : "text-destructive"}`}>
            {isOnline ? "ONLINE" : "OFFLINE"}
          </p>
        </div>
      </div>
      
      {lastUpdate && (
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Update</p>
          <p className="font-bold text-primary">{formatTime(lastUpdate)}</p>
        </div>
      )}
    </div>
  );
};
