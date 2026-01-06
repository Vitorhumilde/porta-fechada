// script.js — fluxo simples do jogo com efeito typewriter, som e transições
// Estrutura de dados: array de objetos { question, options: [{ text, response, class? }] }

const gameData = [
  {
    question: 'Alguém bate na sua porta. "Quem é?"',
    options: [
      { text: 'Diz que é vizinho', response: 'Ele diz que é seu vizinho — mas a voz soa estranha.' },
      { text: 'Diz que é entrega', response: 'Uma entrega? Você não pediu nada. A porta permanece entreaberta.' }
    ]
  },
  {
    question: 'A pessoa pergunta por você diretamente.',
    options: [
      { text: 'Pedir identificação', response: 'Ele hesita, mostra algo que parece legítimo — mas está borrado.' },
      { text: 'Fechar a porta', response: 'Você fecha a porta. Ouve passos que logo se afastam.' }
    ]
  },
  {
    question: 'Você oferece ajuda. A pessoa sorri.',
    options: [
      { text: 'Convidar a entrar', response: 'Ao entrar, a sala fica estranhamente fria.' },
      { text: 'Pedir que volte depois', response: 'Ele diz que retornará — e então nada mais se move.' }
    ]
  },
  // É fácil adicionar mais entradas aqui
];

// referências DOM
const textEl = document.getElementById('text');
const choicesEl = document.getElementById('choices');
const continueBtn = document.getElementById('continue-btn');
const typingSfx = document.getElementById('typing-sfx');
const ambience = document.getElementById('ambience');

let currentIndex = 0;
let isTyping = false;

// configurações do typewriter
const TYPING_SPEED = 24; // ms por caractere
const CHAR_SFX_FREQ = 2; // tocar som a cada N caracteres (para evitar excesso)

// inicia música ambiente em volume baixo (se disponível)
function tryStartAmbience(){
  if(!ambience) return;
  ambience.volume = 0.16;
  // tentativa respeitando autoplay bloqueio: só toca se usuário interagiu ou se browser permitir
  ambience.play().catch(()=> {
    // aguardamos a primeira interação do usuário para acionar
    document.addEventListener('click', function onFirst() {
      ambience.play().catch(()=>{});
      document.removeEventListener('click', onFirst);
    });
  });
}

// typewriter que retorna Promise para encadear ações
function typeText(targetEl, text, { speed = TYPING_SPEED, sound = typingSfx } = {}) {
  return new Promise((resolve) => {
    if(!targetEl) return resolve();
    targetEl.textContent = '';
    let i = 0;
    isTyping = true;

    function step() {
      if(i <= text.length - 1) {
        targetEl.textContent += text[i];
        // tocar som a cada CHAR_SFX_FREQ caracteres (se houver)
        if(sound && (i % CHAR_SFX_FREQ) === 0) {
          try {
            sound.currentTime = 0;
            sound.volume = 0.12 + Math.random() * 0.08;
            sound.play().catch(()=>{});
          } catch(e){}
        }
        i++;
        setTimeout(step, speed + Math.floor(Math.random() * 8));
      } else {
        isTyping = false;
        resolve();
      }
    }
    step();
  });
}

// limpa e renderiza as opções para a pergunta atual
function showOptions(options) {
  choicesEl.innerHTML = '';
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    if(opt.class) btn.classList.add(opt.class);
    btn.textContent = opt.text;
    btn.type = 'button';
    btn.addEventListener('click', () => onChoice(idx));
    choicesEl.appendChild(btn);
  });
}

// quando o jogador escolhe uma opção
async function onChoice(optionIndex) {
  if (isTyping) return; // prevenção durante digitação
  // esconder as opções com fade-out
  choicesEl.classList.add('fade-out');
  setTimeout(() => choicesEl.classList.add('hidden'), 180);

  const current = gameData[currentIndex];
  const chosen = current.options[optionIndex];

  // mostrar a resposta na janela de diálogo
  const bubble = document.getElementById('bubble');
  bubble.classList.remove('fade-in');
  bubble.classList.add('fade-out');
  await new Promise(r => setTimeout(r, 180));
  bubble.classList.remove('fade-out');
  bubble.classList.add('fade-in');

  await typeText(textEl, chosen.response);

  // exibir botão continuar
  continueBtn.classList.remove('hidden');
  continueBtn.setAttribute('aria-hidden', 'false');
  continueBtn.addEventListener('click', onContinue, { once: true });
}

// botão continuar -> avança para próxima pergunta
async function onContinue() {
  if (isTyping) return;
  continueBtn.classList.add('hidden');
  continueBtn.setAttribute('aria-hidden', 'true');

  currentIndex++;
  if (currentIndex >= gameData.length) {
    // fim do jogo (simples)
    const bubble = document.getElementById('bubble');
    bubble.classList.remove('fade-in');
    bubble.classList.add('fade-out');
    await new Promise(r => setTimeout(r, 180));
    bubble.classList.remove('fade-out');
    bubble.classList.add('fade-in');
    await typeText(textEl, 'Nada mais acontece por enquanto. Fim do trecho — adicione mais perguntas para continuar.');
    // opcional: mostrar reiniciar
    showRestart();
    return;
  }

  // mostrar próxima pergunta
  await showQuestion(currentIndex);
}

// renderiza a pergunta index
async function showQuestion(index) {
  const data = gameData[index];
  // mostrar a pergunta como texto com typewriter
  const bubble = document.getElementById('bubble');
  bubble.classList.remove('fade-out');
  bubble.classList.add('fade-in');

  // limpar possíveis textos e opções
  textEl.textContent = '';
  choicesEl.classList.remove('hidden');
  choicesEl.classList.remove('fade-out');
  choicesEl.innerHTML = '';

  await typeText(textEl, data.question);

  // após a pergunta digitada, renderizar opções
  showOptions(data.options);
}

// reiniciar (simples)
function showRestart() {
  choicesEl.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'choice-btn primary';
  btn.textContent = 'Reiniciar';
  btn.addEventListener('click', () => {
    currentIndex = 0;
    showQuestion(0);
  });
  choicesEl.appendChild(btn);
  choicesEl.classList.remove('hidden');
}

// inicialização
document.addEventListener('DOMContentLoaded', () => {
  tryStartAmbience();
  // garantir que o primeiro texto apareça
  showQuestion(currentIndex);
});
