import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TrainingData {
  weeklyVolume: number;
  intensity: 'facile' | 'modérée' | 'difficile';
  currentWeight: number;
  targetWeight: number;
}

interface TrainingFormProps {
  onCalculate: (data: TrainingData) => void;
}

export function TrainingForm({ onCalculate }: TrainingFormProps) {
  const [weeklyVolume, setWeeklyVolume] = useState<string>("");
  const [intensity, setIntensity] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weeklyVolume || !intensity || !currentWeight || !targetWeight) return;
    
    onCalculate({
      weeklyVolume: Number(weeklyVolume),
      intensity: intensity as 'facile' | 'modérée' | 'difficile',
      currentWeight: Number(currentWeight),
      targetWeight: Number(targetWeight)
    });
  };

  return (
    <Card className="glass-card p-8 glow-effect">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Prédisez vos futurs chronos
          </h2>
          <p className="text-muted-foreground">
            Renseignez vos paramètres d'entraînement pour voir vos performances potentielles
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="volume" className="text-foreground font-medium">
                Volume d'entraînement (km/semaine)
              </Label>
              <Input
                id="volume"
                type="number"
                value={weeklyVolume}
                onChange={(e) => setWeeklyVolume(e.target.value)}
                placeholder="Ex: 50"
                className="bg-secondary/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intensity" className="text-foreground font-medium">
                Intensité moyenne
              </Label>
              <Select value={intensity} onValueChange={setIntensity}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Choisir l'intensité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facile">Facile (allure footing)</SelectItem>
                  <SelectItem value="modérée">Modérée (quelques séances)</SelectItem>
                  <SelectItem value="difficile">Difficile (entraînement intensif)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentWeight" className="text-foreground font-medium">
                Poids actuel (kg)
              </Label>
              <Input
                id="currentWeight"
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="Ex: 70"
                className="bg-secondary/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWeight" className="text-foreground font-medium">
                Poids objectif (kg)
              </Label>
              <Input
                id="targetWeight"
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="Ex: 68"
                className="bg-secondary/50 border-border"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg transition-smooth hover-scale"
            disabled={!weeklyVolume || !intensity || !currentWeight || !targetWeight}
          >
            🚀 Calculer mes performances futures
          </Button>
        </form>
      </div>
    </Card>
  );
}