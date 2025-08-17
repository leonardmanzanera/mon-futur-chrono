import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainingRecommendation } from "@/types/training";

interface TrainingRecommendationsProps {
  recommendations: TrainingRecommendation[];
  weeklyVolume: number;
}

export function TrainingRecommendations({ recommendations, weeklyVolume }: TrainingRecommendationsProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Footing Endurance":
        return "🏃‍♂️";
      case "Sortie Longue":
        return "🎯";
      case "Séance Tempo":
        return "⚡";
      case "Fractionné VMA":
        return "🚀";
      default:
        return "🏃";
    }
  };

  const getFrequency = (type: string, volume: number) => {
    if (type === "Footing Endurance") {
      return volume >= 60 ? "4-5 fois/semaine" : volume >= 40 ? "3-4 fois/semaine" : "2-3 fois/semaine";
    } else if (type === "Sortie Longue") {
      return "1 fois/semaine";
    } else if (type === "Séance Tempo") {
      return volume >= 50 ? "1-2 fois/semaine" : "1 fois/semaine";
    } else if (type === "Fractionné VMA") {
      return volume >= 60 ? "1-2 fois/semaine" : "1 fois/2 semaines";
    }
    return "Selon niveau";
  };

  const getIntensityColor = (intensity: string) => {
    if (intensity.includes("Récupération") || intensity.includes("Endurance")) {
      return "bg-green-500/20 text-green-400 border-green-500/30";
    } else if (intensity.includes("Tempo")) {
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    } else if (intensity.includes("Seuil")) {
      return "bg-red-500/20 text-red-400 border-red-500/30";
    } else if (intensity.includes("VMA")) {
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    }
    return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Plan d'entraînement personnalisé
        </h3>
        <p className="text-muted-foreground">
          Basé sur votre volume hebdomadaire de {weeklyVolume} km
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => (
          <Card key={index} className="glass-card p-6 hover-scale transition-smooth">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(rec.type)}</span>
                  <h4 className="text-xl font-bold text-foreground">
                    {rec.type}
                  </h4>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {getFrequency(rec.type, weeklyVolume)}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Durée</span>
                  <span className="font-medium text-foreground">
                    {rec.duration}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Zone cardiaque</span>
                  <Badge className={`${getIntensityColor(rec.intensity)} text-xs`}>
                    {rec.intensity}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">FC cible</span>
                  <span className="font-mono text-accent font-medium text-sm">
                    {rec.heartRate}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Allure</span>
                  <span className="font-mono text-energy font-medium text-sm">
                    {rec.pace}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Objectif :</span> {rec.purpose}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 glass-card">
        <h4 className="text-lg font-semibold text-foreground mb-4">💡 Conseils d'entraînement</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              <span className="text-accent font-medium">80/20 :</span> 80% de votre temps en zones 1-2 (facile), 20% en zones 3-5 (intense)
            </p>
            <p className="text-muted-foreground">
              <span className="text-energy font-medium">Progression :</span> Augmentez votre volume de 10% maximum par semaine
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              <span className="text-primary font-medium">Récupération :</span> Prenez au moins 1 jour de repos par semaine
            </p>
            <p className="text-muted-foreground">
              <span className="text-destructive font-medium">Écoute :</span> Adaptez l'intensité selon vos sensations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}