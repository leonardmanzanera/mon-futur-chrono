import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrainingData } from "@/types/training";

interface TrainingFormProps {
  onCalculate: (data: TrainingData) => void;
}

export function TrainingForm({ onCalculate }: TrainingFormProps) {
  // États existants
  const [weeklyVolume, setWeeklyVolume] = useState<string>("");
  const [intensity, setIntensity] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");
  
  // Nouveaux états pour performance actuelle
  const [lastRaceDistance, setLastRaceDistance] = useState<string>("");
  const [lastRaceTime, setLastRaceTime] = useState<string>("");
  
  // Nouveaux états pour données cardiaques
  const [maxHeartRate, setMaxHeartRate] = useState<string>("");
  const [restingHeartRate, setRestingHeartRate] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weeklyVolume || !intensity || !currentWeight || !targetWeight || 
        !lastRaceDistance || !lastRaceTime || !maxHeartRate || !restingHeartRate) return;
    
    onCalculate({
      weeklyVolume: Number(weeklyVolume),
      intensity: intensity as 'facile' | 'modérée' | 'difficile',
      currentWeight: Number(currentWeight),
      targetWeight: Number(targetWeight),
      lastRaceDistance: Number(lastRaceDistance),
      lastRaceTime: lastRaceTime,
      maxHeartRate: Number(maxHeartRate),
      restingHeartRate: Number(restingHeartRate)
    });
  };

  return (
    <Card className="glass-card p-8 glow-effect">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Analysez vos performances actuelles
          </h2>
          <p className="text-muted-foreground">
            Basé sur votre dernier chrono et données physiologiques pour des prédictions ultra-réalistes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Performance actuelle */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-accent">📊 Votre performance actuelle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="lastRaceDistance" className="text-foreground font-medium">
                  Distance de votre dernier chrono (km)
                </Label>
                <Select value={lastRaceDistance} onValueChange={setLastRaceDistance}>
                  <SelectTrigger className="bg-secondary/50 border-border">
                    <SelectValue placeholder="Choisir la distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 km</SelectItem>
                    <SelectItem value="10">10 km</SelectItem>
                    <SelectItem value="21.1">Semi-marathon (21.1 km)</SelectItem>
                    <SelectItem value="42.2">Marathon (42.2 km)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastRaceTime" className="text-foreground font-medium">
                  Votre temps (ex: 25:30 ou 1:45:20)
                </Label>
                <Input
                  id="lastRaceTime"
                  type="text"
                  value={lastRaceTime}
                  onChange={(e) => setLastRaceTime(e.target.value)}
                  placeholder="MM:SS ou HH:MM:SS"
                  className="bg-secondary/50 border-border"
                />
              </div>
            </div>
          </div>

          {/* Section Données cardiaques */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-energy">❤️ Données cardiaques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxHeartRate" className="text-foreground font-medium">
                  Fréquence cardiaque maximale (bpm)
                </Label>
                <Input
                  id="maxHeartRate"
                  type="number"
                  value={maxHeartRate}
                  onChange={(e) => setMaxHeartRate(e.target.value)}
                  placeholder="Ex: 185"
                  className="bg-secondary/50 border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Si inconnue : 220 - votre âge
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restingHeartRate" className="text-foreground font-medium">
                  Fréquence cardiaque de repos (bpm)
                </Label>
                <Input
                  id="restingHeartRate"
                  type="number"
                  value={restingHeartRate}
                  onChange={(e) => setRestingHeartRate(e.target.value)}
                  placeholder="Ex: 60"
                  className="bg-secondary/50 border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Mesurez au réveil, au calme
                </p>
              </div>
            </div>
          </div>

          {/* Section Entraînement */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">🏃‍♂️ Votre entraînement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="volume" className="text-foreground font-medium">
                  Volume hebdomadaire (km/semaine)
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
                    <SelectItem value="facile">Facile (80% footing)</SelectItem>
                    <SelectItem value="modérée">Modérée (1-2 séances/semaine)</SelectItem>
                    <SelectItem value="difficile">Difficile (3+ séances/semaine)</SelectItem>
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
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg transition-smooth hover-scale"
            disabled={!weeklyVolume || !intensity || !currentWeight || !targetWeight || 
                     !lastRaceDistance || !lastRaceTime || !maxHeartRate || !restingHeartRate}
          >
            🚀 Analyser mes performances et prédictions
          </Button>
        </form>
      </div>
    </Card>
  );
}