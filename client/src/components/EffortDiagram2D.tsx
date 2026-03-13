import { useMemo, useState } from "react";
import { BeamDimensions, LoadConfiguration, StructuralResults } from "@/types/beam";

type DiagramTab = "moment" | "shear" | "deflection";

interface EffortDiagram2DProps {
  dimensions: BeamDimensions;
  loads: LoadConfiguration;
  results: StructuralResults;
}

interface DiagramPoint {
  x: number;
  shear: number;
  moment: number;
  deflection: number;
}

function buildEffortData(
  length: number,
  distributedLoad: number,
  pointLoad: number,
  pointPosition: number,
  maxDeflection: number,
  samples = 50
): DiagramPoint[] {
  const boundedPosition = Math.max(0, Math.min(length, pointPosition));
  const ra = (distributedLoad * length) / 2 + (pointLoad * (length - boundedPosition)) / length;

  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = (length * index) / samples;
    const pointContribution = x >= boundedPosition ? pointLoad : 0;

    const shear = ra - distributedLoad * x - pointContribution;
    const moment =
      ra * x -
      (distributedLoad * x * x) / 2 -
      (x >= boundedPosition ? pointLoad * (x - boundedPosition) : 0);
    const deflection = (4 * maxDeflection * x * (length - x)) / Math.max(length * length, 0.0001);

    return { x, shear, moment, deflection };
  });
}

export function EffortDiagram2D({ dimensions, loads, results }: EffortDiagram2DProps) {
  const [activeTab, setActiveTab] = useState<DiagramTab>("moment");
  const [includeSelfWeight, setIncludeSelfWeight] = useState(true);

  const selfWeightLinearKn = useMemo(() => {
    const totalMassKg = results.concreteWeight + results.rebarWeight;
    const totalWeightKn = (totalMassKg * 9.81) / 1000;
    return totalWeightKn / Math.max(dimensions.length, 0.1);
  }, [results.concreteWeight, results.rebarWeight, dimensions.length]);

  const distributedLoad =
    loads.deadLoad + loads.liveLoad + (includeSelfWeight ? selfWeightLinearKn : 0);

  const data = useMemo(
    () =>
      buildEffortData(
        dimensions.length,
        distributedLoad,
        loads.pointLoad,
        loads.pointLoadPosition,
        results.deflection
      ),
    [dimensions.length, distributedLoad, loads.pointLoad, loads.pointLoadPosition, results.deflection]
  );

  const tabs = {
    moment: { label: "Momento Fletor", color: "#3b82f6", key: "moment", unit: "kN·m" },
    shear: { label: "Cortante", color: "#22d3ee", key: "shear", unit: "kN" },
    deflection: { label: "Flecha", color: "#14b8a6", key: "deflection", unit: "mm" },
  } as const;

  const config = tabs[activeTab];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-foreground">DIAGRAMAS DE ESFORÇOS</h3>
        <label className="text-xs text-muted-foreground flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeSelfWeight}
            onChange={(event) => setIncludeSelfWeight(event.target.checked)}
            className="accent-primary"
          />
          Simular peso próprio
        </label>
      </div>

      <div className="grid grid-cols-3 gap-2 p-1 rounded-lg bg-secondary/30 border border-border/50">
        {(Object.keys(tabs) as DiagramTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md py-2 text-sm transition-colors ${
              activeTab === tab
                ? "bg-slate-600/50 text-white font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tabs[tab].label}
          </button>
        ))}
      </div>

      <DiagramChart
        data={data}
        length={dimensions.length}
        valueKey={config.key}
        color={config.color}
        unit={config.unit}
      />

      <div className="text-xs text-muted-foreground flex justify-between">
        <span>Apoio A (0.00 m)</span>
        <span>Apoio B ({dimensions.length.toFixed(2)} m)</span>
      </div>
    </div>
  );
}

interface DiagramChartProps {
  data: DiagramPoint[];
  length: number;
  valueKey: "moment" | "shear" | "deflection";
  color: string;
  unit: string;
}

function DiagramChart({ data, length, valueKey, color, unit }: DiagramChartProps) {
  const width = 980;
  const height = 340;
  const left = 58;
  const right = 22;
  const top = 18;
  const bottom = 40;
  const innerW = width - left - right;
  const innerH = height - top - bottom;

  const values = data.map((point) => point[valueKey]);
  const maxAbs = Math.max(...values.map((value) => Math.abs(value)), 1);

  const points = data.map((point, index) => {
    const x = left + (innerW * index) / Math.max(data.length - 1, 1);
    const y = top + innerH / 2 - (point[valueKey] / maxAbs) * (innerH * 0.45);
    return { ...point, x, y };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${left},${top + innerH / 2} ${polyline} ${left + innerW},${top + innerH / 2}`;

  const xTicks = 14;
  const yTicks = 6;

  return (
    <div className="rounded-xl border border-border bg-slate-950/40 p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72">
        {Array.from({ length: xTicks + 1 }).map((_, i) => {
          const x = left + (innerW * i) / xTicks;
          return (
            <line
              key={`x-${i}`}
              x1={x}
              y1={top}
              x2={x}
              y2={top + innerH}
              stroke="#243349"
              strokeDasharray="3 5"
              strokeWidth="1"
            />
          );
        })}

        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = top + (innerH * i) / yTicks;
          return (
            <line
              key={`y-${i}`}
              x1={left}
              y1={y}
              x2={left + innerW}
              y2={y}
              stroke="#243349"
              strokeDasharray="3 5"
              strokeWidth="1"
            />
          );
        })}

        <line x1={left} y1={top + innerH / 2} x2={left + innerW} y2={top + innerH / 2} stroke="#5e728e" strokeWidth="1.2" />

        <polygon points={area} fill={color} opacity="0.16" />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="3" />

        <text x={14} y={top + 14} fill="#89a0bf" fontSize="12">
          {maxAbs.toFixed(1)}
        </text>
        <text x={10} y={top + innerH / 2 + 4} fill="#89a0bf" fontSize="12">
          0.0
        </text>
        <text x={8} y={top + innerH - 2} fill="#89a0bf" fontSize="12">
          -{maxAbs.toFixed(1)}
        </text>

        <text x={left + innerW - 10} y={top + 14} fill="#9ab3d6" textAnchor="end" fontSize="12">
          {unit}
        </text>

        {Array.from({ length: xTicks + 1 }).map((_, i) => {
          const x = left + (innerW * i) / xTicks;
          const value = (length * i) / xTicks;
          return (
            <text key={`xl-${i}`} x={x} y={height - 12} fill="#7e94b2" textAnchor="middle" fontSize="11">
              {value.toFixed(1)}m
            </text>
          );
        })}
      </svg>
    </div>
  );
}
