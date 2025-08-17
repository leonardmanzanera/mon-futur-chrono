import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  month: string;
  "5km": number;
  "10km": number;
  "Semi": number;
  "Marathon": number;
}

interface ProgressChartProps {
  data: ChartData[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-border/20">
          <p className="text-foreground font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-mono">
              {entry.dataKey}: {formatTime(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 glow-effect">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Progression prévue
        </h3>
        <p className="text-muted-foreground">
          Évolution de vos chronos au fil des mois
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatTime}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line 
              type="monotone" 
              dataKey="5km" 
              stroke="hsl(217 91% 60%)" 
              strokeWidth={3}
              dot={{ fill: "hsl(217 91% 60%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(217 91% 60%)", strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="10km" 
              stroke="hsl(142 76% 36%)" 
              strokeWidth={3}
              dot={{ fill: "hsl(142 76% 36%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(142 76% 36%)", strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="Semi" 
              stroke="hsl(25 95% 53%)" 
              strokeWidth={3}
              dot={{ fill: "hsl(25 95% 53%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(25 95% 53%)", strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="Marathon" 
              stroke="hsl(300 76% 56%)" 
              strokeWidth={3}
              dot={{ fill: "hsl(300 76% 56%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(300 76% 56%)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}