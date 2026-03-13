import { BeamDecisionSupport } from "@/types/beam";
import { AlertTriangle, CheckCircle2, CircleGauge } from "lucide-react";

interface DecisionSupportPanelProps {
  decisionSupport: BeamDecisionSupport;
}

const IMPACT_STYLES: Record<string, string> = {
  high: "text-red-600 bg-red-100",
  medium: "text-amber-700 bg-amber-100",
  low: "text-green-700 bg-green-100",
};

const FOCUS_LABELS = {
  economia: "Economia",
  equilibrio: "Equilíbrio",
  seguranca: "Segurança",
};

export function DecisionSupportPanel({ decisionSupport }: DecisionSupportPanelProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-5">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <CircleGauge className="w-4 h-4 text-primary" />
        APOIO À DECISÃO DO CONSTRUTOR
      </h3>

      <p className="text-sm text-muted-foreground">{decisionSupport.summary}</p>

      <div className="grid gap-3">
        {decisionSupport.recommendations.map((recommendation) => (
          <div
            key={recommendation.title}
            className="p-3 rounded-lg border border-border bg-secondary/20"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-foreground">{recommendation.title}</p>
              <span
                className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full font-bold ${IMPACT_STYLES[recommendation.impact]}`}
              >
                impacto {recommendation.impact}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{recommendation.description}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="py-2">Cenário</th>
              <th className="py-2">Foco</th>
              <th className="py-2">Δ Peso</th>
              <th className="py-2">Fator Seg.</th>
              <th className="py-2">Utilização M</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {decisionSupport.alternatives.map((alternative) => (
              <tr key={alternative.name} className="border-b border-border/50 last:border-b-0">
                <td className="py-2 font-semibold text-foreground">{alternative.name}</td>
                <td className="py-2 text-muted-foreground">{FOCUS_LABELS[alternative.focus]}</td>
                <td className="py-2 text-muted-foreground">
                  {alternative.estimatedWeightDelta > 0 ? "+" : ""}
                  {alternative.estimatedWeightDelta.toFixed(1)}%
                </td>
                <td className="py-2 text-muted-foreground">{alternative.estimatedSafetyFactor.toFixed(2)}</td>
                <td className="py-2 text-muted-foreground">
                  {alternative.estimatedMomentUtilization.toFixed(1)}%
                </td>
                <td className="py-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold">
                    {alternative.isSafe ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">Seguro</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span className="text-red-600">Revisar</span>
                      </>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
