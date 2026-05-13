# 🌌 Finhub

**Finhub** é uma plataforma premium de controle financeiro pessoal, projetada com uma estética de **Glassmorphism** de ponta e focada em proporcionar uma experiência visual clara, dinâmica e sofisticada. 

O projeto, codinome **FINHUB**, vai além de uma simples planilha de gastos; ele é um dashboard inteligente que oferece saúde financeira através de cores, micro-animações e cálculos automáticos em tempo real.

---

## 🚀 Visão Geral

- **Mobile-First:** Projetado especificamente para uma usabilidade perfeita em dispositivos móveis.
- **layered Intelligence:** Interface baseada em camadas de vidro fosco, reduzindo a carga cognitiva e destacando o que realmente importa: seus dados.
- **Saúde Visual:** Alertas visuais baseados em cores que indicam instantaneamente o status da sua saúde financeira.

## 🛠️ Stack Tecnológica

O Finhub utiliza as tecnologias mais modernas do ecossistema web:

### Frontend
- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com)
- **Tipagem:** [TypeScript](https://www.typescriptlang.org)
- **Gerenciamento de Estado:** [Zustand](https://zustand-demo.pmnd.rs/)

### Backend
- **Framework:** [AdonisJS 6](https://adonisjs.com) (API Mode)
- **ORM:** [Lucid ORM](https://lucid.adonisjs.com)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org)
- **Runtime:** Node.js v24+

---

## 🌟 Funcionalidades Principais

- **📅 Meses Dinâmicos:** Sistema anual expansível (Jan-Dez) com isolamento total de cálculos por período.
- **💳 Módulo de Cartões:** Gestão de múltiplos cartões personalizados, com controle de vencimento e gastos específicos por cartão.
- **💰 Gestão de Renda:** Campo dedicado para aportes mensais com representação visual de progresso no dashboard.
- **📊 Cálculos Real-time:** Processamento instantâneo de valores assim que são inseridos.
- **🏷️ Categorização Inteligente:** Áreas dedicadas para Assinaturas, Gastos Essenciais, Lazer e muito mais.

---

## ⚙️ Como Executar o Projeto

Este projeto é um monorepo que contém tanto o backend quanto o frontend na mesma estrutura de pastas.

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/fin_hub.git
cd fin_hub
```

### 2. Configurar o Backend
```bash
cd backend
npm install
# Configure seu arquivo .env com as credenciais do PostgreSQL
node ace migration:run
npm run dev
```

### 3. Configurar o Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🎨 Design System

O Finhub utiliza o sistema de design **Aura**, focado em:
- **Cores:** Deep Navy foundation, Teal-to-Emerald para crescimento e Soft Rose para alertas.
- **Tipografia:** Hanken Grotesk para máxima legibilidade de dados.
- **Efeitos:** Backdrop blur (20px a 40px) e brilhos internos para simular vidro real.

---

Desenvolvido com ❤️ por **Gastos**.
