/**
 * Componente de guia e dicas para construtores
 * Design Philosophy: Engenharia Moderna Minimalista
 * - Informações técnicas acessíveis
 * - Dicas práticas de construção
 */

import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Wrench,
} from "lucide-react";

export function ConstructorGuide() {
  return (
    <div className="space-y-6">
      {/* Introdução */}
      <Card className="p-6 border-border bg-card">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-foreground mb-2">
              Guia do Construtor
            </h3>
            <p className="text-sm text-muted-foreground">
              Esta calculadora foi desenvolvida para auxiliar pequenos
              construtores no dimensionamento de vigas de concreto aéreas.
              Sempre consulte um engenheiro estrutural antes de executar
              qualquer obra.
            </p>
          </div>
        </div>
      </Card>

      {/* Passo a Passo */}
      <Card className="p-6 border-border bg-card">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" />
          Passo a Passo de Uso
        </h3>
        <div className="space-y-3">
          {[
            {
              step: 1,
              title: "Defina as Dimensões",
              description:
                "Insira o comprimento, largura e altura da viga em metros e centímetros",
            },
            {
              step: 2,
              title: "Configure as Cargas",
              description:
                "Informe as cargas permanentes, acidentais e pontuais que a viga suportará",
            },
            {
              step: 3,
              title: "Escolha a Armadura",
              description:
                "Selecione os tipos e quantidades de barras de aço para a armadura",
            },
            {
              step: 4,
              title: "Calcule",
              description:
                "Clique em 'Calcular Viga' para obter os resultados técnicos",
            },
            {
              step: 5,
              title: "Analise os Resultados",
              description:
                "Verifique se a viga está segura e consulte as visualizações 2D e 3D",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                {item.step}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Dicas de Segurança */}
      <Card className="p-6 border-border bg-yellow-50 border-yellow-200">
        <h3 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          Dicas de Segurança
        </h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li className="flex gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>
              Sempre verifique se a viga está marcada como "Segura" antes de
              executar
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>
              Avisos em amarelo indicam que a viga está próxima aos limites de
              segurança
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>
              Fator de segurança abaixo de 1.5 é considerado inadequado
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>
              Sempre consulte um engenheiro estrutural para validação final
            </span>
          </li>
        </ul>
      </Card>

      {/* Dicas de Construção */}
      <Card className="p-6 border-border bg-card">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Dicas de Construção
        </h3>
        <div className="space-y-4">
          {[
            {
              title: "Cobrimento de Concreto",
              content:
                "Mantenha um cobrimento mínimo de 4cm entre as armaduras e a superfície do concreto. Use espaçadores para garantir isso.",
            },
            {
              title: "Espaçamento de Armaduras",
              content:
                "Verifique se há espaço suficiente entre as barras de aço para que o concreto possa fluir e preencher todos os vazios.",
            },
            {
              title: "Compactação do Concreto",
              content:
                "Use vibrador de concreto para compactar bem e eliminar bolhas de ar. Isso aumenta a resistência e durabilidade da viga.",
            },
            {
              title: "Cura do Concreto",
              content:
                "Mantenha o concreto úmido por pelo menos 7 dias após a concretagem. Isso garante uma cura adequada e maior resistência.",
            },
            {
              title: "Desforma",
              content:
                "Não remova a fôrma antes de 14 dias. Para vigas com cargas elevadas, aguarde até 28 dias.",
            },
            {
              title: "Inspeção Visual",
              content:
                "Após a desforma, inspecione visualmente a viga. Procure por fissuras, segregação ou outros defeitos.",
            },
          ].map((tip, idx) => (
            <div key={idx} className="pb-4 border-b border-border last:border-b-0">
              <h4 className="font-semibold text-sm text-foreground mb-2">
                {tip.title}
              </h4>
              <p className="text-xs text-muted-foreground">{tip.content}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Normas Técnicas */}
      <Card className="p-6 border-border bg-card">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Normas Técnicas Utilizadas
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>NBR 6118:2014</strong> - Projeto de estruturas de concreto
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>NBR 6120:2019</strong> - Ações e segurança nas estruturas
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Concreto C25</strong> - Resistência característica de 25
              MPa
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Aço CA-50</strong> - Resistência de 500 MPa
            </span>
          </li>
        </ul>
      </Card>

      {/* Aviso Legal */}
      <Card className="p-6 border-border bg-red-50 border-red-200">
        <h3 className="font-bold text-red-900 mb-2">Aviso Legal</h3>
        <p className="text-xs text-red-800">
          Esta calculadora é fornecida como ferramenta educacional e de
          referência. Os resultados devem ser validados por um engenheiro
          estrutural qualificado antes de qualquer execução. Os desenvolvedores
          não se responsabilizam por erros de cálculo ou danos resultantes do
          uso inadequado desta ferramenta. Sempre consulte as normas técnicas
          vigentes e legislação local.
        </p>
      </Card>
    </div>
  );
}
