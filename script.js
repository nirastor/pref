



// **** CARDS ****

// Сотни задают масть: 100 -- пики, 200 -- трефы, 300 -- бубы, 400 -- червы
// Десятки и единицы карту: 7 -- 7, … , 10 -- 10, 11 -- J, 12 -- Q, 13 -- K, 14 -- A

// ♣   &#9827;   &clubs;   Карточный знак масти "трефы" с закрашенным фоном.
// ♠   &#9824;   &spades;  Карточный знак масти "пики" с закрашенным фоном.
// ♥   &#9829;   &hearts;  Карточный знак масти "червы" с закрашенным фоном.
// ♦   &#9830;   &diams;   Карточный знак масти "бубны" с закрашенным фоном.

const ALLCARDS = [
    107, 108, 109, 110, 111, 112, 113, 114,
    207, 208, 209, 210, 211, 212, 213, 214,
    307, 308, 309, 310, 311, 312, 313, 314,
    407, 408, 409, 410, 411, 412, 413, 414
];

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

const MINSTEPTONEXTSUIT = 92; // 207 - 114 - 1

let currentUserCards = [];



// *** GAME STATUS
let maxSelectedCards = 1;
let nowSelectedCards = 0;
let selectedCards = [];
let gameStatus = "game" // trade, score, reset-buy




// *** GENERALCONTROLS ***

let btnDeal = document.getElementById("deal");
let btnOpenResetBuyDialog = document.getElementById("btn-reset-buy-open-dialog");
let btnResetBuy = document.getElementById("btn-reset-buy-action");

let controlCardsSettinsOpen = document.querySelector(".card-area-settings-open-button");
let controlCardsSettinsClose = document.querySelector(".card-area-settings-close-button");

let elHand = document.getElementById("hand");
let elMessages = document.getElementById("messages");
let elCardSetting = document.querySelector(".card-area-setting");
let elButtonAndTipsHeader = document.querySelector(".buttons-and-tips-header");
let elButtonsContainerMain = document.getElementById("main-game-buttons-container");
let elButtonsContainerResetBuy = document.getElementById("reset-buy-buttons-container");

btnOpenResetBuyDialog.onclick = function() {
    maxSelectedCards = 2;
    nowSelectedCards = 0;
    // тут возможно стоит и уже выбранные  карты сбрасывать (но в реальной жизни это будет невозможный сценарий)
    elButtonAndTipsHeader.innerHTML = "Сбросить прикуп";
    elButtonsContainerMain.style.display = "none";
    elButtonsContainerResetBuy.style.display = "flex";
    gameStatus = "reset-buy";
}

btnResetBuy.onclick = function() {
    if (nowSelectedCards === 2) {
        maxSelectedCards = 1;
        nowSelectedCards = 0;
        // тут возможно стоит и уже выбранные  карты сбрасывать (но в реальной жизни это будет невозможный сценарий)
        elButtonAndTipsHeader.innerHTML = "Действия";
        elButtonsContainerMain.style.display = "flex";
        elButtonsContainerResetBuy.style.display = "none";
        gameStatus = "game";

        let message = document.createElement("div");
        message.classList.add("message");
        message.innerHTML = `Кот сбросил ${CARDSHOWHTML[selectedCards[0]]} и ${CARDSHOWHTML[selectedCards[1]]}`;
        elMessages.appendChild(message);
        elMessages.lastChild.scrollIntoView();

        for (let i = 0; i < 2; i++) {
            document.getElementById(selectedCards[i]).style.display = "none";
            currentUserCards.splice(currentUserCards.indexOf(selectedCards[i]),1);
        }

        nowSelectedCards = 0;
        selectedCards = [];

    
    } else {
        alert("Карт должно быть две");
    }
}

btnDeal.onclick = function() {
    showCards(tenRandomCards());
}

controlCardsSettinsOpen.onclick = function() {
    elCardSetting.style.display = "block";
}

controlCardsSettinsClose.onclick = function() {
    elCardSetting.style.display = "none";
    showCards(currentUserCards);
}




// *** CARD SETTING AREA ***

// radio-buttons for card-area-setting
let radioSuitOrderDirect = document.getElementById("suit-order-direct");
let radioSuitOrderAlternate = document.getElementById("suit-order-alternate");
let radioCardOrderASC = document.getElementById("card-order-asc");
let radioCardOrderDESC = document.getElementById("card-order-desc");
let radioSpaceBetweenSuitYes = document.getElementById("card-space-yes");
let radioSpaceBetweenSuitNo = document.getElementById("card-space-no");

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
// oncklickfor card-area-setting END




// *** CARDS sort, create, click ***

function tenRandomCards() {
    let arr = ALLCARDS.slice();
    
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    currentUserCards = arr.slice(0, 10);

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

function showCards(arr) {
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
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `${CARDSHOWHTML[currentUserCards[i]]}`;
        card.style.left = cssLeft + "px";
        card.id = `${currentUserCards[i]}`;
        elHand.appendChild(card);
        cssLeft += cssLeftStepBtwCards;
        if (currentUserCards[i + 1] > currentUserCards[i] + MINSTEPTONEXTSUIT ||
            currentUserCards[i + 1] < currentUserCards[i] - MINSTEPTONEXTSUIT ) {
            cssLeft += cssLeftAdditionalBtwSuits;
        }
    }
}

elHand.addEventListener("click", function (e) {
    let cardID = e.target.id;

    if (cardID && maxSelectedCards != nowSelectedCards) {
        e.target.classList.add("card-selected");
        nowSelectedCards++;
        selectedCards.push(cardID);
        console.log(selectedCards);
        
    } else if (cardID && e.target.classList.contains("card-selected")) {
        e.target.classList.remove("card-selected");
        nowSelectedCards--;
        selectedCards.splice(selectedCards.indexOf(cardID),1);
        console.log(selectedCards);
    }
});

elHand.addEventListener("dblclick", function (e) {
    let cardID = e.target.id;

    if (gameStatus === "game" && cardID && e.target.classList.contains("card-selected")) {
        e.target.style.display = "none";
        currentUserCards.splice(currentUserCards.indexOf(cardID),1);
        nowSelectedCards--;
        selectedCards = [];

        let message = document.createElement("div");
        message.classList.add("message");
        message.innerHTML = `Кот походил ${CARDSHOWHTML[cardID]}`;
        elMessages.appendChild(message);
        elMessages.lastChild.scrollIntoView();
    }
});





// *** MAIN ***

showCards(tenRandomCards());