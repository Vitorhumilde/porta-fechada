const perguntasFixas = [
  "Onde você estava antes de bater na porta?",
  "O que você faz quando ninguém está olhando?",
  "Qual comida você defenderia até o fim?",
  "O que te deixa desconfortável sem saber por quê?",
  "Se estivesse mentindo agora, como falaria?",
  "Você é humano?"
];

const pessoa = {
  nome: "Caso 0",
  imagem: "imagens/vitor.jpg",
  respostas: [
    "Em casa. O silêncio ajuda a pensar.",
    "Repito pensamentos até eles fazerem sentido.",
    "Pão com qualquer coisa. Simples demais para ser mentira.",
    "Silêncios longos demais.",
    "Falaria exatamente assim.",
    "Acho que sim."
  ],
  tipo: "suspeito"
};

const perguntasDiv = document.getElementById("perguntas");
const imagem = document.getElementById("imagem");
const resultado = document.getElementById("resultado");

imagem.src = pessoa.imagem;

perguntasFixas.forEach((texto, i) => {
  const btn = document.createElement("button");
  btn.innerText = texto;
  btn.onclick = () => alert(pessoa.respostas[i]);
  perguntasDiv.appendChild(btn);
});

function decidir(escolha) {
  resultado.innerText =
    pessoa.tipo === "humano"
      ? "Era humano."
      : "Algo estava errado com essa pessoa.";
}
