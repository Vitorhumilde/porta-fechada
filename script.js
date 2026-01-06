// script.js - Fluxo de perguntas interativo em Português
// Substitui o conteúdo anterior e implementa: startGame, showQuestion, handleChoice, nextQuestion, restartGame

const gameData = [
  {
    question: 'Você acorda em um quarto escuro com uma porta entreaberta. O que você faz?',
    choices: [
      { text: 'Empurrar a porta lentamente.', response: 'Você empurra a porta e ouve um rangido profundo. Algo se move do outro lado.' },
      { text: 'Gritar por ajuda.', response: 'Sua voz ecoa pelo corredor; ninguém responde. O silêncio aumenta.' },
      { text: 'Procurar uma luz.', response: 'Você tateia a parede e encontra um interruptor. Uma luz fraca revela marcas no chão.' }
    ]
  },
  {
    question: 'No corredor há duas portas: uma com som de água e outra com ar frio. Para qual você vai?',
    choices: [
      { text: 'Porta com som de água.', response: 'Água pinga ao longe. Um cheiro de maresia invade o corredor.' },
      { text: 'Porta com ar frio.', response: 'O ar frio carrega respingos e um sopro que parece sussurrar seu nome.' }
    ]
  },
  {
    question: 'Você encontra um bilhete rasgado com um número. O que faz?',
    choices: [
      { text: 'Guardar o bilhete.', response: 'Você guarda o bilhete no bolso — pode ser útil depois.' },
      { text: 'Ignorar e seguir em frente.', response: 'Você segue em frente, mas algo dentro de você insiste que o número era importante.' }
    ]
  },
  {
    question: 'Há uma caixa trancada com três símbolos. Qual símbolo você escolhe tocar?',
    choices: [
      { text: 'O símbolo da lua.', response: 'Ao tocar, a caixa vibra e libera um som baixo — nada acontece por enquanto.' },
      { text: 'O símbolo do sol.', response: 'Uma luz quente atravessa as fendas da caixa; algo dentro brilha por um instante.' },
      { text: 'O símbolo da chave.', response: 'Um clique ecoa. A caixa permanece fechada, mas agora parece mais próxima de abrir.' }
    ]
  },
  {
    question: 'Você encontra uma escada que sobe e outra que desce. Para onde vai?',
    choices: [
      { text: 'Subir a escada.', response: 'No alto, uma janela mostra um céu estranho. Algo se move lá fora.' },
      { text: 'Descer a escada.', response: 'No subsolo, o ar é denso e há marcas no chão levando a uma porta velha.' }
    ]
  },
  {
    question: 'Um estranho aparece e oferece ajuda. Você aceita?',
    choices: [
      { text: 'Aceitar ajuda.', response: 'O estranho sorri, mas seus olhos parecem vazios. Ele aponta para um corredor seguro.' },
      { text: 'Recusar e seguir sozinho.', response: 'Você recusa; o estranho desaparece em silêncio, como se nunca tivesse estado ali.' }
    ]
  },
  {
    question: 'Há um espelho antigo que reflete algo diferente. O que você faz?',
    choices: [
      { text: 'Olhar cuidadosamente.', response: 'Seu reflexo sorri primeiro — você não sorriu. O vidro fica quente ao toque.' },
      { text: 'Quebrar o espelho.', response: 'O som do vidro se espalha e, por um momento, você sente como se tivesse libertado algo.' }
    ]
  },
  {
    question: 'Você encontra um mapa com um X vermelho. O que faz?',
    choices: [
      { text: 'Seguir o mapa.', response: 'O X marca um local sob o chão — você encontra uma pequena abertura com um objeto brilhante.' },
      { text: 'Desconfiar e ignorar.', response: 'Você decide não seguir o mapa. Mais tarde, se arrepende de não ter investigado.' }
    ]
  },
  {
    question: 'Uma porta trancada exige uma senha. Você lembra do bilhete rasgado? O que tenta?',
    choices: [
      { text: 'Usar o número do bilhete.', response: 'A porta faz um clique e se abre lentamente — parecia ser a senha correta.' },
      { text: 'Tentar uma combinação aleatória.', response: 'As tentativas falham e um alarme distante começa a soar.' }
    ]
  },
  {
    question: 'Você está diante de uma saída. Ao atravessá-la, você espera:',
    choices: [
      { text: 'Liberdade e luz.', response: 'Você sai para fora; o ar fresco inunda seus pulmões. A jornada termina — por enquanto.' },
      { text: 'Outro enigma.', response: 'A porta leva a um corredor ainda mais longo. A aventura continua.' }
    ]
  }
];

let currentQuestionIndex = 0;
let answered = false;

// Elementos da interface
const textoEl = document.getElementById('texto');
const perguntasEl = document.getElementById('perguntas');

function startGame() {
  currentQuestionIndex = 0;
  answered = false;
  if (!textoEl || !perguntasEl) {
    console.warn('Elementos #texto ou #perguntas não encontrados no DOM.');
    return;
  }
  // Limpa interface e inicia
  textoEl.textContent = '';
  perguntasEl.innerHTML = '';
  showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
  const q = gameData[index];
  if (!q) return;
  answered = false;
  // Mostrar apenas a pergunta no elemento #texto
  textoEl.textContent = q.question;

  // Renderizar botões de opções em #perguntas
  perguntasEl.innerHTML = '';
  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'opcao';
    btn.type = 'button';
    btn.textContent = choice.text;
    btn.dataset.choiceIndex = i;
    btn.addEventListener('click', () => handleChoice(i));
    perguntasEl.appendChild(btn);
  });
}

function handleChoice(choiceIndex) {
  if (answered) return; // evita múltiplas respostas
  const q = gameData[currentQuestionIndex];
  if (!q) return;

  answered = true;
  const choice = q.choices[choiceIndex];

  // Exibir resposta no #texto
  textoEl.textContent = choice.response;

  // Indicar visualmente a escolha e desabilitar outras opções
  Array.from(perguntasEl.querySelectorAll('button.opcao')).forEach((btn) => {
    btn.disabled = true;
    if (Number(btn.dataset.choiceIndex) === choiceIndex) {
      btn.classList.add('selecionada');
    }
  });

  // Adicionar controle Continuar ou Reiniciar
  const controlBtn = document.createElement('button');
  controlBtn.type = 'button';
  if (currentQuestionIndex < gameData.length - 1) {
    controlBtn.textContent = 'Continuar';
    controlBtn.addEventListener('click', nextQuestion);
  } else {
    controlBtn.textContent = 'Reiniciar';
    controlBtn.addEventListener('click', restartGame);
  }
  controlBtn.className = 'controle';
  // Espaçamento antes do controle
  const spacer = document.createElement('div');
  spacer.style.height = '8px';
  perguntasEl.appendChild(spacer);
  perguntasEl.appendChild(controlBtn);
}

function nextQuestion() {
  currentQuestionIndex += 1;
  if (currentQuestionIndex >= gameData.length) {
    restartGame();
    return;
  }
  showQuestion(currentQuestionIndex);
}

function restartGame() {
  currentQuestionIndex = 0;
  showQuestion(currentQuestionIndex);
}

// Inicializa o jogo quando a página carrega
window.addEventListener('DOMContentLoaded', () => {
  startGame();
});
