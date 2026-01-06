// Main game script

const startBtn = document.getElementById('startBtn');
const questionContainer = document.getElementById('questionContainer');
const questionText = document.getElementById('questionText');
const answersDiv = document.getElementById('answers');
const statusDiv = document.getElementById('status');

// Audio elements (IDs must match those in index.html)
const doorAudio = document.getElementById('door-open');
const typingAudio = document.getElementById('typing');
const ambienceAudio = document.getElementById('ambience');

// Increase gameData to 10 questions
const gameData = [
  {q: 'What is 2 + 2?', a: '4'},
  {q: 'What color is the sky on a clear day?', a: 'blue'},
  {q: 'What is the capital of France?', a: 'paris'},
  {q: 'How many legs does a spider have?', a: '8'},
  {q: 'What is H2O commonly known as?', a: 'water'},
  {q: 'Which planet is known as the Red Planet?', a: 'mars'},
  {q: 'What is the opposite of hot?', a: 'cold'},
  {q: 'How many months are in a year?', a: '12'},
  {q: 'What do bees produce?', a: 'honey'},
  {q: 'What is the largest mammal?', a: 'blue whale'}
];

let currentIndex = 0;
let firstQuestionShown = false;

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  startGame();
});

function startGame() {
  // Play ambience (user interaction already occurred on click)
  try { ambienceAudio.currentTime = 0; ambienceAudio.play(); } catch (e) { console.warn('Ambience could not autoplay:', e); }

  questionContainer.classList.remove('hidden');
  showQuestion(currentIndex);
}

function showQuestion(index) {
  const item = gameData[index];
  answersDiv.innerHTML = '';
  statusDiv.textContent = `Question ${index + 1} of ${gameData.length}`;

  // If this is the first question, play the door open sound once
  if (!firstQuestionShown) {
    firstQuestionShown = true;
    try { doorAudio.currentTime = 0; doorAudio.play(); } catch (e) { console.warn('Door audio could not play:', e); }
  }

  // Use a typing effect for the question text and play typing SFX during typing
  typeText(item.q, questionText, () => {
    // Once the question finishes typing, show simple answer buttons (example: yes/no or text input)
    // For simplicity, we'll show a single input-style button that opens a prompt
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = 'Answer';
    btn.addEventListener('click', () => {
      const resp = prompt('Type your answer:');
      if (resp !== null) checkAnswer(resp);
    });
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(resp) {
  const correct = gameData[currentIndex].a.toLowerCase().trim();
  if (resp.toLowerCase().trim() === correct) {
    statusDiv.textContent = 'Correct!';
  } else {
    statusDiv.textContent = `Wrong — correct answer: ${gameData[currentIndex].a}`;
  }
  // Move to next question after a short delay
  currentIndex++;
  if (currentIndex < gameData.length) {
    setTimeout(() => showQuestion(currentIndex), 900);
  } else {
    setTimeout(endGame, 900);
  }
}

function endGame() {
  questionText.textContent = 'Game over — thanks for playing!';
  answersDiv.innerHTML = '';
  startBtn.disabled = false;
  startBtn.textContent = 'Play Again';
  // Stop ambience
  try { ambienceAudio.pause(); ambienceAudio.currentTime = 0; } catch (e) {}
  currentIndex = 0;
  firstQuestionShown = false;
}

// Typing effect that plays typing SFX while typing
function typeText(text, element, cb) {
  element.textContent = '';
  const chars = Array.from(text);
  let i = 0;

  // Ensure typing audio loops while typing
  typingAudio.loop = true;
  try { typingAudio.currentTime = 0; typingAudio.play(); } catch (e) { /* may be blocked */ }

  function step() {
    if (i < chars.length) {
      element.textContent += chars[i++];
      // small random delay to feel natural
      const delay = 20 + Math.random() * 60;
      setTimeout(step, delay);
    } else {
      // finished typing
      try { typingAudio.pause(); typingAudio.currentTime = 0; } catch (e) {}
      if (typeof cb === 'function') cb();
    }
  }
  step();
}
