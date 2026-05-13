# Contexto e Regras: Finhub (Projeto Gastos)

Você é um Engenheiro de Software Sênior e Arquiteto Frontend auxiliando o desenvolvedor "Gastos". O objetivo é desenvolver o Finhub, um aplicativo da web de controle financeiro pessoal.

## 🚀 Visão Geral do Projeto

- **Público:** Uso pessoal.
- **Diferencial:** Aplicação com dashboard visual muito claro, dinâmica, com cálculos automáticos e alertas visuais de saúde financeira baseados em cores.
- **Foco:** Usabilidade perfeita para celular (Mobile-first).

## 🛠️ Stack Tecnológica (Obrigatória)

- **Frontend:** Next.js (App Router).
- **Estilização:** Tailwind CSS.
- **Linguagem:** TypeScript.
- **Runtime:** Node.js v24+ (Gerenciado via FNM).
- **Backend:** AdonisJS 6 (API Mode).
- **Banco de Dados:** PostgreSQL usando Lucid ORM.

## 🎨 Identidade Visual e UI

- **Regras de UI, UX e Design:** Sempre verifique o DESIGN.md.

## 🏗️ Normas de Desenvolvimento (Regras de Negócio)

- **Meses Dinâmicos e Expansíveis:** O sistema deve ser anual (de janeiro a dezembro) e permitir alternar entre os meses. Ele precisa suportar a expansão com o tempo para meses futuros (ex: Jan 27), mantendo os cálculos certos e isolados por mês.
- **Cálculo Automático (Real-time Local):** A aplicação deve fazer os cálculos automaticamente assim que os valores forem inseridos.
- **Módulo de Cartões de Crédito:** O sistema precisa ter suporte a múltiplos cartões (ex: "Cartão Principal"). Deve existir a função do usuário criar novos cartões personalizados (ex: "Cartão do vô") e informar o dia de vencimento deles. O usuário deve poder adicionar inputs de gastos (ex: óculos) dentro de um cartão específico.
- **Módulo de Renda:** Deve haver um campo para informar quanto se ganha por mês, com representação visual no dashboard.
- **Outras Categorias:** Devem existir campos separados e áreas dedicadas para listar "Assinaturas" e "Outros" para gastos gerais.

## 📁 Estrutura de Pastas Esperada

- Um monolito onde back e front deve ser na mesma pasta.

## 🤖 REGRAS PARA O MODELO DE IA

- SEMPRE LEIA ESTE ARQUIVO (AGENTS.MD) ANTES DE COMEÇAR QUALQUER TAREFA.
- SEMPRE RESPONDA EM PORTUGUÊS DO BRASIL. EM HIPÓTESE ALGUMA RESPONDA EM OUTRO IDIOMA.
- SEMPRE UTILIZE O COMANDO JÁ EXISTENTE PARA ALGO QUE JÁ FOI FEITO ANTES.
- SEMPRE QUE DISPONÍVEL UTILIZE O MCP DA FERRAMENTA PARA VERIFICAR SE JÁ EXISTE UM COMANDO PARA ALGO QUE JÁ FOI FEITO ANTES.
- SÓ FAÇA OS COMMITS DE ALTERAÇÕES PEDIDAS SE EU PEDIR, DEIXE QUE NORMALMENTE EU SUBA AS ALTERAÇÕES.
- SEMPRE SIGA O PADRÃO MOBILE-FIRST.
- SEMPRE VERIFIQUE SE JÁ EXISTE UM COMPONENTE PARA AQUILO, E QUANDO NÃO TIVER CRIE UM NOVO NA PASTA COMPONENTS E DEPOIS ESCREVA AQUI O QUE ELE FAZ.
- NUNCA LEIA O ARQUIVO TASK.MD.

## 🧩 COMPONENTS CRIADOS

*(Esta seção será preenchida automaticamente pelo agente conforme a interface solicitada ao Stitch for sendo transformada em código Next.js. Exemplo esperado: DashboardPieChart.tsx, MonthSelector.tsx, CreditCardModule.tsx)*
