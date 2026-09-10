/**
 * ==============================================================================
 * SISTEMA DE CADASTRO DE MEMBROS - FRONTEND LOGIC (ES6+)
 * ==============================================================================
 */

// URL do Google Apps Script Web App (Substitua pela sua URL após o deploy)
const URL_API = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

// Elementos do DOM
const DOM = {
  formulario: document.getElementById("formulario"),
  aceite: document.getElementById("aceite"),
  botaoSubmeter: document.getElementById("botao"),
  btnText: document.querySelector("#botao .btn-text"),
  btnSpinner: document.getElementById("btn-spinner"),
  btnTestDrive: document.getElementById("btn-test-drive"),
  toast: document.getElementById("toast"),
  toastMessage: document.getElementById("toast-message"),
  cpf: document.getElementById("cpf"),
  contato: document.getElementById("contato"),
  codigo: document.getElementById("codigo"),
  batismo: document.getElementById("batismo")
};

// Dados Fictícios para o Test-Drive
const DADOS_MOCK = {
  nomes: [
    "João Carlos Silva",
    "Maria Eduarda Santos",
    "Lucas Gabriel Oliveira",
    "Ana Paula Ferreira",
    "Fernanda Lima Rodrigues",
    "Gabriel Henrique Costa"
  ],
  gestores: [
    "Pr. Roberto Alves",
    "Pra. Mariana Costa",
    "Pr. Ricardo Mendes",
    "Pra. Patricia Rocha"
  ],
  sedes: [
    "Sede Central SP",
    "Unidade Regional Sul",
    "Sede Matriz Nacional",
    "Filial Sertãozinho"
  ],
  cidades: [
    { cidade: "São Paulo", estado: "SP" },
    { cidade: "Campinas", estado: "SP" },
    { cidade: "Rio de Janeiro", estado: "RJ" },
    { cidade: "Belo Horizonte", estado: "MG" },
    { cidade: "Curitiba", estado: "PR" }
  ]
};

// Timer global para limpar o Toast
let toastTimeout = null;

/**
 * Exibe notificação no estilo Toast
 */
function mostrarToast(mensagem, tipo = "sucesso", duracao = 4000) {
  if (!DOM.toast || !DOM.toastMessage) return;

  clearTimeout(toastTimeout);

  DOM.toastMessage.textContent = mensagem;
  DOM.toast.className = `toast ${tipo} show`;

  toastTimeout = setTimeout(() => {
    DOM.toast.classList.remove("show");
  }, duracao);
}

/**
 * Atualiza o estado de habilitação do botão de envio com base no checkbox de aceite
 */
function atualizarEstadoEnvio() {
  if (DOM.botaoSubmeter && DOM.aceite) {
    DOM.botaoSubmeter.disabled = !DOM.aceite.checked;
  }
}

/**
 * Define estado de carregamento do botão
 */
function definirCarregando(carregando) {
  if (!DOM.botaoSubmeter) return;

  DOM.botaoSubmeter.disabled = carregando || !DOM.aceite.checked;

  if (carregando) {
    DOM.btnText.textContent = "Processando...";
    DOM.btnSpinner.removeAttribute("hidden");
  } else {
    DOM.btnText.textContent = "Finalizar Cadastro";
    DOM.btnSpinner.setAttribute("hidden", "true");
  }
}

/**
 * Limpa erros visuais de um campo
 */
function limparErroCampo(campoId) {
  const input = document.getElementById(campoId);
  const erroSpan = document.getElementById(`erro-${campoId}`);

  if (input) input.classList.remove("erro-input");
  if (erroSpan) erroSpan.textContent = "";
}

/**
 * Exibe erro visual em um campo
 */
function exibirErroCampo(campoId, mensagem) {
  const input = document.getElementById(campoId);
  const erroSpan = document.getElementById(`erro-${campoId}`);

  if (input) input.classList.add("erro-input");
  if (erroSpan) erroSpan.textContent = mensagem;
}

