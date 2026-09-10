# Sistema Administrativo de Cadastro de Membros Pro

Sistema web completo, moderno e responsivo para gerenciamento e cadastro administrativo de membros e colaboradores. O projeto utiliza **Google Sheets** como banco de dados em nuvem em conjunto com **Google Apps Script** como API backend serverless.

---

## 📌 Finalidade do Projeto

O objetivo principal deste sistema é centralizar e simplificar o processo de cadastro de membros/colaboradores para instituições e organizações. Ele substitui cadastros manuais ou em papel por uma interface web intuitiva, segura e com validações em tempo real, integrando os dados diretamente em uma planilha online sem a necessidade de infraestrutura de banco de dados tradicional.

---

## ✨ Funcionalidades Principais

- **Formulário Dinâmico e Organizado**: Agrupamento em seções visuais (*Informações Pessoais*, *Contato e Localização*, *Dados Institucionais*).
- **Validação Algorítmica de CPF**: Verificação real dos dígitos verificadores e bloqueio de números inválidos ou repetidos.
- **Prevenção de Duplicidade**: Sistema backend de verificação que impede cadastros duplicados com o mesmo CPF via `ScriptProperties`.
- **Máscaras Automáticas**: Formatação em tempo real para CPF (`000.000.000-00`) e Telefone (`(00) 00000-0000`).
- **Modo Test-Drive / Dados Fictícios**: Botão para preenchimento rápido de dados válidos para demonstração e testes.
- **Feedback Visual Moderno (UI/UX)**: Notificações no estilo *Toast*, mensagens de erro específicas por campo, estados de foco destacados e indicador de carregamento (spinner).
- **Acessibilidade & Design Responsivo**: Suporte completo para Mobile, Tablets e Desktops com tags semânticas e acessíveis.

---

## 🛠️ Tecnologias Utilizadas

### Front-End:
- **HTML5 Semântico**: Estruturação moderna com uso de `fieldset`, `legend` e atributos A11y.
- **CSS3 Moderno**: Variáveis CSS (Custom Properties), Flexbox, CSS Grid, sombras suaves, animações e responsividade sem dependência de frameworks externos.
- **JavaScript (ES6+)**: Funções assíncronas (`async/await`), manipulação limpa de DOM, Fetch API e algoritmos de validação.

### Back-End:
- **Google Apps Script**: API REST Serverless escrita em JavaScript para processar requisições `GET` e `POST`.
- **Google Sheets**: Banco de dados no formato de planilha em nuvem.

---

## 📋 Campos do Cadastro

| Campo | Tipo | Descrição / Regra |
| :--- | :--- | :--- |
| **Nome Completo** | Texto | Obrigatório |
| **Data de Nascimento** | Data | Obrigatório |
| **CPF** | Texto | Obrigatório, com máscara e validação de dígitos |
| **Tempo de Membro / Empresa** | Número | Obrigatório (em anos) |
| **Telefone / Contato** | Texto | Obrigatório, com máscara de DD e número |
| **Cidade / Estado** | Texto / Select | Obrigatórios (UF com lista de todos os estados) |
| **Endereço Completo** | Texto | Obrigatório |
| **Porte da Unidade** | Select | Local, Regional, Setorial, Central, Estadual |
| **Sede Responsável** | Texto | Obrigatório |
| **Gestor / Pastor Responsável**| Texto | Obrigatório |
| **Código da Unidade** | Texto | Opcional (até 5 dígitos numéricos) |
| **Aceite dos Termos** | Checkbox | Obrigatório para habilitar o envio |

---

## ⚙️ Passo a Passo para Configuração e Implantação

Siga os passos abaixo para conectar o formulário web à sua própria planilha do Google Sheets:

### 1. Criar a Planilha no Google Sheets
1. Acesse o [Google Drive](https://drive.google.com) e crie uma nova **Planilha Google**.
2. Defina o nome desejado (exemplo: `Cadastro de Membros`).
3. Copie o **ID da Planilha** localizado na URL no seu navegador:
   ```text
   https://docs.google.com/spreadsheets/d/SEU_ID_DA_PLANILHA_AQUI/edit
   ```

### 2. Configurar o Back-End (Google Apps Script)
1. Na planilha criada, acesse o menu superior: **Extensões > Apps Script**.
2. Apague qualquer código existente no arquivo `Código.gs`.
3. Abra o arquivo [`app script.txt`](./app%20script.txt) deste repositório, copie todo o seu conteúdo e cole no editor do Apps Script.
4. No topo do código, substitua a constante `SPREADSHEET_ID` pelo ID da sua planilha:
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: "SEU_ID_DA_PLANILHA_AQUI",
     SHEET_NAME: "Membros",
     // ...
   };
   ```
5. **Executar a Criação dos Cabeçalhos (Inicialização)**:
   - No menu superior do Apps Script, selecione a função **`setupSheet`** na lista de funções.
   - Clique em **Executar** e autorize as permissões da sua conta do Google quando solicitado.
   - A aba `Membros` será criada e formatada automaticamente na sua planilha com os cabeçalhos.

### 3. Implantar o Web App (API)
1. No canto superior direito do Apps Script, clique no botão azul **Implantar** > **Nova implantação**.
2. Clique no ícone de engrenagem (Configurações) e selecione **App da Web**.
3. Preencha as configurações:
   - **Descrição**: `API v1.0 - Cadastro`
   - **Executar como**: `Eu (seu-email@gmail.com)`
   - **Quem tem acesso**: `Qualquer pessoa` *(Importantíssimo para que o formulário consiga enviar dados sem exigência de login)*
4. Clique em **Implantar**.
5. Copie o **URL do App da Web** gerado (exemplo: `https://script.google.com/macros/s/AKfycbx.../exec`).

### 4. Conectar o Front-End ao Back-End
1. Abra o arquivo [`js/script.js`](./js/script.js) no seu projeto.
2. Na primeira linha do arquivo, insira a URL copiada na constante `URL_API`:
   ```javascript
   const URL_API = "https://script.google.com/macros/s/SUA_URL_DO_SCRIPT_AQUI/exec";
   ```
3. Salve o arquivo. Pronto! O formulário agora enviará as informações diretamente para a sua planilha Google Sheets.

> **Nota**: Se a variável `URL_API` mantiver o valor padrão `YOUR_SCRIPT_ID`, o sistema funcionará automaticamente em **Modo Demonstração (Mock)** para testes visuais.

---

## 🎨 Preview da Interface

A interface conta com:
- Layout responsivo otimizado para celulares e desktops.
- Seções bem separadas por cartões e ícones indicativos.
- Botão "Preencher Dados Teste" para acelerar validações em ambiente de homologação.

---

## 👤 Autor

Desenvolvido por **Luiz Eduardo Silva**.
