/**
 * Hook customizado para gerenciar o estado da calculadora de vigas
 * Design Philosophy: Engenharia Moderna Minimalista
 * - Gerenciamento centralizado de estado
 * - Reatividade automática de cálculos
 */

import { useState, useCallback, useMemo } from "react";
import {
  BeamDimensions,
  LoadConfiguration,
  ReinforcementConfig,
  StructuralResults,
} from "@/types/beam";
import {
  calculateBeamResults,
  validateDimensions,
  validateLoads,
} from "@/lib/beamCalculations";

export interface UseBeamCalculatorState {
  dimensions: BeamDimensions;
  loads: LoadConfiguration;
  reinforcement: ReinforcementConfig;
  results: StructuralResults | null;
  errors: string[];
  isCalculating: boolean;
}

export interface UseBeamCalculatorActions {
  updateDimensions: (dimensions: Partial<BeamDimensions>) => void;
  updateLoads: (loads: Partial<LoadConfiguration>) => void;
  updateReinforcement: (reinforcement: Partial<ReinforcementConfig>) => void;
  calculate: () => void;
  reset: () => void;
}

const DEFAULT_DIMENSIONS: BeamDimensions = {
  length: 6,
  width: 20,
  height: 40,
};

const DEFAULT_LOADS: LoadConfiguration = {
  deadLoad: 5,
  liveLoad: 5,
  pointLoad: 0,
  pointLoadPosition: 3,
};

const DEFAULT_REINFORCEMENT: ReinforcementConfig = {
  topRebars: {
    type: "12mm",
    quantity: 2,
  },
  bottomRebars: {
    type: "12mm",
    quantity: 3,
  },
  stirrups: {
    type: "8mm",
    spacing: 15,
  },
};

export function useBeamCalculator(): UseBeamCalculatorState &
  UseBeamCalculatorActions {
  const [dimensions, setDimensions] = useState<BeamDimensions>(
    DEFAULT_DIMENSIONS
  );
  const [loads, setLoads] = useState<LoadConfiguration>(DEFAULT_LOADS);
  const [reinforcement, setReinforcement] = useState<ReinforcementConfig>(
    DEFAULT_REINFORCEMENT
  );
  const [results, setResults] = useState<StructuralResults | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateDimensions = useCallback((newDimensions: Partial<BeamDimensions>) => {
    setDimensions((prev) => ({ ...prev, ...newDimensions }));
  }, []);

  const updateLoads = useCallback((newLoads: Partial<LoadConfiguration>) => {
    setLoads((prev) => ({ ...prev, ...newLoads }));
  }, []);

  const updateReinforcement = useCallback(
    (newReinforcement: Partial<ReinforcementConfig>) => {
      setReinforcement((prev) => ({ ...prev, ...newReinforcement }));
    },
    []
  );

  const calculate = useCallback(() => {
    setIsCalculating(true);
    setErrors([]);

    // Validações
    const dimensionErrors = validateDimensions(dimensions);
    const loadErrors = validateLoads(loads);
    const allErrors = [...dimensionErrors, ...loadErrors];

    if (allErrors.length > 0) {
      setErrors(allErrors);
      setIsCalculating(false);
      return;
    }

    // Simular processamento
    setTimeout(() => {
      try {
        const calculatedResults = calculateBeamResults(
          dimensions,
          loads,
          reinforcement
        );
        setResults(calculatedResults);
      } catch (error) {
        setErrors([
          "Erro ao calcular. Verifique os valores inseridos.",
        ]);
      } finally {
        setIsCalculating(false);
      }
    }, 300);
  }, [dimensions, loads, reinforcement]);

  const reset = useCallback(() => {
    setDimensions(DEFAULT_DIMENSIONS);
    setLoads(DEFAULT_LOADS);
    setReinforcement(DEFAULT_REINFORCEMENT);
    setResults(null);
    setErrors([]);
  }, []);

  // Auto-calculate quando valores mudam (opcional)
  useMemo(() => {
    if (results) {
      calculate();
    }
  }, [dimensions, loads, reinforcement]);

  return {
    dimensions,
    loads,
    reinforcement,
    results,
    errors,
    isCalculating,
    updateDimensions,
    updateLoads,
    updateReinforcement,
    calculate,
    reset,
  };
}
