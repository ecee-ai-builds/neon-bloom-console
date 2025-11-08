import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: number | null;
  unit: string;
  min: number;
  max: number;
  status: "optimal" | "warning" | "critical" | "offline";
}

export const MetricCard = ({ icon: Icon, label, value, unit, min, max, status }: MetricCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "optimal":
        return "text-success";
      case "warning":
        return "text-warning";
      case "critical":
        return "text-destructive";
      case "offline":
        return "text-muted-foreground";
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case "optimal":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "critical":
        return "bg-destructive";
      case "offline":
        return "bg-muted";
    }
  };

  const calculateProgress = () => {
    if (value === null) return 0;
    const range = max - min;
    const normalized = ((value - min) / range) * 100;
    return Math.max(0, Math.min(100, normalized));
  };

  return (
    <div className="card-cyber rounded-lg p-6 transition-all hover:border-glow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded ${getStatusColor()} bg-card`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{label}</h3>
            <p className={`text-3xl font-bold ${getStatusColor()} glow-cyan`}>
              {value !== null ? `${value}${unit}` : "--"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>MIN: {min}{unit}</span>
          <span>MAX: {max}{unit}</span>
        </div>
        
        <div className="h-2 bg-input rounded-full overflow-hidden relative">
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-500 relative`}
            style={{ width: `${calculateProgress()}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`text-xs font-bold uppercase tracking-wider ${getStatusColor()}`}>
            {status}
          </span>
          <span className="text-xs text-muted-foreground">
            Target: {min}-{max}{unit}
          </span>
        </div>
      </div>
    </div>
  );
};
