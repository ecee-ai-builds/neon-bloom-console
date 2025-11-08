import { PlantProfile, PLANT_PROFILES } from "@/types/plant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlantSelectorProps {
  selectedPlant: PlantProfile;
  onSelectPlant: (plant: PlantProfile) => void;
}

export const PlantSelector = ({ selectedPlant, onSelectPlant }: PlantSelectorProps) => {
  return (
    <div className="card-cyber rounded-lg p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Active Plant Profile
      </h2>
      
      <div className="flex items-center gap-4">
        <div className="text-6xl">{selectedPlant.icon}</div>
        <div className="flex-1">
          <Select
            value={selectedPlant.id}
            onValueChange={(value) => {
              const plant = PLANT_PROFILES.find(p => p.id === value);
              if (plant) onSelectPlant(plant);
            }}
          >
            <SelectTrigger className="w-full border-primary/30 bg-input text-foreground font-bold text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/30">
              {PLANT_PROFILES.map((plant) => (
                <SelectItem 
                  key={plant.id} 
                  value={plant.id}
                  className="font-mono text-foreground hover:bg-primary/10 focus:bg-primary/20"
                >
                  <span className="flex items-center gap-2">
                    <span>{plant.icon}</span>
                    <span>{plant.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-input/50 p-2 rounded">
              <span className="text-muted-foreground">Temp Range:</span>
              <p className="text-primary font-bold">{selectedPlant.tempMin}°-{selectedPlant.tempMax}°C</p>
            </div>
            <div className="bg-input/50 p-2 rounded">
              <span className="text-muted-foreground">Humidity:</span>
              <p className="text-primary font-bold">{selectedPlant.humidityMin}-{selectedPlant.humidityMax}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
