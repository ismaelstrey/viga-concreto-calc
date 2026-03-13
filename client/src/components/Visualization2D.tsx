/**
 * Componente de visualização 2D da viga com armaduras
 * Design: Dark Mode Profissional - Similar ao StructuraCalc
 * - Desenho técnico de corte transversal
 * - Cores técnicas (laranja para aço, cinza para concreto)
 * - Interatividade com zoom
 */

import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  BeamDimensions,
  LoadConfiguration,
  ReinforcementConfig,
  StructuralResults,
} from "@/types/beam";

interface Visualization2DProps {
  dimensions: BeamDimensions;
  loads: LoadConfiguration;
  reinforcement: ReinforcementConfig;
  results: StructuralResults;
}

export function Visualization2D({
  dimensions,
  loads,
  reinforcement,
  results,
}: Visualization2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpar canvas com fundo escuro
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dimensões em pixels (escala)
    const scale = 2; // pixels por cm
    const w = dimensions.width * scale;
    const h = dimensions.height * scale;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Desenhar concreto (fundo cinza escuro)
    ctx.fillStyle = "#475569";
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.fillRect(centerX - w / 2, centerY - h / 2, w, h);
    ctx.strokeRect(centerX - w / 2, centerY - h / 2, w, h);

    // Desenhar padrão de concreto com textura
    ctx.fillStyle = "#64748b";
    for (let i = centerX - w / 2; i < centerX + w / 2; i += 15) {
      for (let j = centerY - h / 2; j < centerY + h / 2; j += 15) {
        if ((i + j) % 30 === 0) {
          ctx.fillRect(i, j, 8, 8);
        }
      }
    }

    // Desenhar armadura superior (laranja)
    const topRebarRadius = (reinforcement.topRebars.type.match(/\d+/) || ["12"])[0];
    const topRebarDiameter = (parseInt(topRebarRadius) / 10) * scale;
    const topSpacing = (w - topRebarDiameter * 2) / (reinforcement.topRebars.quantity - 1 || 1);

    ctx.fillStyle = "#f97316";
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < reinforcement.topRebars.quantity; i++) {
      const x = centerX - w / 2 + topRebarDiameter + i * topSpacing;
      const y = centerY - h / 2 + topRebarDiameter + 3;
      ctx.beginPath();
      ctx.arc(x, y, topRebarDiameter / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Desenhar armadura inferior (azul)
    const bottomRebarRadius = (reinforcement.bottomRebars.type.match(/\d+/) || ["12"])[0];
    const bottomRebarDiameter = (parseInt(bottomRebarRadius) / 10) * scale;
    const bottomSpacing = (w - bottomRebarDiameter * 2) / (reinforcement.bottomRebars.quantity - 1 || 1);

    ctx.fillStyle = "#3b82f6";
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < reinforcement.bottomRebars.quantity; i++) {
      const x = centerX - w / 2 + bottomRebarDiameter + i * bottomSpacing;
      const y = centerY + h / 2 - bottomRebarDiameter - 3;
      ctx.beginPath();
      ctx.arc(x, y, bottomRebarDiameter / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Desenhar dimensões
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 12px 'IBM Plex Mono'";
    ctx.textAlign = "center";
    ctx.fillText(`${dimensions.width} cm`, centerX, centerY + h / 2 + 25);
    
    ctx.textAlign = "right";
    ctx.fillText(`${dimensions.height} cm`, centerX - w / 2 - 15, centerY);

    // Desenhar setas de dimensão
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    
    // Seta horizontal
    ctx.beginPath();
    ctx.moveTo(centerX - w / 2, centerY + h / 2 + 15);
    ctx.lineTo(centerX + w / 2, centerY + h / 2 + 15);
    ctx.stroke();

    // Seta vertical
    ctx.beginPath();
    ctx.moveTo(centerX - w / 2 - 10, centerY - h / 2);
    ctx.lineTo(centerX - w / 2 - 10, centerY + h / 2);
    ctx.stroke();
  }, [dimensions, loads, reinforcement]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full h-full max-w-full"
      />
    </div>
  );
}
