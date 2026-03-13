/**
 * Componente de gráfico de distribuição de peso (Donut Chart)
 * Design: Dark Mode Profissional
 */

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { StructuralResults } from "@/types/beam";

interface WeightDistributionChartProps {
  results: StructuralResults;
}

export function WeightDistributionChart({
  results,
}: WeightDistributionChartProps) {
  const data = [
    {
      name: "Concreto",
      value: results.concreteWeight,
      color: "#64748b",
    },
    {
      name: "Aço Longitudinal",
      value: results.rebarWeight,
      color: "#f97316",
    },
  ];

  // Calcular peso dos estribos
  const stirrupWeight = results.totalWeight - results.concreteWeight - results.rebarWeight;
  if (stirrupWeight > 0) {
    data.push({
      name: "Estribos",
      value: stirrupWeight,
      color: "#3b82f6",
    });
  }

  const total = results.totalWeight;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "0.5rem",
              color: "#e2e8f0",
            }}
            formatter={(value: number) => `${value.toFixed(1)} kg`}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 w-full space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">
                {item.value.toFixed(1)} kg
              </span>
              <span className="text-muted-foreground text-xs">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <span className="text-muted-foreground font-semibold">Total</span>
          <span className="font-bold text-foreground text-lg">
            {total.toFixed(0)} kg
          </span>
        </div>
      </div>
    </div>
  );
}
