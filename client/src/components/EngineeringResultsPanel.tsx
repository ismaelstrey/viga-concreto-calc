import {
  BeamDimensions,
  ReinforcementConfig,
  StructuralResults,
  CONCRETE_STRENGTH,
  STEEL_STRENGTH,
  SAFETY_COEFFICIENT_MATERIAL,
  SAFETY_COEFFICIENT_STEEL,
} from "@/types/beam";
import { AlertTriangle, CheckCircle2, Link2, Lock, Zap } from "lucide-react";
import { getRebarInfo } from "@/lib/beamCalculations";

interface EngineeringResultsPanelProps {
  results: StructuralResults;
  dimensions: BeamDimensions;
  reinforcement: ReinforcementConfig;
}

function ResultCard({ label, value, unit, alert = false }: { label: string; value: string; unit?: string; alert?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${alert ? "border-red-500/40 bg-red-950/20" : "border-border bg-secondary/30"}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-foreground leading-none mt-2">
        {value}
        {unit && <span className="text-sm font-medium text-muted-foreground ml-1">{unit}</span>}
      </p>
    </div>
  );
}

export function EngineeringResultsPanel({ results, dimensions, reinforcement }: EngineeringResultsPanelProps) {
  const d = dimensions.height - 4;
  const b = dimensions.width;
  const fyDesign = STEEL_STRENGTH / SAFETY_COEFFICIENT_STEEL;
  const z = d * 0.9;
  const asRequiredMm2 = (results.maxBendingMoment * 1e6) / Math.max(fyDesign * z, 1);
  const asRequiredCm2 = asRequiredMm2 / 100;
  const asProvidedCm2 = results.bottomRebarArea / 100;

  const fcDesign = CONCRETE_STRENGTH / SAFETY_COEFFICIENT_MATERIAL;
  const neutralAxisCm = Math.min(
    (results.bottomRebarArea * fyDesign) / (0.68 * fcDesign * Math.max(b * 10, 1)),
    dimensions.height
  );

  const stirrupInfo = getRebarInfo(reinforcement.stirrups.type);
  const stirrupLength = 2 * (dimensions.width / 100 + dimensions.height / 100) - 0.08;
  const stirrupWeight = (stirrupInfo.weight * results.stirrupQuantity * stirrupLength) / 1000;
  const longSteelWeight = Math.max(results.rebarWeight - stirrupWeight, 0);
  const concreteVolume = (dimensions.width / 100) * (dimensions.height / 100) * dimensions.length;

  const insufficientSteel = asProvidedCm2 < asRequiredCm2;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <section>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" /> ESFORÇOS SOLICITANTES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ResultCard label="Momento Máx." value={results.maxBendingMoment.toFixed(2)} unit="kN·m" />
          <ResultCard label="Cortante Máx." value={results.maxShearForce.toFixed(2)} unit="kN" />
          <ResultCard label="Momento Calc. (Md)" value={results.bendingMomentCapacity.toFixed(2)} unit="kN·m" />
          <ResultCard label="Cortante Calc. (Vd)" value={results.shearCapacity.toFixed(2)} unit="kN" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
          <Link2 className="w-4 h-4 text-orange-400" /> DIMENSIONAMENTO
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ResultCard label="As Necessário" value={asRequiredCm2.toFixed(2)} unit="cm²" />
          <ResultCard label="As Fornecido" value={asProvidedCm2.toFixed(2)} unit="cm²" alert={insufficientSteel} />
          <ResultCard label="Linha Neutra (x)" value={neutralAxisCm.toFixed(2)} unit="cm" />
          <ResultCard label="Altura Útil (d)" value={d.toFixed(2)} unit="cm" />
        </div>
        {insufficientSteel && (
          <div className="mt-3 rounded-md border border-red-600/50 bg-red-950/30 p-2 text-sm text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Armadura insuficiente! Aumente o número de barras ou o diâmetro.
          </div>
        )}
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-blue-300" /> QUANTITATIVOS DE PESO
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ResultCard label="Volume Concreto" value={concreteVolume.toFixed(2)} unit="m³" />
          <ResultCard label="Peso Concreto" value={results.concreteWeight.toFixed(2)} unit="kg" />
          <ResultCard label="Peso Aço Longit." value={longSteelWeight.toFixed(2)} unit="kg" />
          <ResultCard label="Peso Estribos" value={stirrupWeight.toFixed(2)} unit="kg" />
          <ResultCard label="Peso Total Aço" value={results.rebarWeight.toFixed(2)} unit="kg" />
          <ResultCard label="Peso Total Viga" value={results.totalWeight.toFixed(2)} unit="kg" />
          <ResultCard label="Flecha Máx." value={results.deflection.toFixed(2)} unit="mm" />
          <ResultCard label="Flecha Limite (L/250)" value={results.deflectionLimit.toFixed(2)} unit="mm" />
        </div>
      </section>

      {results.isSafe ? (
        <p className="text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Verificação geral: viga dentro dos limites de segurança.
        </p>
      ) : (
        <p className="text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Verificação geral: revise seção, armadura e carregamentos.
        </p>
      )}
    </div>
  );
}
