import { useState } from "react";
import { TrainingForm } from "@/components/TrainingForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ProgressChart } from "@/components/ProgressChart";
import { HeartRateZones } from "@/components/HeartRateZones";
import { TrainingRecommendations } from "@/components/TrainingRecommendations";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { calculatePerformancePredictions, generateChartData, calculateHeartRateZones, generateTrainingRecommendations, parseTimeToSeconds, calculateVDOTFromPerformance, calculateDetailedMetrics } from "@/utils/performanceCalculator";
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
    
    // Calculer VDOT et sessions pour les nouveaux composants
    const referenceTimeSeconds = parseTimeToSeconds(data.lastRaceTime);
    const vdot = calculateVDOTFromPerformance(data.lastRaceDistance, referenceTimeSeconds);
    const sessionsPerWeek = Math.min(7, Math.max(2, Math.floor(data.weeklyVolume / 8)));
    
    const zones = calculateHeartRateZones(data.maxHeartRate, data.restingHeartRate, vdot);
    const recommendations = generateTrainingRecommendations(data, vdot, sessionsPerWeek);
    
    setResults(predictions);
    setChartData(chart);
    setHeartRateZones(zones);
    setTrainingRecommendations(recommendations);
    setTrainingData(data);
    setShowResults(true);
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
            <PerformanceMetrics data={trainingData} />
            <ResultsDisplay results={results} />
            <ProgressChart data={chartData} />
            <HeartRateZones zones={heartRateZones} vma={Number(calculateDetailedMetrics(trainingData).vma)} />
            <TrainingRecommendations recommendations={trainingRecommendations} weeklyVolume={trainingData.weeklyVolume} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
