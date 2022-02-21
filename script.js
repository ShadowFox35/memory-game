class MemoryGame {
  constructor() {
    this.cardsContainer =
      document.querySelector('.js-cards');
    this.cards = Array.from(this.cardsContainer.children);
    this.flippedCards = [];
    this.delay = 1000;
    this.countStaps = 0;
    this.steps = document.querySelector('.info_steps');
    this.restartBtn = document.querySelector('.new-game');
    this.typeLevel = 'mid';
    this.infoSteps = document.querySelector('.info');
  }

  rearrangeCards() {
    console.log('rearrange', this.cards);
    this.cards.forEach((card) => {
      const randomNumber =
        Math.floor(Math.random() * this.cards.length) + 1;
      card.classList.remove('has-match');
      card.classList.remove('flipped');
      setTimeout(() => {
        card.style.order = `${randomNumber}`;
      }, 400);
    });
  }

  restart() {
    this.rearrangeCards();
    this.flippedCards = [];
    this.steps.innerHTML = `0`;
    this.countStaps = 0;
    this.infoSteps.style.display = 'none';
  }

  validateCards() {
    const [firstCard, secondCard] = this.flippedCards;
    this.cardsContainer.classList.add('no-event');

    if (
      firstCard.attributes[1].nodeValue ===
      secondCard.attributes[1].nodeValue
    ) {
      firstCard.classList.replace('flipped', 'has-match');
      secondCard.classList.replace('flipped', 'has-match');

      this.flippedCards = [];

      setTimeout(() => {
        const allHaveMatches = this.cards.filter(
          (card) => !card.classList.contains('has-match')
        );

        this.cardsContainer.classList.remove('no-event');
        if (!allHaveMatches.length) {
          let history = JSON.parse(
            localStorage.getItem('history')
          );
          if (history) {
            history[this.typeLevel].unshift(
              this.countStaps
            );
            if (history[this.typeLevel].length > 10) {
              history[this.typeLevel].pop();
            }
          } else {
            history = {
              ez: [],
              mid: [],
              hard: [],
            };
            history[this.typeLevel].unshift(
              this.countStaps
            );
          }
          localStorage.setItem(
            'history',
            JSON.stringify(history)
          );
          this.infoSteps.style.display = 'flex';
          addNewHistory();
        }
      }, this.delay);
    } else {
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        this.flippedCards = [];

        this.cardsContainer.classList.remove('no-event');
      }, this.delay);
    }
  }

  flip(selectedCard) {
    selectedCard.classList.add('flipped');

    this.flippedCards.push(selectedCard);

    if (this.flippedCards.length === 2) {
      this.countStaps++;
      this.steps.innerHTML = `${this.countStaps}`;
      this.validateCards();
    }
  }

  changeCards(add, deleteArr, type) {
    if (deleteArr.length) {
      this.cards = this.cards.filter((card) => {
        return (
          deleteArr.indexOf(
            card.attributes[1].nodeValue
          ) === -1
        );
      });
    }
    if (add.length) {
      const newMas = add.filter(
        (card) =>
          this.cards.findIndex(
            (elem) =>
              elem.attributes[1].nodeValue ===
              card.attributes[1].nodeValue
          ) === -1
      );
      this.cards = [...this.cards, ...newMas];
    }
    this.typeLevel = type;
  }
}

const game = new MemoryGame();
game.cards.forEach((card) => {
  card.addEventListener(
    'click',
    game.flip.bind(game, card)
  );
});

// Новая игра
game.restartBtn.onclick = function () {
  game.restart.call(game);
};
//

// Рекорды
const recordsBtn = document.querySelector('.records');
const canselBtn = document.querySelector(
  '.records-menu_cansel'
);
const recordsMenu = document.querySelector('.records-menu');
recordsBtn.onclick = function () {
  recordsMenu.style.display = 'flex';
};
canselBtn.onclick = function () {
  recordsMenu.style.display = 'none';
};
//
const levelBtn = document.getElementsByName('contact');
const cards = document.querySelector('.game__cards');

levelBtn.forEach((input) => {
  input.addEventListener('change', changeLevel);
});

const ez = document.querySelector('.ez');
const mid = document.querySelector('.mid');
const hard = document.querySelector('.hard');
addNewHistory();
changeLevel({
  target: {
    id: 'mid',
  },
});
function changeLevel(e) {
  const octopus = document.getElementsByName('octopus');
  const fish = document.getElementsByName('fish');
  const coral = document.getElementsByName('coral');
  const dolphin = document.getElementsByName('dolphin');
  if (e.target.id === 'ez') {
    octopus.forEach((card) => {
      card.style.display = 'none';
    });
    fish.forEach((card) => {
      card.style.display = 'none';
    });
    coral.forEach((card) => {
      card.style.display = 'none';
    });
    dolphin.forEach((card) => {
      card.style.display = 'none';
    });
    game.changeCards.call(
      game,
      [],
      ['octopus', 'fish', 'coral', 'dolphin'],
      e.target.id
    );
    cards.style.gridTemplateColumns = 'repeat(4, 1fr)';
    game.restart.call(game);
  } else if (e.target.id === 'mid') {
    octopus.forEach((card) => {
      card.style.display = 'block';
    });
    fish.forEach((card) => {
      card.style.display = 'block';
    });
    coral.forEach((card) => {
      card.style.display = 'none';
    });
    dolphin.forEach((card) => {
      card.style.display = 'none';
    });
    cards.style.gridTemplateColumns = 'repeat(5, 1fr)';
    game.changeCards.call(
      game,
      [...octopus, ...fish],
      ['coral', 'dolphin'],
      e.target.id
    );
    game.restart.call(game);
  } else if (e.target.id === 'hard') {
    octopus.forEach((card) => {
      card.style.display = 'block';
    });
    fish.forEach((card) => {
      card.style.display = 'block';
    });
    coral.forEach((card) => {
      card.style.display = 'block';
    });
    dolphin.forEach((card) => {
      card.style.display = 'block';
    });
    cards.style.gridTemplateColumns = 'repeat(6, 1fr)';
    game.changeCards.call(
      game,
      [...octopus, ...fish, ...coral, ...dolphin],
      [],
      e.target.id
    );
    game.restart.call(game);
  }
}

function addNewHistory() {
  let history = JSON.parse(localStorage.getItem('history'));
  if (history) {
    let ezString = '';
    let midString = '';
    let hardString = '';
    const sortEasyArray = history.ez?.sort((a, b) => a - b);
    const sortMidArray = history.mid?.sort((a, b) => a - b);
    const sortHardArray = history.hard?.sort(
      (a, b) => a - b
    );
    sortEasyArray?.forEach((elem, index) => {
      ezString += `<tr>
    <td class="position">${index + 1}. </td>

    <td class="result">${elem}</td>
  </tr>`;
    });
    sortMidArray?.forEach((elem, index) => {
      midString += `<tr>
    <td class="position">${index + 1}. </td>

    <td class="result">${elem}</td>
  </tr>`;
    });
    sortHardArray?.forEach((elem, index) => {
      hardString += `<tr>
    <td class="position">${index + 1}. </td>

    <td class="result">${elem}</td>
  </tr>`;
    });
    ez.innerHTML = ezString;
    mid.innerHTML = midString;
    hard.innerHTML = hardString;
  }
}