/**
 * Validação de CPF com algoritmo de dígitos verificadores
 */
function validarCPF(cpfBruto) {
  const cpf = String(cpfBruto).replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

/**
 * Gerador de CPF Válido para o Test-Drive
 */
function gerarCPFValido() {
  const rand = () => Math.floor(Math.random() * 9);
  let d = Array.from({ length: 9 }, rand);

  let s1 = d.reduce((acc, val, i) => acc + val * (10 - i), 0);
  let r1 = (s1 * 10) % 11;
  if (r1 >= 10) r1 = 0;
  d.push(r1);

  let s2 = d.reduce((acc, val, i) => acc + val * (11 - i), 0);
  let r2 = (s2 * 10) % 11;
  if (r2 >= 10) r2 = 0;
  d.push(r2);

  return d.join("").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formatação dinâmica / Máscaras de entrada
 */
function aplicarMascaras() {
  // Máscara CPF
  if (DOM.cpf) {
    DOM.cpf.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "");
      val = val.replace(/^(\d{3})(\d)/, "$1.$2");
      val = val.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      val = val.replace(/\.(\d{3})(\d)/, ".$1-$2");
      e.target.value = val.slice(0, 14);
      limparErroCampo("cpf");
    });
  }

  // Máscara Telefone
  if (DOM.contato) {
    DOM.contato.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "");
      val = val.replace(/^(\d{2})(\d)/, "($1) $2");
      val = val.replace(/(\d{5})(\d)/, "$1-$2");
      e.target.value = val.slice(0, 15);
      limparErroCampo("contato");
    });
  }

  // Apenas números no Código
  if (DOM.codigo) {
    DOM.codigo.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 5);
      limparErroCampo("codigo");
    });
  }

  // Validação numérica para tempo de batismo/membro
  if (DOM.batismo) {
    DOM.batismo.addEventListener("input", (e) => {
      if (e.target.value < 0) e.target.value = 0;
      limparErroCampo("batismo");
    });
  }

  // Limpar erros nos demais inputs genéricos ao digitar
  const campos = ["nome", "nascimento", "cidade", "estado", "endereco", "porte", "sede", "pastor"];
  campos.forEach((campoId) => {
    const el = document.getElementById(campoId);
    if (el) {
      el.addEventListener("input", () => limparErroCampo(campoId));
      el.addEventListener("change", () => limparErroCampo(campoId));
    }
  });
}

/**
 * Validação geral de todos os campos obrigatórios
 */
function validarFormulario() {
  let valido = true;
  const camposObrigatorios = [
    { id: "nome", label: "Nome Completo" },
    { id: "nascimento", label: "Data de Nascimento" },
    { id: "cpf", label: "CPF" },
    { id: "batismo", label: "Tempo de Membro" },
    { id: "contato", label: "Contato" },
    { id: "cidade", label: "Cidade" },
    { id: "estado", label: "Estado" },
    { id: "endereco", label: "Endereço" },
    { id: "porte", label: "Porte" },
    { id: "sede", label: "Sede" },
    { id: "pastor", label: "Gestor/Pastor" }
  ];

  // Verificar preenchimento básico
  camposObrigatorios.forEach(({ id }) => {
    const input = document.getElementById(id);
    if (!input || !input.value.trim()) {
      exibirErroCampo(id, "Campo obrigatório.");
      valido = false;
    } else {
      limparErroCampo(id);
    }
  });

  // Validação específica do CPF
  if (DOM.cpf && DOM.cpf.value) {
    const cpfLimpo = DOM.cpf.value.replace(/\D/g, "");
    if (!validarCPF(cpfLimpo)) {
      exibirErroCampo("cpf", "Informe um CPF válido.");
      valido = false;
    }
  }

  return valido;
}

/**
 * Ação do Botão Test-Drive (Preenchimento Automático)
 */
