/**
 * Componente de entrada de dimensões da viga
 * Design Philosophy: Engenharia Moderna Minimalista
 * - Inputs claros e organizados
 * - Validação em tempo real
 * - Tipografia técnica com IBM Plex Sans
 */

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler } from "lucide-react";
import { BeamDimensions } from "@/types/beam";

interface DimensionsInputProps {
  dimensions: BeamDimensions;
  onChange: (dimensions: Partial<BeamDimensions>) => void;
}

export function DimensionsInput({
  dimensions,
  onChange,
}: DimensionsInputProps) {
  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center gap-2 mb-6">
        <Ruler className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Dimensões da Viga</h3>
      </div>

      <div className="space-y-4">
        {/* Comprimento */}
        <div className="space-y-2">
          <Label htmlFor="length" className="text-sm font-semibold text-foreground">
            Comprimento (m)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="length"
              type="number"
              min="1"
              max="50"
              step="0.5"
              value={dimensions.length}
              onChange={(e) =>
                onChange({ length: parseFloat(e.target.value) || 0 })
              }
              className="flex-1 bg-input text-foreground border-border"
            />
            <span className="text-xs text-muted-foreground font-mono">m</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Entre 1m e 50m de comprimento
          </p>
        </div>

        {/* Largura */}
        <div className="space-y-2">
          <Label htmlFor="width" className="text-sm font-semibold text-foreground">
            Largura (cm)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="width"
              type="number"
              min="10"
              max="100"
              step="5"
              value={dimensions.width}
              onChange={(e) =>
                onChange({ width: parseFloat(e.target.value) || 0 })
              }
              className="flex-1 bg-input text-foreground border-border"
            />
            <span className="text-xs text-muted-foreground font-mono">cm</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Entre 10cm e 100cm de largura
          </p>
        </div>

        {/* Altura */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-semibold text-foreground">
            Altura (cm)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="height"
              type="number"
              min="20"
              max="150"
              step="5"
              value={dimensions.height}
              onChange={(e) =>
                onChange({ height: parseFloat(e.target.value) || 0 })
              }
              className="flex-1 bg-input text-foreground border-border"
            />
            <span className="text-xs text-muted-foreground font-mono">cm</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Entre 20cm e 150cm de altura
          </p>
        </div>

        {/* Resumo visual */}
        <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
          <p className="text-xs text-muted-foreground font-mono mb-2">
            Proporção da seção transversal:
          </p>
          <div className="flex items-center justify-center gap-4">
            <div
              className="bg-primary/20 border-2 border-primary rounded"
              style={{
                width: `${Math.min((dimensions.width / 100) * 40, 60)}px`,
                height: `${Math.min((dimensions.height / 100) * 40, 80)}px`,
              }}
            />
            <div className="text-xs text-foreground font-mono">
              <div>{dimensions.width}cm × {dimensions.height}cm</div>
              <div className="text-muted-foreground">
                Proporção: 1:{(dimensions.height / dimensions.width).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
