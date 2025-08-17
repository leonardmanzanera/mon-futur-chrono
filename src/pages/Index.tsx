import { useState } from "react";
import { TrainingForm } from "@/components/TrainingForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ProgressChart } from "@/components/ProgressChart";
import { HeartRateZones } from "@/components/HeartRateZones";
import { TrainingRecommendations } from "@/components/TrainingRecommendations";
import { calculatePerformancePredictions, generateChartData, calculateHeartRateZones, generateTrainingRecommendations } from "@/utils/performanceCalculator";
import { TrainingData } from "@/types/training";

const Index = () => {
  const [results, setResults] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [heartRateZones, setHeartRateZones] = useState<any[]>([]);
  const [trainingRecommendations, setTrainingRecommendations] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);

  const handleCalculate = (data: TrainingData) => {
    const predictions = calculatePerformancePredictions(data);
    const chart = generateChartData(data);
    const zones = calculateHeartRateZones(data.maxHeartRate, data.restingHeartRate);
    
    // Calculer VMA pour les recommandations
    const referenceTimeMinutes = parseTimeToMinutes(data.lastRaceTime);
    const vma = calculateVMAFromPerformance(data.lastRaceDistance, referenceTimeMinutes);
    const recommendations = generateTrainingRecommendations(data, vma);
    
    setResults(predictions);
    setChartData(chart);
    setHeartRateZones(zones);
    setTrainingRecommendations(recommendations);
    setTrainingData(data);
    setShowResults(true);
  };
  
  // Fonctions utilitaires (à déplacer dans utils si besoin)
  const parseTimeToMinutes = (timeString: string): number => {
    const parts = timeString.split(':').map(Number);
    if (parts.length === 2) return parts[0] + parts[1] / 60;
    if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
    return 0;
  };
  
  const calculateVMAFromPerformance = (distance: number, timeInMinutes: number): number => {
    const speedKmh = distance / (timeInMinutes / 60);
    if (distance === 5) return speedKmh * 1.05;
    if (distance === 10) return speedKmh * 1.1;
    if (distance === 21.1) return speedKmh * 1.2;
    if (distance === 42.2) return speedKmh * 1.3;
    return speedKmh * 1.1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">
            Mon Futur Chrono
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez vos performances futures en course à pied grâce à l'intelligence prédictive
          </p>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <TrainingForm onCalculate={handleCalculate} />
        </div>

        {/* Results */}
        {showResults && trainingData && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
            <ResultsDisplay results={results} />
            <ProgressChart data={chartData} />
            <HeartRateZones 
              zones={heartRateZones} 
              vma={calculateVMAFromPerformance(trainingData.lastRaceDistance, parseTimeToMinutes(trainingData.lastRaceTime))} 
            />
            <TrainingRecommendations 
              recommendations={trainingRecommendations} 
              weeklyVolume={trainingData.weeklyVolume} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
