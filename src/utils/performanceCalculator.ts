import { TrainingData, PredictionResult, HeartRateZone, TrainingRecommendation } from "@/types/training";

// Conversion temps en minutes
function parseTimeToMinutes(timeString: string): number {
  const parts = timeString.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] + parts[1] / 60;
  } else if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 60;
  }
  return 0;
}

// Calcul de la VMA basé sur un chrono réel (formule de Léger)
function calculateVMAFromPerformance(distance: number, timeInMinutes: number): number {
  const speedKmh = distance / (timeInMinutes / 60);
  
  // Formules adaptées selon la distance
  if (distance === 5) {
    return speedKmh * 1.05; // VMA ≈ vitesse 5km + 5%
  } else if (distance === 10) {
    return speedKmh * 1.1; // VMA ≈ vitesse 10km + 10%
  } else if (distance === 21.1) {
    return speedKmh * 1.2; // VMA ≈ vitesse semi + 20%
  } else if (distance === 42.2) {
    return speedKmh * 1.3; // VMA ≈ vitesse marathon + 30%
  }
  return speedKmh * 1.1;
}

// Calcul VO₂max basé sur VMA et données personnelles
function calculateVO2Max(vma: number, heartRateData: { max: number; rest: number }, weight: number): number {
  // Formule : VO₂max = 15 × (FCmax / FCrepos) ajusté par VMA
  const baseVO2 = 15 * (heartRateData.max / heartRateData.rest);
  const vmaFactor = vma / 15; // Facteur basé sur VMA (15 km/h = référence)
  return baseVO2 * vmaFactor * (70 / weight); // Ajustement poids
}

// Calcul temps prédit pour une distance (formule de Riegel améliorée)
function predictTimeForDistance(referenceDistance: number, referenceTime: number, targetDistance: number, improvement: number = 0): number {
  const factor = Math.pow(targetDistance / referenceDistance, 1.06);
  const predictedTime = referenceTime * factor;
  return predictedTime * (1 - improvement);
}

// Calcul de l'amélioration réaliste basée sur l'entraînement
function calculateRealisticImprovement(data: TrainingData, months: number): number {
  let baseImprovement = 0;
  
  // Amélioration due au volume d'entraînement
  if (data.weeklyVolume >= 80) baseImprovement += 0.15;
  else if (data.weeklyVolume >= 60) baseImprovement += 0.12;
  else if (data.weeklyVolume >= 40) baseImprovement += 0.08;
  else if (data.weeklyVolume >= 20) baseImprovement += 0.05;
  
  // Amélioration due à l'intensité
  const intensityBonus = {
    'facile': 0.02,
    'modérée': 0.05,
    'difficile': 0.08
  };
  baseImprovement += intensityBonus[data.intensity];
  
  // Amélioration due à la perte de poids
  const weightLossImpact = (data.currentWeight - data.targetWeight) * 0.02;
  baseImprovement += weightLossImpact;
  
  // Progression temporelle (logarithmique)
  const timeProgression = Math.log(months + 1) / Math.log(7); // Plateau après 6 mois
  
  return Math.min(baseImprovement * timeProgression, 0.20); // Max 20% d'amélioration
}

// Calcul des zones cardiaques
export function calculateHeartRateZones(maxHR: number, restHR: number): HeartRateZone[] {
  const hrReserve = maxHR - restHR;
  
  return [
    {
      name: "Zone 1 - Récupération",
      minHR: Math.round(restHR + hrReserve * 0.5),
      maxHR: Math.round(restHR + hrReserve * 0.6),
      percentage: "50-60%",
      purpose: "Récupération active, footing très facile",
      color: "blue"
    },
    {
      name: "Zone 2 - Endurance",
      minHR: Math.round(restHR + hrReserve * 0.6),
      maxHR: Math.round(restHR + hrReserve * 0.7),
      percentage: "60-70%",
      purpose: "Endurance fondamentale, 80% de l'entraînement",
      color: "green"
    },
    {
      name: "Zone 3 - Tempo",
      minHR: Math.round(restHR + hrReserve * 0.7),
      maxHR: Math.round(restHR + hrReserve * 0.8),
      percentage: "70-80%",
      purpose: "Allure marathon, tempo runs",
      color: "orange"
    },
    {
      name: "Zone 4 - Seuil",
      minHR: Math.round(restHR + hrReserve * 0.8),
      maxHR: Math.round(restHR + hrReserve * 0.9),
      percentage: "80-90%",
      purpose: "Seuil lactique, allure semi-marathon",
      color: "red"
    },
    {
      name: "Zone 5 - VMA",
      minHR: Math.round(restHR + hrReserve * 0.9),
      maxHR: maxHR,
      percentage: "90-100%",
      purpose: "Fractionné, vitesse maximale",
      color: "purple"
    }
  ];
}

