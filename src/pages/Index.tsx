import { useState } from "react";
import { TrainingForm } from "@/components/TrainingForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ProgressChart } from "@/components/ProgressChart";
import { calculatePerformancePredictions, generateChartData } from "@/utils/performanceCalculator";

interface TrainingData {
  weeklyVolume: number;
  intensity: 'facile' | 'modérée' | 'difficile';
  currentWeight: number;
  targetWeight: number;
}

const Index = () => {
  const [results, setResults] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = (data: TrainingData) => {
    const predictions = calculatePerformancePredictions(data);
    const chart = generateChartData(data);
    
    setResults(predictions);
    setChartData(chart);
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
        {showResults && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
            <ResultsDisplay results={results} />
            <ProgressChart data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
