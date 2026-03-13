/**
 * Biblioteca de cálculos estruturais para vigas de concreto aéreas
 * Design Philosophy: Engenharia Moderna Minimalista
 * - Cálculos baseados em normas técnicas (NBR 6118)
 * - Precisão em engenharia estrutural
 */

import {
  BeamDimensions,
  LoadConfiguration,
  ReinforcementConfig,
  StructuralResults,
  RebarInfo,
  CONCRETE_DENSITY,
  STEEL_DENSITY,
  CONCRETE_STRENGTH,
  STEEL_STRENGTH,
  SAFETY_COEFFICIENT_LOAD,
  SAFETY_COEFFICIENT_LIVE,
  SAFETY_COEFFICIENT_MATERIAL,
  SAFETY_COEFFICIENT_STEEL,
  MAX_DEFLECTION_RATIO,
  MIN_REBAR_AREA_RATIO,
} from "@/types/beam";

// Banco de dados de armaduras
const REBAR_DATABASE: Record<string, RebarInfo> = {
  "8mm": {
    type: "8mm",
    diameter: 8,
    area: 50.27,
    weight: 0.395,
  },
  "10mm": {
    type: "10mm",
    diameter: 10,
    area: 78.54,
    weight: 0.617,
  },
  "12mm": {
    type: "12mm",
    diameter: 12,
    area: 113.1,
    weight: 0.888,
  },
  "16mm": {
    type: "16mm",
    diameter: 16,
    area: 201.06,
    weight: 1.578,
  },
  "20mm": {
    type: "20mm",
    diameter: 20,
    area: 314.16,
    weight: 2.466,
  },
  "25mm": {
    type: "25mm",
    diameter: 25,
    area: 490.87,
    weight: 3.853,
  },
};

export function getRebarInfo(type: string): RebarInfo {
  return REBAR_DATABASE[type] || REBAR_DATABASE["12mm"];
}

export function calculateBeamResults(
  dimensions: BeamDimensions,
  loads: LoadConfiguration,
  reinforcement: ReinforcementConfig
): StructuralResults {
  // Converter dimensões para metros
  const L = dimensions.length; // comprimento em m
  const b = dimensions.width / 100; // largura em m
  const h = dimensions.height / 100; // altura em m
  const d = h - 0.04; // altura útil (considerando cobrimento de 4cm)

  // Cálculo de cargas
  const totalDeadLoad = loads.deadLoad * L;
  const totalLiveLoad = loads.liveLoad * L;
  const totalLoad = totalDeadLoad + totalLiveLoad + loads.pointLoad;

  // Cálculo da carga de projeto (com coeficientes de segurança)
  const designLoad =
    loads.deadLoad * SAFETY_COEFFICIENT_LOAD * L +
    loads.liveLoad * SAFETY_COEFFICIENT_LIVE * L +
    loads.pointLoad * SAFETY_COEFFICIENT_LIVE;

  // Cálculo do momento máximo (viga simplesmente apoiada)
  let maxBendingMoment: number;
  if (loads.pointLoad > 0) {
    const a = loads.pointLoadPosition;
    const b_dist = L - a;
    maxBendingMoment =
      (loads.deadLoad * L * L) / 8 +
      (loads.liveLoad * L * L) / 8 +
      (loads.pointLoad * a * b_dist) / L;
  } else {
    maxBendingMoment = (designLoad * L) / 8;
  }

  // Cálculo da força cortante máxima
  const maxShearForce = designLoad / 2 + loads.pointLoad / 2;

  // Cálculo da flecha (deflection)
  const concreteModulus = 21000 + 1900 * CONCRETE_STRENGTH; // MPa
  const momentOfInertia = (b * h ** 3) / 12; // m⁴
  const deflection =
    ((5 * loads.deadLoad * L ** 4) / (384 * concreteModulus * momentOfInertia)) *
    1000; // em mm

  // Informações de armadura
  const topRebarInfo = getRebarInfo(reinforcement.topRebars.type);
  const bottomRebarInfo = getRebarInfo(reinforcement.bottomRebars.type);
  const stirrupInfo = getRebarInfo(reinforcement.stirrups.type);

  const topRebarArea = topRebarInfo.area * reinforcement.topRebars.quantity;
  const bottomRebarArea =
    bottomRebarInfo.area * reinforcement.bottomRebars.quantity;
  const totalRebarArea = topRebarArea + bottomRebarArea;

  // Quantidade de estribos
  const stirrupQuantity = Math.ceil(L * 100 / reinforcement.stirrups.spacing);

  // Cálculo de pesos
  const concreteVolume = b * h * L; // m³
  const concreteWeight = concreteVolume * CONCRETE_DENSITY; // kg

  const topRebarWeight =
    (topRebarInfo.weight * reinforcement.topRebars.quantity * L) / 1000; // kg
  const bottomRebarWeight =
    (bottomRebarInfo.weight * reinforcement.bottomRebars.quantity * L) / 1000; // kg
  const stirrupWeight =
    (stirrupInfo.weight * stirrupQuantity * (2 * (b + h) - 0.08)) / 1000; // kg
  const rebarWeight = topRebarWeight + bottomRebarWeight + stirrupWeight;

  const totalWeight = concreteWeight + rebarWeight;

  // Cálculo de capacidades
  const bendingMomentCapacity = calculateMomentCapacity(
    bottomRebarArea,
    d,
    b,
    CONCRETE_STRENGTH,
    STEEL_STRENGTH
  );

  const shearCapacity = calculateShearCapacity(
    b,
    d,
    stirrupInfo.area * stirrupQuantity,
    reinforcement.stirrups.spacing / 100,
    CONCRETE_STRENGTH
  );

  // Cálculos de utilização
  const bendingMomentUtilization = Math.min(
    (maxBendingMoment / bendingMomentCapacity) * 100,
    100
  );
  const shearUtilization = Math.min(
    (maxShearForce / shearCapacity) * 100,
    100
  );
  const deflectionLimit = L * 1000 / MAX_DEFLECTION_RATIO;
  const deflectionUtilization = Math.min(
    (deflection / deflectionLimit) * 100,
    100
  );

  // Fator de segurança geral
  const safetyFactor = Math.min(
    bendingMomentCapacity / maxBendingMoment,
    shearCapacity / maxShearForce,
    deflectionLimit / deflection
  );

  // Verificações de segurança
  const isSafe =
    bendingMomentUtilization <= 100 &&
    shearUtilization <= 100 &&
    deflectionUtilization <= 100 &&
    totalRebarArea >= b * h * MIN_REBAR_AREA_RATIO;

  // Avisos
  const warnings: string[] = [];
  if (bendingMomentUtilization > 90)
    warnings.push("Momento fletor próximo ao limite");
  if (shearUtilization > 90) warnings.push("Força cortante próxima ao limite");
  if (deflectionUtilization > 90) warnings.push("Flecha próxima ao limite");
  if (totalRebarArea < b * h * MIN_REBAR_AREA_RATIO)
    warnings.push("Armadura abaixo do mínimo normativo");
  if (!isSafe) warnings.push("Viga NÃO atende aos critérios de segurança");

  return {
    totalDeadLoad,
    totalLiveLoad,
    totalLoad,
    designLoad,
    maxBendingMoment,
    maxShearForce,
    deflection,
    topRebarArea,
    bottomRebarArea,
    totalRebarArea,
    stirrupQuantity,
    concreteWeight,
    rebarWeight,
    totalWeight,
    bendingMomentCapacity,
    bendingMomentUtilization,
    shearCapacity,
    shearUtilization,
    deflectionLimit,
    deflectionUtilization,
    safetyFactor,
    isSafe,
    warnings,
  };
}

