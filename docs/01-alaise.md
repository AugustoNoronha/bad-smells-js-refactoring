# Etapa 2 – Análise Manual de Bad Smells  
**Disciplina:** Engenharia de Software – Qualidade e Refatoração  
**Trabalho:** Detecção de Bad Smells e Refatoração Segura  
**Autor:** Augusto Noronha Leite  
**Matrícula:** (inserir sua matrícula aqui)

---

## Arquivo Analisado
`src/ReportGenerator.js`

O arquivo contém a classe `ReportGenerator`, responsável por gerar relatórios em formato CSV e HTML, aplicando regras diferentes para administradores (ADMIN) e usuários comuns (USER).  
Toda essa lógica está concentrada em um único método: `generateReport()`.

---

## Bad Smells Identificados

### 1 Método Longo (*Long Method*)
**Local:** `generateReport()`  
**Descrição:** O método realiza múltiplas tarefas – monta cabeçalho, processa itens, calcula o total e cria o rodapé – em cerca de 70 linhas.  
**Problema:** Baixa coesão, difícil de ler e testar, alta complexidade cognitiva.  
**Solução proposta:** Aplicar **Extract Method** para dividir a função em partes menores, por exemplo:  
`buildHeader()`, `buildBody()`, `buildFooter()`.

---

### 2 Código Duplicado (*Duplicated Code*)
**Local:** Blocos de geração de linhas para ADMIN e USER (tanto CSV quanto HTML).  
**Descrição:** Trechos quase idênticos de concatenação de strings se repetem para cada perfil e formato.  
**Problema:** Aumenta o risco de inconsistência e torna a manutenção lenta.  
**Solução proposta:** Extrair uma função `formatRow(item, user, reportType)` e reutilizar.

---

### 3 Condicional Complexa (*Complex Conditional*)
**Local:** Cadeia de `if/else` que verifica `reportType` e `user.role`.  
**Descrição:** Duas dimensões de condições aninhadas (CSV/HTML × ADMIN/USER).  
**Problema:** Difícil de expandir para novos tipos de relatório ou papéis; alta complexidade cognitiva.  
**Solução proposta:** Aplicar **Replace Conditional with Polymorphism** ou utilizar um mapa de estratégias com funções separadas por tipo.

---

### 4 Números e Strings Mágicos (*Magic Numbers/Strings*)
**Local:** Constantes hard-coded (`'CSV'`, `'HTML'`, `'ADMIN'`, `'USER'`, valores 500 e 1000).  
**Problema:** Dificulta compreensão e refatoração futura.  
**Solução proposta:** Introduzir constantes:
```js
const REPORT_TYPES = { CSV: 'CSV', HTML: 'HTML' };
const USER_ROLES   = { ADMIN: 'ADMIN', USER: 'USER' };
const VALUE_LIMITS = { USER_MAX: 500, ADMIN_PRIORITY: 1000 };
