/**
 * Tipos para o sistema de cálculo de vigas de concreto aéreas
 * Design Philosophy: Engenharia Moderna Minimalista
 * - Tipagem forte para cálculos estruturais
 * - Valores em unidades técnicas (m, cm, kN, mm²)
 */

export interface BeamDimensions {
  length: number; // comprimento em metros
  width: number; // largura em centímetros
  height: number; // altura em centímetros
}

export interface LoadConfiguration {
  deadLoad: number; // carga permanente em kN/m
  liveLoad: number; // carga acidental em kN/m
  pointLoad: number; // carga pontual em kN
  pointLoadPosition: number; // posição da carga pontual em metros (0 a length)
}

export type RebarType = "8mm" | "10mm" | "12mm" | "16mm" | "20mm" | "25mm";

export interface RebarInfo {
  type: RebarType;
  diameter: number; // diâmetro em mm
  area: number; // área em mm²
  weight: number; // peso por metro em kg/m
}

export interface ReinforcementConfig {
  topRebars: {
    type: RebarType;
    quantity: number;
  };
  bottomRebars: {
    type: RebarType;
    quantity: number;
  };
  stirrups: {
    type: RebarType;
    spacing: number; // espaçamento em cm
  };
}

export interface StructuralResults {
  // Cargas
  totalDeadLoad: number; // carga total permanente em kN
  totalLiveLoad: number; // carga total acidental em kN
  totalLoad: number; // carga total em kN
  designLoad: number; // carga de projeto em kN (com coeficientes de segurança)

  // Momentos e esforços
  maxBendingMoment: number; // momento máximo em kN.m
  maxShearForce: number; // força cortante máxima em kN
  deflection: number; // flecha máxima em mm

  // Armadura
  topRebarArea: number; // área de aço superior em mm²
  bottomRebarArea: number; // área de aço inferior em mm²
  totalRebarArea: number; // área total de aço em mm²
  stirrupQuantity: number; // quantidade de estribos

  // Pesos
  concreteWeight: number; // peso do concreto em kg
  rebarWeight: number; // peso da armadura em kg
  totalWeight: number; // peso total em kg

  // Verificações
  bendingMomentCapacity: number; // capacidade de momento em kN.m
  bendingMomentUtilization: number; // utilização em % (0-100)
  shearCapacity: number; // capacidade de corte em kN
  shearUtilization: number; // utilização em %
  deflectionLimit: number; // limite de flecha em mm
  deflectionUtilization: number; // utilização em %
  safetyFactor: number; // fator de segurança geral

  // Status
  isSafe: boolean; // viga atende aos critérios de segurança
  warnings: string[]; // avisos de projeto
}

export interface VisualizationData {
  dimensions: BeamDimensions;
  loads: LoadConfiguration;
  reinforcement: ReinforcementConfig;
  results: StructuralResults;
}

export interface BeamActionRecommendation {
  title: string;
  impact: "high" | "medium" | "low";
  description: string;
}

export interface BeamAlternativeScenario {
  name: string;
  focus: "economia" | "equilibrio" | "seguranca";
  estimatedWeightDelta: number;
  estimatedSafetyFactor: number;
  estimatedMomentUtilization: number;
  isSafe: boolean;
}

export interface BeamDecisionSupport {
  summary: string;
  recommendations: BeamActionRecommendation[];
  alternatives: BeamAlternativeScenario[];
}

// Constantes de projeto
export const CONCRETE_DENSITY = 2400; // kg/m³
export const STEEL_DENSITY = 7850; // kg/m³
export const CONCRETE_STRENGTH = 25; // MPa (C25)
export const STEEL_STRENGTH = 500; // MPa (CA-50)

// Coeficientes de segurança
export const SAFETY_COEFFICIENT_LOAD = 1.4; // para carga permanente
export const SAFETY_COEFFICIENT_LIVE = 1.6; // para carga acidental
export const SAFETY_COEFFICIENT_MATERIAL = 1.4; // para resistência do concreto
export const SAFETY_COEFFICIENT_STEEL = 1.15; // para resistência do aço

// Limites de projeto
export const MAX_DEFLECTION_RATIO = 250; // L/250 para vigas
export const MIN_CONCRETE_COVER = 25; // mm (cobrimento mínimo)
export const MIN_REBAR_AREA_RATIO = 0.0015; // razão mínima de armadura
