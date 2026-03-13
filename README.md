# Calculadora de Vigas de Concreto Aéreas

Uma aplicação web interativa para cálculo estrutural de vigas de concreto aéreas, desenvolvida especialmente para pequenos construtores que precisam de referências técnicas confiáveis.

## Características Principais

### Cálculos Estruturais Completos
- **Dimensionamento automático** de vigas com base em cargas
- **Análise de resistência** (momento fletor, força cortante, flecha)
- **Cálculo de armaduras** (barras superiores, inferiores e estribos)
- **Estimativa de pesos** (concreto e aço)
- **Verificações de segurança** com indicadores visuais

### Visualizações Interativas
- **Visualização 2D**: Corte transversal técnico com zoom e pan
- **Visualização 3D**: Renderização isométrica interativa com Three.js
- **Indicadores de segurança**: Cores que indicam estado da viga (verde/amarelo/vermelho)

### Funcionalidades Extras
- **Lista de Materiais**: Relatório completo com quantidades e pesos
- **Guia do Construtor**: Dicas práticas e normas técnicas
- **Impressão**: Exportação de relatórios técnicos
- **Interface Responsiva**: Funciona em desktop, tablet e mobile

## Como Usar

### 1. Defina as Dimensões da Viga
Insira o comprimento, largura e altura da viga em metros e centímetros. A aplicação mostra a proporção visual em tempo real.

### 2. Configure as Cargas
- **Carga Permanente**: Peso próprio e cargas fixas (kN/m)
- **Carga Acidental**: Sobrecargas e cargas variáveis (kN/m)
- **Carga Pontual**: Cargas concentradas (kN) e sua posição

### 3. Escolha a Armadura
Selecione os tipos e quantidades de barras de aço:
- Armadura superior (compressão)
- Armadura inferior (tração)
- Estribos (cisalhamento)

### 4. Calcule
Clique em "Calcular Viga" para obter os resultados técnicos completos.

### 5. Analise os Resultados
- **Aba Resultados**: Dados técnicos detalhados
- **Aba 2D**: Visualização técnica do corte transversal
- **Aba 3D**: Modelo 3D interativo
- **Aba Materiais**: Lista completa de materiais necessários

## Interpretando os Resultados

### Status de Segurança
- **Verde (≤70%)**: Viga segura com margem confortável
- **Amarelo (70-90%)**: Viga segura, mas próxima aos limites
- **Vermelho (>90%)**: Viga não segura, redimensionar

### Fator de Segurança
- **> 2.0**: Excelente (muito conservador)
- **1.5 - 2.0**: Bom (recomendado)
- **1.0 - 1.5**: Aceitável (consulte engenheiro)
- **< 1.0**: Inadequado (viga não segura)

### Verificações
1. **Momento Fletor**: Resistência à flexão
2. **Força Cortante**: Resistência ao cisalhamento
3. **Flecha**: Deformação máxima permitida

## Normas Técnicas

A calculadora utiliza as seguintes normas brasileiras:
- **NBR 6118:2014** - Projeto de estruturas de concreto
- **NBR 6120:2019** - Ações e segurança nas estruturas
- **Concreto C25** - Resistência característica de 25 MPa
- **Aço CA-50** - Resistência de 500 MPa

## Dicas de Construção

### Cobrimento de Concreto
Mantenha um cobrimento mínimo de 4cm entre as armaduras e a superfície do concreto. Use espaçadores para garantir isso.

### Compactação
Use vibrador de concreto para compactar bem e eliminar bolhas de ar. Isso aumenta a resistência e durabilidade.

### Cura
Mantenha o concreto úmido por pelo menos 7 dias após a concretagem para garantir uma cura adequada.

### Desforma
Não remova a fôrma antes de 14 dias. Para vigas com cargas elevadas, aguarde até 28 dias.

## Aviso Legal

**IMPORTANTE**: Esta calculadora é fornecida como ferramenta educacional e de referência. Os resultados devem ser validados por um engenheiro estrutural qualificado antes de qualquer execução. Os desenvolvedores não se responsabilizam por erros de cálculo ou danos resultantes do uso inadequado desta ferramenta.

**Sempre consulte as normas técnicas vigentes e legislação local antes de executar qualquer obra.**

## Tecnologias Utilizadas

- **React 19**: Framework JavaScript
- **TypeScript**: Tipagem estática
- **Tailwind CSS 4**: Estilização
- **Three.js**: Renderização 3D
- **React Three Fiber**: Integração React com Three.js
- **shadcn/ui**: Componentes UI profissionais
- **IBM Plex Sans/Mono**: Tipografia técnica

## Estrutura do Projeto

```
client/
├── src/
│   ├── components/        # Componentes React
│   ├── hooks/            # Hooks customizados
│   ├── lib/              # Funções de cálculo
│   ├── types/            # Tipos TypeScript
│   ├── pages/            # Páginas da aplicação
│   └── index.css         # Estilos globais
├── public/               # Arquivos estáticos
└── index.html           # HTML principal
```

## Desenvolvimento

### Instalar Dependências
```bash
pnpm install
```

### Iniciar Servidor de Desenvolvimento
```bash
pnpm dev
```

### Build para Produção
```bash
pnpm build
```

## Suporte e Feedback

Para reportar bugs, sugerir melhorias ou fazer perguntas, entre em contato com a equipe de desenvolvimento.

## Licença

Esta aplicação é fornecida como ferramenta de referência para fins educacionais e profissionais.

---

**Desenvolvido com ❤️ para construtores**

Versão 1.0.0 - Março 2026
