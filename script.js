// Exemplo simples para popular perguntas e controlar ações.
const perguntas = [
  "Quem é você?",
  "O que deseja aqui?",
  "Você tem máscara?",
  "Podemos saber seu nome?",
  "Por que veio a esta hora?"
];

let selecionada = null;

document.addEventListener("DOMContentLoaded", () => {
  renderPerguntas();
  document.getElementById('btn-entrar').addEventListener('click', () => decidir('entrar'));
  document.getElementById('btn-expulsar').addEventListener('click', () => decidir('expulsar'));
});

function renderPerguntas(){
  const container = document.getElementById('perguntas');
  container.innerHTML = ''; // limpa
  perguntas.forEach((texto, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'question-button';
    btn.textContent = texto;
    btn.dataset.index = idx;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => selecionarPergunta(idx));
    container.appendChild(btn);
  });
}

function selecionarPergunta(idx){
  const texto = perguntas[idx];
  const p = document.getElementById('texto');
  p.textContent = `Você perguntou: "${texto}"`;

  // marcar visualmente a pergunta selecionada
  const buttons = document.querySelectorAll('.question-button');
  buttons.forEach((b) => {
    b.setAttribute('aria-pressed', 'false');
  });
  const btn = buttons[idx];
  if(btn){
    btn.setAttribute('aria-pressed', 'true');
  }

  selecionada = idx;
}

function decidir(acao){
  const resultado = document.getElementById('resultado');
  if(acao === 'entrar'){
    resultado.textContent = 'Você deixou a pessoa entrar. O que acontece a seguir?';
  } else {
    resultado.textContent = 'Você expulsou a pessoa. Fique atento ao que acontece.';
  }
}
