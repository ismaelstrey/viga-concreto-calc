/**
 * Componente de lista de materiais e relatório
 * Design Philosophy: Engenharia Moderna Minimalista
 * - Relatório técnico com lista de materiais
 * - Exportação em PDF (futuro)
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { StructuralResults, BeamDimensions, ReinforcementConfig } from "@/types/beam";
import { getRebarInfo } from "@/lib/beamCalculations";

interface MaterialsListProps {
  dimensions: BeamDimensions;
  reinforcement: ReinforcementConfig;
  results: StructuralResults;
}

export function MaterialsList({
  dimensions,
  reinforcement,
  results,
}: MaterialsListProps) {
  const topRebarInfo = getRebarInfo(reinforcement.topRebars.type);
  const bottomRebarInfo = getRebarInfo(reinforcement.bottomRebars.type);
  const stirrupInfo = getRebarInfo(reinforcement.stirrups.type);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Lista de Materiais
            </h3>
            <p className="text-xs text-muted-foreground">
              Relatório técnico completo da viga
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
          </div>
        </div>
      </Card>

      {/* Dimensões */}
      <Card className="p-6 border-border bg-card">
        <h4 className="font-bold text-sm text-foreground mb-4">Dimensões</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Comprimento:</span>
            <span className="font-mono font-bold text-primary">
              {dimensions.length} m
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Largura:</span>
            <span className="font-mono font-bold text-primary">
              {dimensions.width} cm
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Altura:</span>
            <span className="font-mono font-bold text-primary">
              {dimensions.height} cm
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="text-muted-foreground">Volume de Concreto:</span>
            <span className="font-mono font-bold text-primary">
              {(
                (dimensions.length *
                  dimensions.width *
                  dimensions.height) /
                1000000
              ).toFixed(3)}{" "}
              m³
            </span>
          </div>
        </div>
      </Card>

      {/* Armadura */}
      <Card className="p-6 border-border bg-card">
        <h4 className="font-bold text-sm text-foreground mb-4">Armadura</h4>
        <div className="space-y-4">
          {/* Armadura Superior */}
          <div className="pb-4 border-b border-border">
            <h5 className="font-semibold text-xs text-foreground mb-2">
              Armadura Superior
            </h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-mono font-bold text-primary">
                  {reinforcement.topRebars.quantity}x{reinforcement.topRebars.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Área:</span>
                <span className="font-mono font-bold text-primary">
                  {results.topRebarArea.toFixed(0)} mm²
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comprimento total:</span>
                <span className="font-mono font-bold text-primary">
                  {(
                    (topRebarInfo.weight *
                      reinforcement.topRebars.quantity *
                      dimensions.length) /
                    1000
                  ).toFixed(2)}{" "}
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* Armadura Inferior */}
          <div className="pb-4 border-b border-border">
            <h5 className="font-semibold text-xs text-foreground mb-2">
              Armadura Inferior
            </h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-mono font-bold text-primary">
                  {reinforcement.bottomRebars.quantity}x{reinforcement.bottomRebars.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Área:</span>
                <span className="font-mono font-bold text-primary">
                  {results.bottomRebarArea.toFixed(0)} mm²
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comprimento total:</span>
                <span className="font-mono font-bold text-primary">
                  {(
                    (bottomRebarInfo.weight *
                      reinforcement.bottomRebars.quantity *
                      dimensions.length) /
                    1000
                  ).toFixed(2)}{" "}
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* Estribos */}
          <div>
            <h5 className="font-semibold text-xs text-foreground mb-2">
              Estribos
            </h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-mono font-bold text-primary">
                  {reinforcement.stirrups.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Espaçamento:</span>
                <span className="font-mono font-bold text-primary">
                  {reinforcement.stirrups.spacing} cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantidade:</span>
                <span className="font-mono font-bold text-primary">
                  {results.stirrupQuantity} unidades
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peso total:</span>
                <span className="font-mono font-bold text-primary">
                  {(
                    (stirrupInfo.weight *
                      results.stirrupQuantity *
                      (2 * (dimensions.width / 100 + dimensions.height / 100) -
                        0.08)) /
                    1000
                  ).toFixed(2)}{" "}
                  kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Resumo de Materiais */}
      <Card className="p-6 border-border bg-card">
        <h4 className="font-bold text-sm text-foreground mb-4">
          Resumo de Materiais
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between pb-2 border-b border-border">
            <span className="text-muted-foreground">Concreto (m³):</span>
            <span className="font-mono font-bold text-primary">
              {(
                (dimensions.length *
                  dimensions.width *
                  dimensions.height) /
                1000000
              ).toFixed(3)}
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-border">
            <span className="text-muted-foreground">Aço Total (kg):</span>
            <span className="font-mono font-bold text-primary">
              {results.rebarWeight.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between pt-2 font-bold">
            <span className="text-foreground">Peso Total (kg):</span>
            <span className="font-mono text-primary">
              {results.totalWeight.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      {/* Dicas */}
      <Card className="p-6 border-border bg-blue-50 border-blue-200">
        <h4 className="font-bold text-sm text-blue-900 mb-3">
          Dicas para Construção
        </h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Verifique o cobrimento mínimo de concreto (4cm recomendado)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Utilize espaçadores para manter as armaduras no lugar correto
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Compacte bem o concreto para evitar vazios e bolhas de ar
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Cura adequada: manter úmido por pelo menos 7 dias
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Solicite análise técnica de um engenheiro antes de executar
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
