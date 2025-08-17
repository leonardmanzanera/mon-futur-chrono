import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrainingData } from "@/types/training";
import { parseTimeToSeconds } from "@/utils/performanceCalculator";

interface TrainingFormProps {
  onCalculate: (data: TrainingData) => void;
}

export function TrainingForm({ onCalculate }: TrainingFormProps) {
  interface FormState {
    weeklyVolume: string;
    intensity: string;
    currentWeight: string;
    targetWeight: string;
    lastRaceDistance: string;
    lastRaceTime: string;
    maxHeartRate: string;
    restingHeartRate: string;
  }

  const [form, setForm] = useState<FormState>({
    weeklyVolume: "",
    intensity: "",
    currentWeight: "",
    targetWeight: "",
    lastRaceDistance: "",
    lastRaceTime: "",
    maxHeartRate: "",
    restingHeartRate: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const updateField = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.lastRaceDistance) newErrors.lastRaceDistance = "Distance requise";
    if (!form.lastRaceTime || isNaN(parseTimeToSeconds(form.lastRaceTime))) {
      newErrors.lastRaceTime = "Temps invalide (MM:SS ou HH:MM:SS)";
    }
    if (!form.maxHeartRate) newErrors.maxHeartRate = "Fréquence max requise";
    if (!form.restingHeartRate) newErrors.restingHeartRate = "Fréquence de repos requise";
    if (!form.weeklyVolume) newErrors.weeklyVolume = "Volume requis";
    if (!form.intensity) newErrors.intensity = "Intensité requise";
    if (!form.currentWeight) newErrors.currentWeight = "Poids actuel requis";
    if (!form.targetWeight) newErrors.targetWeight = "Poids objectif requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    onCalculate({
      weeklyVolume: Number(form.weeklyVolume),
      intensity: form.intensity as 'facile' | 'modérée' | 'difficile',
      currentWeight: Number(form.currentWeight),
      targetWeight: Number(form.targetWeight),
      lastRaceDistance: Number(form.lastRaceDistance),
      lastRaceTime: form.lastRaceTime,
      maxHeartRate: Number(form.maxHeartRate),
      restingHeartRate: Number(form.restingHeartRate)
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
                <Select value={form.lastRaceDistance} onValueChange={updateField('lastRaceDistance')}>
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
                {errors.lastRaceDistance && (
                  <p className="text-sm text-red-500">{errors.lastRaceDistance}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastRaceTime" className="text-foreground font-medium">
                  Votre temps (ex: 25:30 ou 1:45:20)
                </Label>
                <Input
                  id="lastRaceTime"
                  type="text"
                  value={form.lastRaceTime}
                  onChange={(e) => updateField('lastRaceTime')(e.target.value)}
                  placeholder="MM:SS ou HH:MM:SS"
                  className="bg-secondary/50 border-border"
                />
                {errors.lastRaceTime && (
                  <p className="text-sm text-red-500">{errors.lastRaceTime}</p>
                )}
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
                  value={form.maxHeartRate}
                  onChange={(e) => updateField('maxHeartRate')(e.target.value)}
                  placeholder="Ex: 185"
                  className="bg-secondary/50 border-border"
                />
                {errors.maxHeartRate && (
                  <p className="text-sm text-red-500">{errors.maxHeartRate}</p>
                )}
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
                  value={form.restingHeartRate}
                  onChange={(e) => updateField('restingHeartRate')(e.target.value)}
                  placeholder="Ex: 60"
                  className="bg-secondary/50 border-border"
                />
                {errors.restingHeartRate && (
                  <p className="text-sm text-red-500">{errors.restingHeartRate}</p>
                )}
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
                <Label htmlFor="weeklyVolume" className="text-foreground font-medium">
                  Volume hebdomadaire (km/semaine)
                </Label>
                <Input
                  id="weeklyVolume"
                  type="number"
                  value={form.weeklyVolume}
                  onChange={(e) => updateField('weeklyVolume')(e.target.value)}
                  placeholder="Ex: 50"
                  className="bg-secondary/50 border-border"
                />
                {errors.weeklyVolume && (
                  <p className="text-sm text-red-500">{errors.weeklyVolume}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity" className="text-foreground font-medium">
                  Intensité moyenne
                </Label>
                <Select value={form.intensity} onValueChange={updateField('intensity')}>
                  <SelectTrigger className="bg-secondary/50 border-border">
                    <SelectValue placeholder="Choisir l'intensité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facile">Facile (80% footing)</SelectItem>
                    <SelectItem value="modérée">Modérée (1-2 séances/semaine)</SelectItem>
                    <SelectItem value="difficile">Difficile (3+ séances/semaine)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.intensity && (
                  <p className="text-sm text-red-500">{errors.intensity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentWeight" className="text-foreground font-medium">
                  Poids actuel (kg)
                </Label>
                <Input
                  id="currentWeight"
                  type="number"
                  value={form.currentWeight}
                  onChange={(e) => updateField('currentWeight')(e.target.value)}
                  placeholder="Ex: 70"
                  className="bg-secondary/50 border-border"
                />
                {errors.currentWeight && (
                  <p className="text-sm text-red-500">{errors.currentWeight}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetWeight" className="text-foreground font-medium">
                  Poids objectif (kg)
                </Label>
                <Input
                  id="targetWeight"
                  type="number"
                  value={form.targetWeight}
                  onChange={(e) => updateField('targetWeight')(e.target.value)}
                  placeholder="Ex: 68"
                  className="bg-secondary/50 border-border"
                />
                {errors.targetWeight && (
                  <p className="text-sm text-red-500">{errors.targetWeight}</p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg transition-smooth hover-scale"
            disabled={Object.values(form).some(v => !v)}
          >
            🚀 Analyser mes performances et prédictions
          </Button>
        </form>
      </div>
    </Card>
  );
}