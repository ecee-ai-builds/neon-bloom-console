import { Droplet, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ControlButtonsProps {
  onWater: () => void;
  onLight: () => void;
  isLightOn: boolean;
}

export const ControlButtons = ({ onWater, onLight, isLightOn }: ControlButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={onWater}
        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider py-6 text-lg"
      >
        <Droplet className="w-6 h-6 mr-2" />
        WATER
      </Button>
      
      <Button
        onClick={onLight}
        className={`flex-1 font-bold uppercase tracking-wider py-6 text-lg ${
          isLightOn
            ? "bg-accent hover:bg-accent/90 text-accent-foreground"
            : "bg-muted hover:bg-muted/90 text-muted-foreground"
        }`}
      >
        <Lightbulb className="w-6 h-6 mr-2" />
        LIGHT {isLightOn ? "ON" : "OFF"}
      </Button>
    </div>
  );
};
