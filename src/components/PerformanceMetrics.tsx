import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateDetailedMetrics } from "@/utils/performanceCalculator";
import { TrainingData } from "@/types/training";

interface PerformanceMetricsProps {
  data: TrainingData;
}

export function PerformanceMetrics({ data }: PerformanceMetricsProps) {
  const metrics = calculateDetailedMetrics(data);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Vos métriques de performance actuelles
        </h3>
        <p className="text-muted-foreground">
          Basées sur votre chrono de {data.lastRaceTime} sur {data.lastRaceDistance}km
        </p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6 text-center">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-muted-foreground">VDOT</h4>
            <div className="text-3xl font-bold text-primary">{metrics.vdot}</div>
            <p className="text-xs text-muted-foreground">Indice Jack Daniels</p>
          </div>
        </Card>
        
        <Card className="glass-card p-6 text-center">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-muted-foreground">VO₂max</h4>
            <div className="text-3xl font-bold text-accent">{metrics.vo2max}</div>
            <p className="text-xs text-muted-foreground">ml/kg/min</p>
          </div>
        </Card>
        
        <Card className="glass-card p-6 text-center">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-muted-foreground">VMA</h4>
            <div className="text-3xl font-bold text-energy">{metrics.vma}</div>
            <p className="text-xs text-muted-foreground">km/h</p>
          </div>
        </Card>
      </div>

      {/* Allures d'entraînement */}
      <Card className="glass-card p-6">
        <h4 className="text-xl font-bold text-foreground mb-4">🎯 Vos allures d'entraînement</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Endurance fondamentale</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
              {metrics.paces.easy}/km
            </Badge>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Tempo/Marathon</span>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 font-mono">
              {metrics.paces.tempo}/km
            </Badge>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Seuil lactique</span>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-mono">
              {metrics.paces.threshold}/km
            </Badge>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">VMA/VO₂max</span>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono">
              {metrics.paces.interval}/km
            </Badge>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Répétitions</span>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono">
              {metrics.paces.repetition}/km
            </Badge>
          </div>
        </div>
      </Card>

      {/* Équivalences actuelles */}
      <Card className="glass-card p-6">
        <h4 className="text-xl font-bold text-foreground mb-4">⚡ Vos équivalences actuelles</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-lg font-bold text-blue-400">5km</div>
            <div className="font-mono text-foreground">{metrics.equivalents["5km"]}</div>
          </div>
          
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-lg font-bold text-green-400">10km</div>
            <div className="font-mono text-foreground">{metrics.equivalents["10km"]}</div>
          </div>
          
          <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <div className="text-lg font-bold text-orange-400">Semi</div>
            <div className="font-mono text-foreground">{metrics.equivalents["21km"]}</div>
          </div>
          
          <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="text-lg font-bold text-purple-400">Marathon</div>
            <div className="font-mono text-foreground">{metrics.equivalents["42km"]}</div>
          </div>
        </div>
      </Card>

      {/* Analyse du niveau */}
      <Card className="glass-card p-6">
        <h4 className="text-xl font-bold text-foreground mb-4">📊 Analyse de votre niveau</h4>
        <div className="space-y-3">
          {Number(metrics.vdot) >= 50 && (
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <span className="text-purple-400 font-semibold">🏆 Niveau Elite/National :</span>
              <span className="text-muted-foreground ml-2">VDOT {metrics.vdot} - Excellent coureur</span>
            </div>
          )}
          {Number(metrics.vdot) >= 45 && Number(metrics.vdot) < 50 && (
            <div className="p-3 bg-energy/10 rounded-lg border border-energy/20">
              <span className="text-energy font-semibold">🥇 Niveau Très Bon :</span>
              <span className="text-muted-foreground ml-2">VDOT {metrics.vdot} - Coureur confirmé</span>
            </div>
          )}
          {Number(metrics.vdot) >= 40 && Number(metrics.vdot) < 45 && (
            <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
              <span className="text-accent font-semibold">🥈 Niveau Bon :</span>
              <span className="text-muted-foreground ml-2">VDOT {metrics.vdot} - Bon coureur régulier</span>
            </div>
          )}
          
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <span className="text-primary font-semibold">💡 Recommandation :</span>
            <span className="text-muted-foreground ml-2">
              Avec votre niveau, visez {data.weeklyVolume >= 50 ? "4-6" : "3-4"} séances/semaine 
              pour optimiser votre progression
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}