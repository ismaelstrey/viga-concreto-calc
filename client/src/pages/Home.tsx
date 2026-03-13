/**
 * Página principal da Calculadora de Vigas de Concreto Aéreas
 * Design: Dark Mode Profissional - Similar ao StructuraCalc
 * Layout: Painel esquerdo inputs, área central/direita visualizações
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Zap, Save, ChevronDown, ChevronUp } from "lucide-react";
import { DimensionsInput } from "@/components/DimensionsInput";
import { LoadsInput } from "@/components/LoadsInput";
import { ReinforcementInput } from "@/components/ReinforcementInput";
import { useBeamCalculator } from "@/hooks/useBeamCalculator";
import { Visualization2D } from "@/components/Visualization2D";
import { Visualization3D } from "@/components/Visualization3D";
import { WeightDistributionChart } from "@/components/WeightDistributionChart";
import { EffortDiagram2D } from "@/components/EffortDiagram2D";
import { EngineeringResultsPanel } from "@/components/EngineeringResultsPanel";

export default function Home() {
  const calculator = useBeamCalculator();
  const [showAdvancedSettings, setShowAdvancedSettings] = React.useState(false);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">StructCalc</h1>
              <p className="text-xs text-muted-foreground">
                CÁLCULO ESTRUTURAL DE VIGAS
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border hover:bg-secondary"
            >
              <Save className="w-4 h-4" />
              Salvar
            </Button>
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              Calculadora
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 min-h-[calc(100vh-80px)]">
          {/* Painel Esquerdo - Inputs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Seção Parâmetros */}
            <div>
              <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded"></span>
                Parâmetros da Viga
              </h2>

              {/* Geometria */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Geometria da Viga
                  </h3>
                  <DimensionsInput
                    dimensions={calculator.dimensions}
                    onChange={calculator.updateDimensions}
                  />
                </div>

                {/* Carregamento */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Carregamento
                  </h3>
                  <LoadsInput
                    loads={calculator.loads}
                    beamLength={calculator.dimensions.length}
                    onChange={calculator.updateLoads}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedSettings((prev) => !prev)}
                    className="w-full justify-between border-border hover:bg-secondary"
                  >
                    {showAdvancedSettings
                      ? "Ocultar parâmetros avançados"
                      : "Exibir parâmetros avançados"}
                    {showAdvancedSettings ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {showAdvancedSettings && (
                  <>
                    {/* Materiais */}
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Materiais
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-2 block">
                            fck (MPa)
                          </label>
                          <select className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>20 MPa</option>
                            <option>25 MPa</option>
                            <option>30 MPa</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-2 block">
                            Tipo do Aço
                          </label>
                          <select className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>CA-50</option>
                            <option>CA-60</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Armadura */}
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Armadura
                      </h3>
                      <ReinforcementInput
                        reinforcement={calculator.reinforcement}
                        onChange={calculator.updateReinforcement}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-2 pt-4 border-t border-border">
              <Button
                onClick={calculator.calculate}
                disabled={calculator.isCalculating}
                className="w-full h-11 text-base font-bold gap-2 bg-primary hover:bg-primary/90"
              >
                {calculator.isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Calcular
                  </>
                )}
              </Button>

              {calculator.errors.length > 0 && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-sm text-destructive">
                  {calculator.errors[0]}
                </div>
              )}
            </div>
          </div>

          {/* Área Central/Direita - Visualizações */}
          <div className="lg:col-span-3 space-y-6">
            {calculator.results ? (
              <>
                {/* Visualização 3D */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">
                      VISUALIZAÇÃO 3D
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-accent text-accent hover:bg-accent/10"
                    >
                      Ocultar Feragem
                    </Button>
                  </div>
                  <div className="h-96 bg-gradient-to-b from-slate-900 to-slate-950">
                    <Visualization3D
                      dimensions={calculator.dimensions}
                      reinforcement={calculator.reinforcement}
                      results={calculator.results}
                    />
                  </div>
                </div>

                {/* Grid de Visualizações Inferiores */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Seção Transversal */}
                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-sm font-bold text-foreground">
                        SEÇÃO TRANSVERSAL
                      </h3>
                    </div>
                    <div className="p-4 h-80 flex items-center justify-center bg-slate-900/50">
                      <Visualization2D
                        dimensions={calculator.dimensions}
                        loads={calculator.loads}
                        reinforcement={calculator.reinforcement}
                        results={calculator.results}
                      />
                    </div>
                  </div>

                  {/* Distribuição de Peso */}
                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-sm font-bold text-foreground">
                        DISTRIBUIÇÃO DE PESO
                      </h3>
                    </div>
                    <div className="p-6 h-80 flex items-center justify-center">
                      <WeightDistributionChart results={calculator.results} />
                    </div>
                  </div>
                </div>

                <EngineeringResultsPanel
                  results={calculator.results}
                  dimensions={calculator.dimensions}
                  reinforcement={calculator.reinforcement}
                />

                <EffortDiagram2D
                  dimensions={calculator.dimensions}
                  loads={calculator.loads}
                  results={calculator.results}
                />
              </>
            ) : (
              <div className="h-96 bg-card border border-border rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Nenhum cálculo realizado
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure os parâmetros e clique em "Calcular"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
