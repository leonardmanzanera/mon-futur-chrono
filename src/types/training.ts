export interface TrainingData {
  // Données personnelles
  weeklyVolume: number;
  intensity: 'facile' | 'modérée' | 'difficile';
  currentWeight: number;
  targetWeight: number;
  
  // Nouveau : Performance actuelle
  lastRaceDistance: number; // en km
  lastRaceTime: string; // format MM:SS ou HH:MM:SS
  
  // Nouveau : Données cardiaques
  maxHeartRate: number;
  restingHeartRate: number;
  
  // Estimation VMA (calculée ou saisie)
  vma?: number;
  vo2Max?: number;
}

export interface PredictionResult {
  distance: string;
  current: string;
  oneMonth: string;
  threeMonths: string;
  sixMonths: string;
  improvement: string;
  color: string;
  targetPace?: string;
  recommendedPace?: string;
}

export interface HeartRateZone {
  name: string;
  minHR: number;
  maxHR: number;
  percentage: string;
  purpose: string;
  pace?: string;
  color: string;
}

export interface TrainingRecommendation {
  type: string;
  duration: string;
  intensity: string;
  heartRate: string;
  pace: string;
  purpose: string;
}