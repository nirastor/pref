// **** CARDS ****

// Сотни задают масть: 100 -- пики, 200 -- трефы, 300 -- бубы, 400 -- червы
// Десятки и единицы карту: 7 -- 7, … , 10 -- 10, 11 -- J, 12 -- Q, 13 -- K, 14 -- A
const ALLCARDS = [
    107, 108, 109, 110, 111, 112, 113, 114,
    207, 208, 209, 210, 211, 212, 213, 214,
    307, 308, 309, 310, 311, 312, 313, 314,
    407, 408, 409, 410, 411, 412, 413, 414
];

// ♣   &#9827;   &clubs;   Карточный знак масти 'трефы' с закрашенным фоном.
// ♠   &#9824;   &spades;  Карточный знак масти 'пики' с закрашенным фоном.
// ♥   &#9829;   &hearts;  Карточный знак масти 'червы' с закрашенным фоном.
// ♦   &#9830;   &diams;   Карточный знак масти 'бубны' с закрашенным фоном.
const CARDSHOWHTML = {
    107: '♠7',
    108: '♠8',
    109: '♠9',
    110: '♠10',
    111: '♠J',
    112: '♠Q',
    113: '♠K',
    114: '♠A',
    207: '♣7',
    208: '♣8',
    209: '♣9',
    210: '♣10',
    211: '♣J',
    212: '♣Q',
    213: '♣K',
    214: '♣A',
    307: '<span class="red-card-text">♦7</span>',
    308: '<span class="red-card-text">♦8</span>',
    309: '<span class="red-card-text">♦9</span>',
    310: '<span class="red-card-text">♦10</span>',
    311: '<span class="red-card-text">♦J</span>',
    312: '<span class="red-card-text">♦Q</span>',
    313: '<span class="red-card-text">♦K</span>',
    314: '<span class="red-card-text">♦A</span>',
    407: '<span class="red-card-text">♥7</span>',
    408: '<span class="red-card-text">♥8</span>',
    409: '<span class="red-card-text">♥9</span>',
    410: '<span class="red-card-text">♥10</span>',
    411: '<span class="red-card-text">♥J</span>',
    412: '<span class="red-card-text">♥Q</span>',
    413: '<span class="red-card-text">♥K</span>',
    414: '<span class="red-card-text">♥A</span>'
}

const MIN_STEP_TO_NEXT_SUIT = 92; // 207 - 114 - 1
const MIN_CARD_ID = 107;

let currentUserCards = [];
let allGameCards = [];



// *** GAME STATUS
let maxSelectedCards = 1;
let nowSelectedCards = 0;
let selectedCards = [];
let gameStatus = 'wait' // reset-buy, make-move

// *** GAME CONTROLS


let elHand = document.getElementById('hand');
let elMessages = document.getElementById('messages');
let elCardSetting = document.querySelector('.card-area-setting');

let elButtonAndTipsHeader = document.querySelector('.buttons-and-tips-header');
let elButtonsContainerResetBuy = document.getElementById('reset-buy-buttons-container');
let elButtonsContainerMakeMove = document.getElementById('make-move-buttons-container');
let elButtonsContainerBuyOk = document.getElementById('buy-ok-buttons-container');

let btnResetBuy = document.getElementById('btn-reset-buy-action');
let btnMakeMove = document.getElementById('btn-make-move-action');
let btnBuyOk = document.getElementById('btn-buy-ok-action');

let controlCardsSettinsOpen = document.querySelector('.card-area-settings-open-button');
let controlCardsSettinsClose = document.querySelector('.card-area-settings-close-button');
let controlCardRefresh = document.querySelector('.card-area-settings-refresh');


// *** SERVER IMITATION CONTROLS ***
let servNewGame = document.getElementById('server-new-game');
let servGetBuy = document.getElementById('server-get-buy');
let servTurn1Card = document.getElementById('server-turn-1card');

let isGetBuyAvl = true;

function hideAllButtonContainers() {
    elButtonsContainerMakeMove.style.display = 'none';
    elButtonsContainerResetBuy.style.display = 'none';
    elButtonsContainerBuyOk.style.display = 'none';
}

servNewGame.onclick = function() {
    showCards(tenRandomCards());
    isGetBuyAvl = true;
    servGetBuy.classList.remove('server-button-disable');

    while (elMessages.firstChild) {
        elMessages.removeChild(elMessages.firstChild)
    }

    showGameMessage('Новая разадача');
}

