const URL =
  "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

const formulario =
  document.getElementById("formulario");

const mensagem =
  document.getElementById("mensagem");

const cpfInput =
  document.getElementById("cpf");

const erroCpf =
  document.getElementById("erro-cpf");

const aceite =
  document.getElementById("aceite");

const botao =
  document.getElementById("botao");

const btnTestDrive =
  document.getElementById("btn-test-drive");

function atualizarBotao() {

  botao.disabled =
    !aceite.checked;
}

aceite.addEventListener(
  "change",
  atualizarBotao
);

atualizarBotao();

/* GERADOR DE CPF VÁLIDO PARA TEST-DRIVE */

function gerarCPFValido() {

  const randDigit = () => Math.floor(Math.random() * 9);

  let d = Array.from({ length: 9 }, randDigit);

  let s1 = d.reduce((acc, val, i) => acc + val * (10 - i), 0);

  let r1 = (s1 * 10) % 11;

  if (r1 === 10 || r1 === 11) r1 = 0;

  d.push(r1);

  let s2 = d.reduce((acc, val, i) => acc + val * (11 - i), 0);

  let r2 = (s2 * 10) % 11;

  if (r2 === 10 || r2 === 11) r2 = 0;

  d.push(r2);

  const str = d.join("");

  return str.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/* DADOS ALEATÓRIOS PARA TEST-DRIVE */

const nomesFicticios = [
  "João Silva",
  "Maria Oliveira",
  "Carlos Eduardo Santos",
  "Ana Paula Souza",
  "Fernanda Lima"
];

const gestoresFicticios = [
  "Roberto Alves",
  "Mariana Costa",
  "Ricardo Mendes",
  "Patricia Rocha"
];

const sedesFicticias = [
  "Sede Central SP",
  "Unidade Regional Sul",
  "Sede Matriz",
  "Filial Sertãozinho"
];

if (btnTestDrive) {

  btnTestDrive.addEventListener("click", () => {

    const nomeSorteado =
      nomesFicticios[Math.floor(Math.random() * nomesFicticios.length)];

    const gestorSorteado =
      gestoresFicticios[Math.floor(Math.random() * gestoresFicticios.length)];

    const sedeSorteada =
      sedesFicticias[Math.floor(Math.random() * sedesFicticias.length)];

    document.getElementById("nome").value = nomeSorteado;

    document.getElementById("nascimento").value = "1995-08-20";

    document.getElementById("cpf").value = gerarCPFValido();

    document.getElementById("batismo").value = Math.floor(Math.random() * 10) + 1;

    document.getElementById("cidade").value = "São Paulo";

    document.getElementById("contato").value = "(11) 98765-4321";

    document.getElementById("estado").value = "SP";

    document.getElementById("porte").value = "Central";

    document.getElementById("sede").value = sedeSorteada;

    document.getElementById("endereco").value = "Av. Paulista, 1000";

    document.getElementById("pastor").value = gestorSorteado;

    document.getElementById("codigo").value = String(Math.floor(Math.random() * 90000) + 10000);

    aceite.checked = true;

    mensagem.style.display = "none";

    cpfInput.classList.remove("erro-input");

    erroCpf.innerText = "";

    atualizarBotao();
  });
}

formulario.addEventListener(
  "submit",

  function (e) {

    e.preventDefault();

    mensagem.style.display =
      "none";

    cpfInput.classList.remove(
      "erro-input"
    );

    erroCpf.innerText = "";

    botao.disabled = true;

    botao.innerText =
      "Enviando...";

    const cpfLimpo =
      document.getElementById("cpf")
        .value
        .replace(/\D/g, "");

    if (!validarCPF(cpfLimpo)) {

      mensagem.style.display =
        "block";

      mensagem.className =
        "erro";

      mensagem.innerText =
        "CPF inválido.";

      cpfInput.classList.add(
        "erro-input"
      );

      erroCpf.innerText =
        "Digite um CPF válido.";

      botao.innerText =
        "Cadastrar Membro";

      atualizarBotao();

      return;
    }

    /* MOCK DE ENVIO COM SETTIMEOUT DE 1.5 SEGUNDOS */

    setTimeout(() => {

      mensagem.style.display =
        "block";

      mensagem.className =
        "sucesso";

      mensagem.innerText =
        "Cadastro realizado com sucesso! (Modo Demonstração)";

      formulario.reset();

      botao.innerText =
        "Cadastrar Membro";

      atualizarBotao();

    }, 1500);

  });

/* MÁSCARA CPF */

const cpf =
  document.getElementById("cpf");

cpf.addEventListener(
  "input",
  () => {

    let valor =
      cpf.value.replace(/\D/g, "");

    valor =
      valor.replace(
        /^(\d{3})(\d)/,
        "$1.$2"
      );

    valor =
      valor.replace(
        /^(\d{3})\.(\d{3})(\d)/,
        "$1.$2.$3"
      );

    valor =
      valor.replace(
        /\.(\d{3})(\d)/,
        ".$1-$2"
      );

    cpf.value =
      valor.slice(0, 14);
  }
);

/* MÁSCARA TELEFONE */

const contato =
  document.getElementById("contato");

contato.addEventListener(
  "input",
  () => {

    let valor =
      contato.value.replace(/\D/g, "");

    valor =
      valor.replace(
        /^(\d{2})(\d)/,
        "($1) $2"
      );

    valor =
      valor.replace(
        /(\d{5})(\d)/,
        "$1-$2"
      );

    contato.value =
      valor.slice(0, 15);
  }
);

/* SOMENTE NÚMEROS NO CÓDIGO */

const codigo =
  document.getElementById("codigo");

codigo.addEventListener(
  "input",
  () => {

    codigo.value =
      codigo.value
        .replace(/\D/g, "")
        .slice(0, 5);
  }
);

function validarCPF(cpf) {

  cpf =
    cpf.replace(/\D/g, "");

  if (cpf.length !== 11) {

    return false;
  }

  /* BLOQUEIA CPFs IGUAIS */

  if (/^(\d)\1+$/.test(cpf)) {

    return false;
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {

    soma =
      soma +
      parseInt(cpf.substring(i - 1, i))
      * (11 - i);
  }

  resto =
    (soma * 10) % 11;

  if (
    resto === 10 ||
    resto === 11
  ) {

    resto = 0;
  }

  if (resto !== parseInt(cpf.substring(9, 10))) {

    return false;
  }

  soma = 0;

  for (let i = 1; i <= 10; i++) {

    soma =
      soma +
      parseInt(cpf.substring(i - 1, i))
      * (12 - i);
  }

  resto =
    (soma * 10) % 11;

  if (
    resto === 10 ||
    resto === 11
  ) {

    resto = 0;
  }

  if (resto !== parseInt(cpf.substring(10, 11))) {

    return false;
  }

  return true;
}