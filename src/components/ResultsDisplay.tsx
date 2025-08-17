import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PredictionResult {
  distance: string;
  current: string;
  oneMonth: string;
  threeMonths: string;
  sixMonths: string;
  improvement: string;
  color: string;
}

interface ResultsDisplayProps {
  results: PredictionResult[];
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
      green: "from-green-500/20 to-green-600/10 border-green-500/30",
      orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
      purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBadgeColor = (color: string) => {
    const colors = {
      blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      green: "bg-green-500/20 text-green-400 border-green-500/30", 
      orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      purple: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Vos prédictions de performances
        </h3>
        <p className="text-muted-foreground">
          Basées sur votre entraînement et objectifs de poids
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result, index) => (
          <Card 
            key={index}
            className={`glass-card p-6 hover-scale transition-smooth bg-gradient-to-br ${getColorClasses(result.color)}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-foreground">
                  {result.distance}
                </h4>
                <Badge className={`${getBadgeColor(result.color)} border`}>
                  {result.improvement}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Actuel</span>
                  <span className="font-mono text-foreground font-medium">
                    {result.current}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Dans 1 mois</span>
                  <span className="font-mono text-accent font-medium">
                    {result.oneMonth}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Dans 3 mois</span>
                  <span className="font-mono text-primary font-medium">
                    {result.threeMonths}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Dans 6 mois</span>
                  <span className="font-mono text-energy font-bold">
                    {result.sixMonths}
                  </span>
                </div>
              </div>

              <div className="w-full bg-secondary/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    result.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    result.color === 'green' ? 'from-green-500 to-green-600' :
                    result.color === 'orange' ? 'from-orange-500 to-orange-600' :
                    'from-purple-500 to-purple-600'
                  }`}
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}