import { PlantProfile } from "@/types/plant";

interface PlantProfileCardProps {
  plant: PlantProfile;
  isActive: boolean;
  onClick: () => void;
}

export const PlantProfileCard = ({ plant, isActive, onClick }: PlantProfileCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`card-tactical rounded p-6 text-left transition-all hover:border-primary/50 w-full ${
        isActive ? "border-primary bg-card" : ""
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl">{plant.icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground uppercase tracking-wide">
            {plant.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${isActive ? "bg-success" : "bg-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground uppercase">
              {isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-input/30 p-2 rounded">
          <span className="text-muted-foreground uppercase block mb-1">Temp Range</span>
          <p className="text-foreground font-bold">{plant.tempMin}°-{plant.tempMax}°C</p>
        </div>
        <div className="bg-input/30 p-2 rounded">
          <span className="text-muted-foreground uppercase block mb-1">Humidity</span>
          <p className="text-foreground font-bold">{plant.humidityMin}-{plant.humidityMax}%</p>
        </div>
        <div className="bg-input/30 p-2 rounded col-span-2">
          <span className="text-muted-foreground uppercase block mb-1">Water Target</span>
          <p className="text-foreground font-bold">{plant.waterLevel}%</p>
        </div>
      </div>
    </button>
  );
};
