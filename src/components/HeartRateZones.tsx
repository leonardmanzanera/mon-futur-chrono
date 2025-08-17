import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartRateZone } from "@/types/training";
import { ZONE_COLORS, BADGE_COLORS } from "@/utils/colorMappings";

interface HeartRateZonesProps {
  zones: HeartRateZone[];
  vma: number;
}

export function HeartRateZones({ zones, vma }: HeartRateZonesProps) {
  const calculatePaceForZone = (zoneName: string): string => {
    switch (zoneName) {
      case "Zone 1 - Récupération":
        return `${(vma * 0.6).toFixed(1)}-${(vma * 0.65).toFixed(1)} km/h`;
      case "Zone 2 - Endurance":
        return `${(vma * 0.65).toFixed(1)}-${(vma * 0.75).toFixed(1)} km/h`;
      case "Zone 3 - Tempo":
        return `${(vma * 0.80).toFixed(1)}-${(vma * 0.85).toFixed(1)} km/h`;
      case "Zone 4 - Seuil":
        return `${(vma * 0.85).toFixed(1)}-${(vma * 0.92).toFixed(1)} km/h`;
      case "Zone 5 - VMA":
        return `${(vma * 0.95).toFixed(1)}-${vma.toFixed(1)} km/h`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Vos zones d'entraînement cardiaques
        </h3>
        <p className="text-muted-foreground mb-4">
          Votre VMA estimée : <span className="text-accent font-bold">{vma.toFixed(1)} km/h</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone, index) => (
          <Card 
            key={index}
            className={`glass-card p-6 hover-scale transition-smooth bg-gradient-to-br ${
              ZONE_COLORS[zone.color] || ZONE_COLORS.blue
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-foreground">
                  {zone.name}
                </h4>
                <Badge className={`${BADGE_COLORS[zone.color] || BADGE_COLORS.blue} border`}>
                  {zone.percentage}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fréquence cardiaque</span>
                  <span className="font-mono text-foreground font-medium">
                    {zone.minHR}-{zone.maxHR} bpm
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Allure recommandée</span>
                  <span className="font-mono text-accent font-medium text-sm">
                    {calculatePaceForZone(zone.name)}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">
                    {zone.purpose}
                  </p>
                </div>
              </div>

              <div className="w-full bg-secondary/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    zone.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    zone.color === 'green' ? 'from-green-500 to-green-600' :
                    zone.color === 'orange' ? 'from-orange-500 to-orange-600' :
                    zone.color === 'red' ? 'from-red-500 to-red-600' :
                    'from-purple-500 to-purple-600'
                  }`}
                  style={{ width: `${60 + index * 8}%` }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}