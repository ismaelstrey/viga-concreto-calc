import { useMemo, useState } from "react";
import { BeamDimensions, LoadConfiguration, StructuralResults } from "@/types/beam";

interface EffortDiagram2DProps {
  dimensions: BeamDimensions;
  loads: LoadConfiguration;
  results: StructuralResults;
}

interface DiagramPoint {
  x: number;
  shear: number;
  moment: number;
}

function buildEffortData(
  length: number,
  distributedLoad: number,
  pointLoad: number,
  pointPosition: number,
  samples = 60
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

    return {
      x,
      shear,
      moment,
    };
  });
}

export function EffortDiagram2D({ dimensions, loads, results }: EffortDiagram2DProps) {
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
        loads.pointLoadPosition
      ),
    [dimensions.length, distributedLoad, loads.pointLoad, loads.pointLoadPosition]
  );

  const maxAbsShear = Math.max(...data.map((d) => Math.abs(d.shear)), 1);
  const maxAbsMoment = Math.max(...data.map((d) => Math.abs(d.moment)), 1);

  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">DIAGRAMAS DE ESFORÇOS 2D</h3>
          <p className="text-xs text-muted-foreground">
            Simulação de cortante e momento com opção de incluir peso próprio.
          </p>
        </div>
        <label className="text-xs text-muted-foreground flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeSelfWeight}
            onChange={(event) => setIncludeSelfWeight(event.target.checked)}
            className="accent-primary"
          />
          Incluir peso próprio
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3 rounded border border-border bg-secondary/30">
          <p className="text-[11px] text-muted-foreground">Carga distribuída simulada</p>
          <p className="text-sm font-bold text-foreground">{distributedLoad.toFixed(2)} kN/m</p>
        </div>
        <div className="p-3 rounded border border-border bg-secondary/30">
          <p className="text-[11px] text-muted-foreground">Peso próprio linear</p>
          <p className="text-sm font-bold text-foreground">{selfWeightLinearKn.toFixed(2)} kN/m</p>
        </div>
        <div className="p-3 rounded border border-border bg-secondary/30">
          <p className="text-[11px] text-muted-foreground">Cortante máximo</p>
          <p className="text-sm font-bold text-foreground">{maxAbsShear.toFixed(2)} kN</p>
        </div>
        <div className="p-3 rounded border border-border bg-secondary/30">
          <p className="text-[11px] text-muted-foreground">Momento máximo</p>
          <p className="text-sm font-bold text-foreground">{maxAbsMoment.toFixed(2)} kN·m</p>
        </div>
      </div>

      <div className="space-y-4">
        <DiagramCanvas
          title="Diagrama de Cortante V(x)"
          color="#38bdf8"
          data={data}
          valueKey="shear"
          maxAbs={maxAbsShear}
          unit="kN"
        />
        <DiagramCanvas
          title="Diagrama de Momento M(x)"
          color="#a78bfa"
          data={data}
          valueKey="moment"
          maxAbs={maxAbsMoment}
          unit="kN·m"
        />
      </div>
    </div>
  );
}

interface DiagramCanvasProps {
  title: string;
  color: string;
  data: DiagramPoint[];
  valueKey: "shear" | "moment";
  maxAbs: number;
  unit: string;
}

function DiagramCanvas({ title, color, data, valueKey, maxAbs, unit }: DiagramCanvasProps) {
  const width = 980;
  const height = 180;
  const margin = 22;
  const innerWidth = width - margin * 2;
  const axisY = height / 2;

  const polyline = data
    .map((point, index) => {
      const x = margin + (innerWidth * index) / Math.max(data.length - 1, 1);
      const value = point[valueKey];
      const y = axisY - (value / maxAbs) * (height * 0.36);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const endValue = data[data.length - 1]?.[valueKey] ?? 0;
  const peak = Math.max(...data.map((point) => Math.abs(point[valueKey])));

  return (
    <div className="rounded border border-border bg-slate-950/40 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">
          Pico: {peak.toFixed(2)} {unit} • Valor em L: {endValue.toFixed(2)} {unit}
        </p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        <line x1={margin} y1={axisY} x2={width - margin} y2={axisY} stroke="#64748b" strokeWidth="1" />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="#334155" strokeWidth="1" />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" />
      </svg>
    </div>
  );
}
