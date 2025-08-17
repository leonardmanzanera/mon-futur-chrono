interface TrainingData {
  weeklyVolume: number;
  intensity: 'facile' | 'modérée' | 'difficile';
  currentWeight: number;
  targetWeight: number;
}

interface PredictionResult {
  distance: string;
  current: string;
  oneMonth: string;
  threeMonths: string;
  sixMonths: string;
  improvement: string;
  color: string;
}

// Estimation du VO₂max basé sur le volume et l'intensité d'entraînement
function estimateVO2Max(weeklyVolume: number, intensity: string): number {
  let baseVO2 = 35; // VO₂max de base pour un coureur débutant
  
  // Ajustement basé sur le volume hebdomadaire
  if (weeklyVolume >= 80) baseVO2 += 20;
  else if (weeklyVolume >= 60) baseVO2 += 15;
  else if (weeklyVolume >= 40) baseVO2 += 10;
  else if (weeklyVolume >= 20) baseVO2 += 5;
  
  // Ajustement basé sur l'intensité
  const intensityMultiplier = {
    'facile': 1.0,
    'modérée': 1.1,
    'difficile': 1.2
  };
  
  return baseVO2 * intensityMultiplier[intensity];
}

// Calcul du temps basé sur la formule de Riegel et autres équations
function calculateTime(distance: number, vo2max: number, weight: number): number {
  // Formule simplifiée : temps = distance / (vitesse basée sur VO₂max et poids)
  // Vitesse en km/h basée sur VO₂max
  const baseSpeed = (vo2max * 0.15) - 2; // Approximation
  
  // Ajustement pour le poids (moins de poids = plus rapide)
  const weightFactor = 70 / weight; // Référence à 70kg
  const adjustedSpeed = baseSpeed * Math.pow(weightFactor, 0.1);
  
  // Facteur de distance (les longues distances sont relativement plus lentes)
  const distanceFactor = Math.pow(distance / 5, 0.07);
  const finalSpeed = adjustedSpeed / distanceFactor;
  
  return (distance / finalSpeed) * 60; // Retour en minutes
}

// Progression réaliste au fil du temps
function calculateProgression(baseTime: number, months: number, weightProgress: number): number {
  // Amélioration due à l'entraînement (max 15% en 6 mois)
  const trainingImprovement = Math.min(0.15, months * 0.025);
  
  // Amélioration due à la perte de poids
  const weightImprovement = (1 - weightProgress) * 0.05;
  
  const totalImprovement = trainingImprovement + weightImprovement;
  return baseTime * (1 - totalImprovement);
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

export function calculatePerformancePredictions(data: TrainingData): PredictionResult[] {
  const currentVO2 = estimateVO2Max(data.weeklyVolume, data.intensity);
  const distances = [
    { name: "5 km", distance: 5, color: "blue" },
    { name: "10 km", distance: 10, color: "green" },
    { name: "Semi-marathon", distance: 21.1, color: "orange" },
    { name: "Marathon", distance: 42.2, color: "purple" }
  ];
  
  return distances.map(({ name, distance, color }) => {
    const currentTime = calculateTime(distance, currentVO2, data.currentWeight);
    
    // Progression du poids au fil du temps
    const weightDiff = data.currentWeight - data.targetWeight;
    const oneMonthWeight = data.currentWeight - (weightDiff * 0.2);
    const threeMonthsWeight = data.currentWeight - (weightDiff * 0.6);
    const sixMonthsWeight = data.targetWeight;
    
    // Calcul des temps futurs
    const oneMonthTime = calculateProgression(
      calculateTime(distance, currentVO2, oneMonthWeight), 
      1, 
      oneMonthWeight / data.currentWeight
    );
    
    const threeMonthsTime = calculateProgression(
      calculateTime(distance, currentVO2, threeMonthsWeight), 
      3, 
      threeMonthsWeight / data.currentWeight
    );
    
    const sixMonthsTime = calculateProgression(
      calculateTime(distance, currentVO2, sixMonthsWeight), 
      6, 
      sixMonthsWeight / data.currentWeight
    );
    
    // Calcul de l'amélioration totale
    const totalImprovement = ((currentTime - sixMonthsTime) / currentTime * 100).toFixed(1);
    
    return {
      distance: name,
      current: formatTime(currentTime),
      oneMonth: formatTime(oneMonthTime),
      threeMonths: formatTime(threeMonthsTime),
      sixMonths: formatTime(sixMonthsTime),
      improvement: `-${totalImprovement}%`,
      color
    };
  });
}

// Données pour le graphique de progression
export function generateChartData(data: TrainingData) {
  const currentVO2 = estimateVO2Max(data.weeklyVolume, data.intensity);
  const weightDiff = data.currentWeight - data.targetWeight;
  
  const timePoints = [
    { month: "Maintenant", weight: data.currentWeight, months: 0 },
    { month: "1 mois", weight: data.currentWeight - (weightDiff * 0.2), months: 1 },
    { month: "3 mois", weight: data.currentWeight - (weightDiff * 0.6), months: 3 },
    { month: "6 mois", weight: data.targetWeight, months: 6 }
  ];
  
  return timePoints.map(point => ({
    month: point.month,
    "5km": calculateProgression(
      calculateTime(5, currentVO2, point.weight), 
      point.months, 
      point.weight / data.currentWeight
    ),
    "10km": calculateProgression(
      calculateTime(10, currentVO2, point.weight), 
      point.months, 
      point.weight / data.currentWeight
    ),
    "Semi": calculateProgression(
      calculateTime(21.1, currentVO2, point.weight), 
      point.months, 
      point.weight / data.currentWeight
    ),
    "Marathon": calculateProgression(
      calculateTime(42.2, currentVO2, point.weight), 
      point.months, 
      point.weight / data.currentWeight
    )
  }));
}