function calculateMomentCapacity(
  As: number, // área de aço em mm²
  d: number, // altura útil em m
  b: number, // largura em m
  fc: number, // resistência do concreto em MPa
  fy: number // resistência do aço em MPa
): number {
  // Cálculo simplificado da capacidade de momento
  // Usando método de equilíbrio de seções
  const rho = As / (b * d * 1e6); // taxa de armadura
  const fy_design = fy / SAFETY_COEFFICIENT_STEEL;
  const fc_design = fc / SAFETY_COEFFICIENT_MATERIAL;

  // Altura da zona comprimida
  const lambda = 0.85; // coeficiente de redução
  const beta1 = 0.85;
  const c = (rho * fy_design * d) / (0.85 * fc_design * beta1);

  // Braço de alavanca
  const z = d - (lambda * c) / 2;

  // Momento resistente em kN.m
  const Md = (As * fy_design * z) / 1e6;

  return Math.max(Md, 0.1); // mínimo de 0.1 kN.m
}

function calculateShearCapacity(
  b: number, // largura em m
  d: number, // altura útil em m
  Asw: number, // área de estribos em mm²
  s: number, // espaçamento em m
  fc: number // resistência do concreto em MPa
): number {
  // Cálculo simplificado da capacidade de corte
  const Vc = 0.17 * Math.sqrt(fc) * b * d * 1e3; // em N
  const Vs = (Asw * 500 * d) / (s * 1e3); // em N (assumindo fy=500 MPa)

  // Força cortante resistente em kN
  const Vd = (Vc + Vs) / 1e3;

  return Math.max(Vd, 0.1); // mínimo de 0.1 kN
}

// Função auxiliar para validar dimensões
export function validateDimensions(dimensions: BeamDimensions): string[] {
  const errors: string[] = [];

  if (dimensions.length < 1 || dimensions.length > 50)
    errors.push("Comprimento deve estar entre 1m e 50m");
  if (dimensions.width < 10 || dimensions.width > 100)
    errors.push("Largura deve estar entre 10cm e 100cm");
  if (dimensions.height < 20 || dimensions.height > 150)
    errors.push("Altura deve estar entre 20cm e 150cm");

  return errors;
}

// Função auxiliar para validar cargas
export function validateLoads(loads: LoadConfiguration): string[] {
  const errors: string[] = [];

  if (loads.deadLoad < 0 || loads.deadLoad > 100)
    errors.push("Carga permanente deve estar entre 0 e 100 kN/m");
  if (loads.liveLoad < 0 || loads.liveLoad > 100)
    errors.push("Carga acidental deve estar entre 0 e 100 kN/m");
  if (loads.pointLoad < 0 || loads.pointLoad > 500)
    errors.push("Carga pontual deve estar entre 0 e 500 kN");

  return errors;
}