// Génération des recommandations d'entraînement
export function generateTrainingRecommendations(data: TrainingData, vma: number): TrainingRecommendation[] {
  const zones = calculateHeartRateZones(data.maxHeartRate, data.restingHeartRate);
  
  return [
    {
      type: "Footing Endurance",
      duration: "45-90 min",
      intensity: zones[1].name,
      heartRate: `${zones[1].minHR}-${zones[1].maxHR} bpm`,
      pace: `${(vma * 0.65).toFixed(1)}-${(vma * 0.75).toFixed(1)} km/h`,
      purpose: "Développer l'endurance, 70% de vos sorties"
    },
    {
      type: "Sortie Longue",
      duration: "90-180 min",
      intensity: zones[0].name + " / " + zones[1].name,
      heartRate: `${zones[0].minHR}-${zones[1].maxHR} bpm`,
      pace: `${(vma * 0.60).toFixed(1)}-${(vma * 0.70).toFixed(1)} km/h`,
      purpose: "Endurance, habituer le corps aux longues distances"
    },
    {
      type: "Séance Tempo",
      duration: "20-40 min",
      intensity: zones[2].name,
      heartRate: `${zones[2].minHR}-${zones[2].maxHR} bpm`,
      pace: `${(vma * 0.82).toFixed(1)}-${(vma * 0.88).toFixed(1)} km/h`,
      purpose: "Améliorer l'endurance à allure soutenue"
    },
    {
      type: "Fractionné VMA",
      duration: "8x400m ou 5x1000m",
      intensity: zones[4].name,
      heartRate: `${zones[4].minHR}-${zones[4].maxHR} bpm`,
      pace: `${(vma * 0.95).toFixed(1)}-${vma.toFixed(1)} km/h`,
      purpose: "Développer la VO₂max et la vitesse"
    }
  ];
}

export function calculatePerformancePredictions(data: TrainingData): PredictionResult[] {
  const referenceTimeMinutes = parseTimeToMinutes(data.lastRaceTime);
  const vma = calculateVMAFromPerformance(data.lastRaceDistance, referenceTimeMinutes);
  const vo2max = calculateVO2Max(vma, { max: data.maxHeartRate, rest: data.restingHeartRate }, data.currentWeight);
  
  const distances = [
    { name: "5 km", distance: 5, color: "blue" },
    { name: "10 km", distance: 10, color: "green" },
    { name: "Semi-marathon", distance: 21.1, color: "orange" },
    { name: "Marathon", distance: 42.2, color: "purple" }
  ];
  
  return distances.map(({ name, distance, color }) => {
    // Temps actuel prédit pour cette distance
    const currentTime = predictTimeForDistance(data.lastRaceDistance, referenceTimeMinutes, distance);
    
    // Calcul des améliorations réalistes
    const oneMonthImprovement = calculateRealisticImprovement(data, 1);
    const threeMonthsImprovement = calculateRealisticImprovement(data, 3);
    const sixMonthsImprovement = calculateRealisticImprovement(data, 6);
    
    // Temps futurs
    const oneMonthTime = predictTimeForDistance(data.lastRaceDistance, referenceTimeMinutes, distance, oneMonthImprovement);
    const threeMonthsTime = predictTimeForDistance(data.lastRaceDistance, referenceTimeMinutes, distance, threeMonthsImprovement);
    const sixMonthsTime = predictTimeForDistance(data.lastRaceDistance, referenceTimeMinutes, distance, sixMonthsImprovement);
    
    // Calcul de l'amélioration totale
    const totalImprovement = ((currentTime - sixMonthsTime) / currentTime * 100).toFixed(1);
    
    return {
      distance: name,
      current: formatTime(currentTime),
      oneMonth: formatTime(oneMonthTime),
      threeMonths: formatTime(threeMonthsTime),
      sixMonths: formatTime(sixMonthsTime),
      improvement: `-${totalImprovement}%`,
      color,
      targetPace: `${(distance / (sixMonthsTime / 60)).toFixed(1)} km/h`,
      recommendedPace: `${(vma * 0.85).toFixed(1)} km/h`
    };
  });
}

// Génération des données pour le graphique
export function generateChartData(data: TrainingData) {
  const referenceTimeMinutes = parseTimeToMinutes(data.lastRaceTime);
  
  const timePoints = [
    { month: "Maintenant", improvement: 0 },
    { month: "1 mois", improvement: calculateRealisticImprovement(data, 1) },
    { month: "3 mois", improvement: calculateRealisticImprovement(data, 3) },
    { month: "6 mois", improvement: calculateRealisticImprovement(data, 6) }
  ];
  
  return timePoints.map(point => ({
    month: point.month,
    "5km": predictTimeForDistance(data.lastRaceDistance, referenceTimeMinutes, 5, point.improvement),
    "10km": predictTimeForDistance(data.lastRaceDistance, referenceTimeMinutes, 10, point.improvement),
    "Semi": predictTimeForDistance(data.lastRaceDistance, referenceTimeMinutes, 21.1, point.improvement),
    "Marathon": predictTimeForDistance(data.lastRaceDistance, referenceTimeMinutes, 42.2, point.improvement)
  }));
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60);
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}