servGetBuy.onclick = function() {
    if (isGetBuyAvl) {
        isGetBuyAvl = false;
        
        servGetBuy.classList.add('server-button-disable');
        currentUserCards.push(allGameCards[30]);
        currentUserCards.push(allGameCards[31]);
        showCards();
        document.getElementById(allGameCards[30]).classList.add('card-selected');
        document.getElementById(allGameCards[31]).classList.add('card-selected');
        
        showGameMessage(`Кот получил прикуп: ${CARDSHOWHTML[allGameCards[30]]} и ${CARDSHOWHTML[allGameCards[31]]}`);
        hideAllButtonContainers();
        elButtonAndTipsHeader.innerHTML = 'Пришло в прикупе';
        elButtonsContainerBuyOk.style.display = 'flex';
    }
}

servTurn1Card.onclick = function() {
    maxSelectedCards = 1;
    nowSelectedCards = 0;
    // тут возможно стоит и уже выбранные  карты сбрасывать (но в реальной жизни это будет невозможный сценарий)
    elButtonAndTipsHeader.innerHTML = 'Ваш ход:';
    hideAllButtonContainers();
    elButtonsContainerMakeMove.style.display = 'flex';
    gameStatus = 'make-move';
    btnMakeMove.classList.add('action-disable');
}


btnResetBuy.onclick = function() {
    if (nowSelectedCards === 2) {
        maxSelectedCards = 1;
        nowSelectedCards = 0;
        // тут возможно стоит и уже выбранные  карты сбрасывать (но в реальной жизни это будет невозможный сценарий)
        elButtonAndTipsHeader.innerHTML = 'Действия';
        elButtonsContainerResetBuy.style.display = 'none';
        gameStatus = 'wait';

        let message = document.createElement('div');
        message.classList.add('message');
        message.innerHTML = `Кот сбросил ${CARDSHOWHTML[selectedCards[0]]} и ${CARDSHOWHTML[selectedCards[1]]}`;
        elMessages.appendChild(message);
        elMessages.lastChild.scrollIntoView();

        for (let i = 0; i < 2; i++) {
            document.getElementById(selectedCards[i]).style.display = 'none';
            currentUserCards.splice(currentUserCards.indexOf(selectedCards[i]),1);
        }

        nowSelectedCards = 0;
        selectedCards = [];

        showCards();

    
    } else {
        alert('Карт должно быть две');
    }
}


btnMakeMove.onclick = function() {
    if (nowSelectedCards === 1) {
        elButtonAndTipsHeader.innerHTML = 'Действия';
        elButtonsContainerMakeMove.style.display = 'none';
        gameStatus = 'wait';

        document.getElementById(selectedCards[0]).style.display = 'none';
        currentUserCards.splice(currentUserCards.indexOf(selectedCards[0]),1);

        showGameMessage(`Кот походил ${CARDSHOWHTML[selectedCards[0]]}`);

        nowSelectedCards = 0;
        selectedCards = [];
        btnMakeMove.classList.remove('action-disable');
    }
}

btnBuyOk.onclick = function() {
    document.getElementById(allGameCards[30]).classList.remove('card-selected');
    document.getElementById(allGameCards[31]).classList.remove('card-selected');
    maxSelectedCards = 2;
    nowSelectedCards = 0;
    // тут возможно стоит и уже выбранные  карты сбрасывать (но в реальной жизни это будет невозможный сценарий)
    elButtonAndTipsHeader.innerHTML = 'Сбросить прикуп';
    hideAllButtonContainers();
    elButtonsContainerResetBuy.style.display = 'flex';
    gameStatus = 'reset-buy';
    btnResetBuy.classList.add('action-disable');
}

controlCardsSettinsOpen.onclick = function() {
    elCardSetting.style.display = 'block';
}

controlCardsSettinsClose.onclick = function() {
    elCardSetting.style.display = 'none';
    showCards(currentUserCards);
}




// *** CARD SETTING AREA ***

// radio-buttons for card-area-setting
let radioSuitOrderDirect = document.getElementById('suit-order-direct');
let radioSuitOrderAlternate = document.getElementById('suit-order-alternate');
let radioCardOrderASC = document.getElementById('card-order-asc');
let radioCardOrderDESC = document.getElementById('card-order-desc');
let radioSpaceBetweenSuitYes = document.getElementById('card-space-yes');
let radioSpaceBetweenSuitNo = document.getElementById('card-space-no');

// vars for card-area-setting
let isSuitOrderAlternate = true;
let isCardOrderASC = true;
let isSpaceBetweenSuit = true;

// oncklickfor card-area-setting
radioSuitOrderDirect.onclick = function() {
    isSuitOrderAlternate = false;
}

radioSuitOrderAlternate.onclick = function() {
    isSuitOrderAlternate = true;
}

radioCardOrderASC.onclick = function() {
    isCardOrderASC = true;
}

radioCardOrderDESC.onclick = function() {
    isCardOrderASC = false;
}

