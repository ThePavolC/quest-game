const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

let successLimit = 18;
let matches = 0;
let numberOfPairs = 9;
let riddle =
  "Z dreva som vyrezaný, " +
  "zvukmi sa s tebou hneď rozprávam. " +
  "Fúkať viem ako vietor silný, " +
  "radosť ti prinášam, smútok zaháňam. " +
  "Čo som?";
let failMessage =
  "Nepodarilo sa ti nájsť všetky dvojice v menej ako " +
  successLimit +
  " ťahoch. Skús to znova.";

document.querySelector(".score").textContent = score;

document.querySelector("h4").textContent =
  "Ziskaj menej ako " + successLimit + " bodov, aby si získala ďalšiu hádanku.";

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front container">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  score++;
  document.querySelector(".score").textContent = score;

  secondCard = this;
  lockBoard = true;
  checkForMatch();
}

function showModal() {
  // set modal message
  $("#message-modal").on("show.bs.modal", function (event) {
    var modal = $(this);
    if (score <= successLimit) {
      modal.find(".modal-body").text(riddle);
    } else {
      modal.find(".modal-body").text(failMessage);
    }
  });

  // reload on close
  $("#message-modal").on("hidden.bs.modal", function (e) {
    console.log("realod");
    location.reload();
  });

  // show modal
  $("#message-modal").modal("show");
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  console.log("matches:", matches);
  if (isMatch) {
    matches++;
    if (matches >= successLimit || matches === numberOfPairs) {
      showModal();
    }
  }

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  matches = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}
