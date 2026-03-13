/**
 * Componente de entrada de cargas na viga
 * Design Philosophy: Engenharia Moderna Minimalista
 * - Inputs para cargas permanentes, acidentais e pontuais
 * - Visualização de distribuição de cargas
 */

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Weight } from "lucide-react";
import { LoadConfiguration } from "@/types/beam";

interface LoadsInputProps {
  loads: LoadConfiguration;
  beamLength: number;
  onChange: (loads: Partial<LoadConfiguration>) => void;
}

export function LoadsInput({
  loads,
  beamLength,
  onChange,
}: LoadsInputProps) {
  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center gap-2 mb-6">
        <Weight className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Cargas</h3>
      </div>

      <div className="space-y-6">
        {/* Carga Permanente */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <Label className="text-sm font-semibold text-foreground">
              Carga Permanente (kN/m)
            </Label>
            <span className="text-sm font-mono text-primary">
              {loads.deadLoad.toFixed(2)} kN/m
            </span>
          </div>
          <Slider
            value={[loads.deadLoad]}
            onValueChange={(value) => onChange({ deadLoad: value[0] })}
            min={0}
            max={100}
            step={0.5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Total: {(loads.deadLoad * beamLength).toFixed(2)} kN
          </p>
        </div>

        {/* Carga Acidental */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <Label className="text-sm font-semibold text-foreground">
              Carga Acidental (kN/m)
            </Label>
            <span className="text-sm font-mono text-primary">
              {loads.liveLoad.toFixed(2)} kN/m
            </span>
          </div>
          <Slider
            value={[loads.liveLoad]}
            onValueChange={(value) => onChange({ liveLoad: value[0] })}
            min={0}
            max={100}
            step={0.5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Total: {(loads.liveLoad * beamLength).toFixed(2)} kN
          </p>
        </div>

        {/* Carga Pontual */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between items-baseline">
            <Label className="text-sm font-semibold text-foreground">
              Carga Pontual (kN)
            </Label>
            <span className="text-sm font-mono text-primary">
              {loads.pointLoad.toFixed(2)} kN
            </span>
          </div>
          <Slider
            value={[loads.pointLoad]}
            onValueChange={(value) => onChange({ pointLoad: value[0] })}
            min={0}
            max={500}
            step={5}
            className="w-full"
          />

          {loads.pointLoad > 0 && (
            <div className="space-y-3 mt-4 p-3 bg-secondary rounded-lg border border-border">
              <Label className="text-xs font-semibold text-foreground">
                Posição da Carga Pontual (m)
              </Label>
              <Slider
                value={[loads.pointLoadPosition]}
                onValueChange={(value) =>
                  onChange({ pointLoadPosition: value[0] })
                }
                min={0}
                max={beamLength}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground font-mono">
                Posição: {loads.pointLoadPosition.toFixed(2)}m do início
              </p>
            </div>
          )}
        </div>

        {/* Resumo de Cargas */}
        <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
          <p className="text-xs text-muted-foreground font-mono mb-3">
            Resumo de Cargas:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground">Carga Total Permanente:</span>
              <span className="font-mono text-primary">
                {(loads.deadLoad * beamLength).toFixed(2)} kN
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Carga Total Acidental:</span>
              <span className="font-mono text-primary">
                {(loads.liveLoad * beamLength).toFixed(2)} kN
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Carga Pontual:</span>
              <span className="font-mono text-primary">
                {loads.pointLoad.toFixed(2)} kN
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold">
              <span className="text-foreground">Carga Total:</span>
              <span className="font-mono text-primary">
                {(
                  loads.deadLoad * beamLength +
                  loads.liveLoad * beamLength +
                  loads.pointLoad
                ).toFixed(2)}{" "}
                kN
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
