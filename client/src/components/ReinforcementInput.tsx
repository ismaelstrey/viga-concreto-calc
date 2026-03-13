/**
 * Componente de entrada de armadura da viga
 * Design Philosophy: Engenharia Moderna Minimalista
 * - Seleção de tipos de barras de aço
 * - Configuração de estribos
 */

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap } from "lucide-react";
import { ReinforcementConfig, RebarType } from "@/types/beam";

interface ReinforcementInputProps {
  reinforcement: ReinforcementConfig;
  onChange: (reinforcement: Partial<ReinforcementConfig>) => void;
}

const REBAR_OPTIONS: RebarType[] = ["8mm", "10mm", "12mm", "16mm", "20mm", "25mm"];

export function ReinforcementInput({
  reinforcement,
  onChange,
}: ReinforcementInputProps) {
  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Armadura</h3>
      </div>

      <div className="space-y-6">
        {/* Armadura Superior */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Armadura Superior
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="top-type" className="text-xs font-semibold text-foreground">
                Tipo de Barra
              </Label>
              <Select
                value={reinforcement.topRebars.type}
                onValueChange={(value) =>
                  onChange({
                    topRebars: { ...reinforcement.topRebars, type: value as RebarType },
                  })
                }
              >
                <SelectTrigger id="top-type" className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REBAR_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="top-qty" className="text-xs font-semibold text-foreground">
                Quantidade
              </Label>
              <Input
                id="top-qty"
                type="number"
                min="1"
                max="10"
                value={reinforcement.topRebars.quantity}
                onChange={(e) =>
                  onChange({
                    topRebars: {
                      ...reinforcement.topRebars,
                      quantity: parseInt(e.target.value) || 1,
                    },
                  })
                }
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Armadura Inferior */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground">
            Armadura Inferior
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bottom-type" className="text-xs font-semibold text-foreground">
                Tipo de Barra
              </Label>
              <Select
                value={reinforcement.bottomRebars.type}
                onValueChange={(value) =>
                  onChange({
                    bottomRebars: {
                      ...reinforcement.bottomRebars,
                      type: value as RebarType,
                    },
                  })
                }
              >
                <SelectTrigger id="bottom-type" className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REBAR_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bottom-qty" className="text-xs font-semibold text-foreground">
                Quantidade
              </Label>
              <Input
                id="bottom-qty"
                type="number"
                min="1"
                max="10"
                value={reinforcement.bottomRebars.quantity}
                onChange={(e) =>
                  onChange({
                    bottomRebars: {
                      ...reinforcement.bottomRebars,
                      quantity: parseInt(e.target.value) || 1,
                    },
                  })
                }
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Estribos */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground">Estribos</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stirrup-type" className="text-xs font-semibold text-foreground">
                Tipo de Barra
              </Label>
              <Select
                value={reinforcement.stirrups.type}
                onValueChange={(value) =>
                  onChange({
                    stirrups: {
                      ...reinforcement.stirrups,
                      type: value as RebarType,
                    },
                  })
                }
              >
                <SelectTrigger id="stirrup-type" className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REBAR_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stirrup-spacing" className="text-xs font-semibold text-foreground">
                Espaçamento (cm)
              </Label>
              <Input
                id="stirrup-spacing"
                type="number"
                min="5"
                max="30"
                step="5"
                value={reinforcement.stirrups.spacing}
                onChange={(e) =>
                  onChange({
                    stirrups: {
                      ...reinforcement.stirrups,
                      spacing: parseFloat(e.target.value) || 15,
                    },
                  })
                }
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Informações */}
        <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
          <p className="text-xs text-muted-foreground font-mono mb-3">
            Configuração de Armadura:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-foreground">Superior:</span>
              <span className="font-mono text-primary">
                {reinforcement.topRebars.quantity}x{reinforcement.topRebars.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Inferior:</span>
              <span className="font-mono text-primary">
                {reinforcement.bottomRebars.quantity}x{reinforcement.bottomRebars.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Estribos:</span>
              <span className="font-mono text-primary">
                {reinforcement.stirrups.type} a cada {reinforcement.stirrups.spacing}cm
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