function inicializarTestDrive() {
  if (!DOM.btnTestDrive) return;

  DOM.btnTestDrive.addEventListener("click", () => {
    const sortear = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const local = sortear(DADOS_MOCK.cidades);

    document.getElementById("nome").value = sortear(DADOS_MOCK.nomes);
    document.getElementById("nascimento").value = "1992-06-15";
    document.getElementById("cpf").value = gerarCPFValido();
    document.getElementById("batismo").value = Math.floor(Math.random() * 12) + 1;
    document.getElementById("contato").value = "(11) 98888-7777";
    document.getElementById("cidade").value = local.cidade;
    document.getElementById("estado").value = local.estado;
    document.getElementById("endereco").value = "Av. Paulista, 1000 - Bela Vista";
    document.getElementById("porte").value = "Central";
    document.getElementById("sede").value = sortear(DADOS_MOCK.sedes);
    document.getElementById("pastor").value = sortear(DADOS_MOCK.gestores);
    document.getElementById("codigo").value = String(Math.floor(Math.random() * 90000) + 10000);

    DOM.aceite.checked = true;
    atualizarEstadoEnvio();

    // Limpa todos os erros visuais
    const campos = ["nome", "nascimento", "cpf", "batismo", "contato", "cidade", "estado", "endereco", "porte", "sede", "pastor", "codigo"];
    campos.forEach((id) => limparErroCampo(id));

    mostrarToast("Dados de teste preenchidos com sucesso!", "sucesso", 2500);
  });
}

/**
 * Envio do formulário (Handler Principal)
 */
function inicializarEnvioFormulario() {
  if (!DOM.formulario) return;

  DOM.formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      mostrarToast("Por favor, corrija os erros destacadas no formulário.", "erro");
      return;
    }

    definirCarregando(true);

    const dadosPayload = {
      nome: document.getElementById("nome").value.trim(),
      nascimento: document.getElementById("nascimento").value,
      cpf: document.getElementById("cpf").value.replace(/\D/g, ""),
      batismo: document.getElementById("batismo").value,
      contato: document.getElementById("contato").value,
      cidade: document.getElementById("cidade").value.trim(),
      estado: document.getElementById("estado").value,
      endereco: document.getElementById("endereco").value.trim(),
      porte: document.getElementById("porte").value,
      sede: document.getElementById("sede").value.trim(),
      pastor: document.getElementById("pastor").value.trim(),
      codigo: document.getElementById("codigo").value.trim()
    };

    // Caso a URL do script não tenha sido configurada ainda, opera em Modo Demonstração
    const isMockMode = URL_API.includes("YOUR_SCRIPT_ID");

    if (isMockMode) {
      setTimeout(() => {
        definirCarregando(false);
        mostrarToast("Cadastro realizado com sucesso! (Modo Demonstração)", "sucesso");
        DOM.formulario.reset();
        atualizarEstadoEnvio();
      }, 1200);
      return;
    }

    // Requisição REAL via Fetch API para o Google Apps Script
    try {
      const response = await fetch(URL_API, {
        method: "POST",
        mode: "no-cors", // Necessário para Web Apps do Apps Script sem redirecionamento explícito
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosPayload)
      });

      definirCarregando(false);
      mostrarToast("Cadastro enviado com sucesso para a planilha!", "sucesso");
      DOM.formulario.reset();
      atualizarEstadoEnvio();

    } catch (error) {
      console.error("Erro na comunicação com a API:", error);
      definirCarregando(false);
      mostrarToast("Falha ao enviar cadastro. Tente novamente mais tarde.", "erro");
    }
  });
}

/**
 * Inicialização dos Eventos do Sistema
 */
function init() {
  if (DOM.aceite) {
    DOM.aceite.addEventListener("change", atualizarEstadoEnvio);
  }

  aplicarMascaras();
  inicializarTestDrive();
  inicializarEnvioFormulario();
  atualizarEstadoEnvio();
}

// Executar após carregamento completo da página
document.addEventListener("DOMContentLoaded", init);