radioSpaceBetweenSuitYes.onclick = function() {
    isSpaceBetweenSuit = true;
}

radioSpaceBetweenSuitNo.onclick = function() {
    isSpaceBetweenSuit = false;
}

controlCardRefresh.onclick = function() {
    showCards();
}

// oncklickfor card-area-setting END




// *** CARDS sort, create, click ***

function tenRandomCards() {
    allGameCards = ALLCARDS.slice();
    
    for (let i = allGameCards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [allGameCards[i], allGameCards[j]] = [allGameCards[j], allGameCards[i]];
    }

    currentUserCards = allGameCards.slice(0, 10);

    return currentUserCards;
}

function sortCards(arr) {
    // isAlternate
    // isReverse
    
    // parse card
    let spadesInHand = [];	// Пики
    let clubsInHand = [];	// Трефы
    let diamondsInHand = [];	// Бубны
    let heartsInHand = []; // Червы

    while (arr[0]) {
       let parsedCard = arr.pop()
       switch (Math.floor(parsedCard / 100)) {
            case 1:
                spadesInHand.push(parsedCard);
                break;
            case 2:
                clubsInHand.push(parsedCard);
                break;
            case 3:
                diamondsInHand.push(parsedCard);
                break;
            case 4:
                heartsInHand.push(parsedCard);
                break;
       } 
    }

    spadesInHand.sort();
    clubsInHand.sort();
    diamondsInHand.sort();
    heartsInHand.sort();

    if (!isCardOrderASC) {
        spadesInHand.reverse();
        clubsInHand.reverse();
        diamondsInHand.reverse();
        heartsInHand.reverse();
    }

    if (isSuitOrderAlternate) {
        return spadesInHand.concat(diamondsInHand, clubsInHand, heartsInHand);
    }

    return spadesInHand.concat(clubsInHand, diamondsInHand, heartsInHand);
}

function showCards() {
    // for debug what is in
    
    // todo any kinds of sort
    currentUserCards = sortCards(currentUserCards);
    
    console.log(currentUserCards);
    
    // clean hand
    while (elHand.firstChild) {
        elHand.removeChild(elHand.firstChild)
    }

    //show every card
    let cssLeft = 40;
    let cssLeftStepBtwCards = 35;
    let cssLeftAdditionalBtwSuits = isSpaceBetweenSuit ? 80 : 0;
    
    for (let i = 0; i < currentUserCards.length; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `${CARDSHOWHTML[currentUserCards[i]]}`;
        card.style.left = cssLeft + 'px';
        card.id = `${currentUserCards[i]}`;
        elHand.appendChild(card);
        cssLeft += cssLeftStepBtwCards;
        if (currentUserCards[i + 1] > currentUserCards[i] + MIN_STEP_TO_NEXT_SUIT ||
            currentUserCards[i + 1] < currentUserCards[i] - MIN_STEP_TO_NEXT_SUIT ) {
            cssLeft += cssLeftAdditionalBtwSuits;
        }
    }
}

elHand.addEventListener('click', function (e) {
    let cardID = +e.target.id;

    // Так не работает
    // if (cardID < MIN_CARD_ID) {
    //     return false;
    // }

    
    if (cardID >= MIN_CARD_ID && gameStatus === 'reset-buy') {
        if (selectedCards.includes(cardID)) {
            nowSelectedCards--;
            e.target.classList.remove('card-selected');
            selectedCards.splice(selectedCards.indexOf(cardID),1);
        } else if (nowSelectedCards !== 2) {
            nowSelectedCards++;
            e.target.classList.add('card-selected');
            selectedCards.push(cardID);
        }

        if (nowSelectedCards === 2) {
            btnResetBuy.classList.remove('action-disable');
        } else {
            btnResetBuy.classList.add('action-disable');
        }
    }

    if (cardID >= MIN_CARD_ID && gameStatus === 'make-move') {
        let delCard = selectedCards.pop();
        if (delCard === cardID) {
            nowSelectedCards--;
            e.target.classList.remove('card-selected');
            btnMakeMove.classList.add('action-disable');
        } else if (delCard) {
            e.target.classList.add('card-selected');
            document.getElementById(delCard).classList.remove('card-selected');
            selectedCards.push(cardID);
        } else {
            nowSelectedCards++;
            e.target.classList.add('card-selected');
            btnMakeMove.classList.remove('action-disable');
            selectedCards.push(cardID);
        }
    } 
    
});

function showGameMessage(messageText) {
    let message = document.createElement('div');
    message.classList.add('message');
    message.innerHTML = messageText;
    elMessages.appendChild(message);
    elMessages.lastChild.scrollIntoView();
}