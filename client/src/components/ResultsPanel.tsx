/**
 * Componente de exibição de resultados dos cálculos
 * Design Philosophy: Engenharia Moderna Minimalista
 * - Apresentação clara de resultados técnicos
 * - Indicadores de segurança com cores (verde/amarelo/vermelho)
 * - Tipografia técnica com IBM Plex Mono para valores
 */

import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { StructuralResults } from "@/types/beam";

interface ResultsPanelProps {
  results: StructuralResults;
  isLoading?: boolean;
}

function getStatusColor(utilization: number): string {
  if (utilization <= 70) return "text-green-600";
  if (utilization <= 90) return "text-yellow-600";
  return "text-red-600";
}

function getStatusBg(utilization: number): string {
  if (utilization <= 70) return "bg-green-50";
  if (utilization <= 90) return "bg-yellow-50";
  return "bg-red-50";
}

function getStatusIcon(utilization: number) {
  if (utilization <= 70)
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  if (utilization <= 90)
    return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  return <AlertCircle className="w-4 h-4 text-red-600" />;
}

export function ResultsPanel({ results, isLoading }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Geral */}
      <Card
        className={`p-6 border-2 ${
          results.isSafe
            ? "border-green-600 bg-green-50"
            : "border-red-600 bg-red-50"
        }`}
      >
        <div className="flex items-center gap-3">
          {results.isSafe ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h3 className="font-bold text-lg">
              {results.isSafe ? "Viga Segura" : "Viga Não Segura"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Fator de segurança: {results.safetyFactor.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Avisos */}
      {results.warnings.length > 0 && (
        <Card className="p-4 border-border bg-yellow-50 border-yellow-200">
          <h4 className="font-semibold text-sm text-yellow-900 mb-2">
            Avisos de Projeto:
          </h4>
          <ul className="space-y-1">
            {results.warnings.map((warning, idx) => (
              <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Cargas */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-sm font-bold text-foreground mb-4">Cargas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Carga Permanente</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.totalDeadLoad.toFixed(2)} kN
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Carga Acidental</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.totalLiveLoad.toFixed(2)} kN
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Carga Total</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.totalLoad.toFixed(2)} kN
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Carga de Projeto</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.designLoad.toFixed(2)} kN
            </p>
          </div>
        </div>
      </Card>

      {/* Esforços */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-sm font-bold text-foreground mb-4">Esforços</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Momento Máximo</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.maxBendingMoment.toFixed(2)} kN·m
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Força Cortante</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.maxShearForce.toFixed(2)} kN
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Flecha Máxima</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.deflection.toFixed(2)} mm
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Limite de Flecha</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.deflectionLimit.toFixed(2)} mm
            </p>
          </div>
        </div>
      </Card>

      {/* Verificações */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-sm font-bold text-foreground mb-4">Verificações</h3>
        <div className="space-y-3">
          {/* Momento Fletor */}
          <div className={`p-3 rounded-lg ${getStatusBg(results.bendingMomentUtilization)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(results.bendingMomentUtilization)}
                <span className="text-sm font-semibold text-foreground">
                  Momento Fletor
                </span>
              </div>
              <span
                className={`text-sm font-mono font-bold ${getStatusColor(
                  results.bendingMomentUtilization
                )}`}
              >
                {results.bendingMomentUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  results.bendingMomentUtilization <= 70
                    ? "bg-green-600"
                    : results.bendingMomentUtilization <= 90
                      ? "bg-yellow-600"
                      : "bg-red-600"
                }`}
                style={{
                  width: `${Math.min(results.bendingMomentUtilization, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {results.maxBendingMoment.toFixed(2)} / {results.bendingMomentCapacity.toFixed(2)} kN·m
            </p>
          </div>

          {/* Força Cortante */}
          <div className={`p-3 rounded-lg ${getStatusBg(results.shearUtilization)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(results.shearUtilization)}
                <span className="text-sm font-semibold text-foreground">
                  Força Cortante
                </span>
              </div>
              <span
                className={`text-sm font-mono font-bold ${getStatusColor(
                  results.shearUtilization
                )}`}
              >
                {results.shearUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  results.shearUtilization <= 70
                    ? "bg-green-600"
                    : results.shearUtilization <= 90
                      ? "bg-yellow-600"
                      : "bg-red-600"
                }`}
                style={{
                  width: `${Math.min(results.shearUtilization, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {results.maxShearForce.toFixed(2)} / {results.shearCapacity.toFixed(2)} kN
            </p>
          </div>

          {/* Flecha */}
          <div className={`p-3 rounded-lg ${getStatusBg(results.deflectionUtilization)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(results.deflectionUtilization)}
                <span className="text-sm font-semibold text-foreground">
                  Flecha
                </span>
              </div>
              <span
                className={`text-sm font-mono font-bold ${getStatusColor(
                  results.deflectionUtilization
                )}`}
              >
                {results.deflectionUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  results.deflectionUtilization <= 70
                    ? "bg-green-600"
                    : results.deflectionUtilization <= 90
                      ? "bg-yellow-600"
                      : "bg-red-600"
                }`}
                style={{
                  width: `${Math.min(results.deflectionUtilization, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {results.deflection.toFixed(2)} / {results.deflectionLimit.toFixed(2)} mm
            </p>
          </div>
        </div>
      </Card>

      {/* Armadura */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-sm font-bold text-foreground mb-4">Armadura</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Aço Superior</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.topRebarArea.toFixed(0)} mm²
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Aço Inferior</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.bottomRebarArea.toFixed(0)} mm²
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Aço Total</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.totalRebarArea.toFixed(0)} mm²
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Estribos</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.stirrupQuantity} un.
            </p>
          </div>
        </div>
      </Card>

      {/* Pesos */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-sm font-bold text-foreground mb-4">Pesos</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Concreto</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.concreteWeight.toFixed(0)} kg
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Armadura</p>
            <p className="text-lg font-mono font-bold text-primary">
              {results.rebarWeight.toFixed(0)} kg
            </p>
          </div>
          <div className="col-span-2 pt-2 border-t border-border">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Peso Total</p>
              <p className="text-xl font-mono font-bold text-primary">
                {results.totalWeight.toFixed(0)} kg
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
