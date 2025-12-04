# 🌱 Sistema de Gestão de Sementes

O **Sistema de Gestão de Sementes** é uma plataforma voltada para o **monitoramento, rastreabilidade e controle da distribuição de sementes agrícolas**, desenvolvida como projeto acadêmico.  
Seu objetivo é promover **transparência, eficiência e sustentabilidade** na cadeia produtiva, reduzindo perdas durante o armazenamento e garantindo a qualidade das sementes distribuídas.

---

## 🎯 Objetivo do Projeto

Desenvolver um sistema integrado que permita o **monitoramento das condições de armazenamento** (como temperatura e umidade), o **gerenciamento de lotes e alertas** e o **acompanhamento do histórico de distribuição** das sementes.  
A plataforma conecta **administradores**, **produtores (agricultores)** e **auditores**, garantindo rastreabilidade completa do processo.

---

## ⚙️ Principais Funcionalidades

- 📦 **Gestão de Lotes:** controle de sementes por código QR, validade e origem.  
- 🏭 **Monitoramento de Armazéns:** registro das condições de estocagem e capacidade.  
- 🚜 **Distribuição de Sementes:** histórico completo de entregas entre armazéns e agricultores.  
- 🔔 **Sistema de Alertas:** notificações automáticas sobre variações de temperatura, umidade ou validade.  
- 🧾 **Relatórios de Auditoria:** acompanhamento da conformidade e repasse de informações aos administradores.  
- 🔍 **Rastreabilidade:** visualização de toda a jornada da semente — do armazenamento à entrega final.  

---

## 🧱 Tecnologias Utilizadas

| Categoria | Tecnologias |
|------------|-------------|
| 💻 **Front-end** | HTML, CSS, JavaScript, React/Vite (se aplicável) |
| ⚙️ **Back-end** | Node.js / PHP |
| 🗄️ **Banco de Dados** | MySQL |
| 🛠️ **Ferramentas** | MySQL Workbench, VS Code, Git, GitHub |

---

## 🗂️ Estrutura do Repositório

📁 Sistema_Gestao_Sementes
├── 📂 banco_dados/ → Modelo lógico, DER e script SQL (CREATE TABLE, FKs, etc.)
├── 📂 site/ → Páginas e componentes do sistema web
├── 📂 documentos/ → Documentos do projeto e relatórios técnicos
├── README.md → Descrição geral do projeto

---

## 🚀 Como Rodar o Projeto

Para executar o sistema localmente, siga as instruções abaixo:

### Pré-requisitos
Certifique-se de ter o **[Node.js](https://nodejs.org/)** instalado em sua máquina.

### Instalação e Execução

1. Abra o terminal na pasta raiz do projeto.
2. Instale as dependências necessárias:
   npm install
3. Execute o projeto:
  npm run dev

🔐 Acesso Padrão (Credenciais)Para acessar o sistema com os dados já cadastrados no banco de dados, 
utilize:
CampoValorCPF: 12345678901
Senha: h1s2j3k4
