// Сотни задают масть: 100 -- пики, 200 -- трефы, 300 -- бубы, 400 -- червы
// Десятки и единицы карту: 7 -- 7, … , 10 -- 10, 11 -- J, 12 -- Q, 13 -- K, 14 -- A


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

// ♣	&'9827;	&clubs; Карточный знак масти "трефы" с закрашенным фоно'.
// ♠	&#9824;	&spades; Карточный знак масти "пики" с закрашенным фоном.
// ♥	&#9829;	&hearts; Карточный знак масти "червы" с закрашенным фоном.
// ♦

let btnDeal = document.getElementById("deal");
let elHand = document.getElementById("hand");
let elMessages = document.getElementById("messages");
let controlCardsSettinsOpen = document.querySelector(".card-area-settings-open-button");
let controlCardsSettinsClose = document.querySelector(".card-area-settings-close-button");
let elCardSetting = document.querySelector(".card-area-setting");

let radioSuitOrderDirect = document.getElementById("suit-order-direct");
let radioSuitOrderAlternate = document.getElementById("suit-order-alternate");

let isSuitOrderAlternate = true;
let isCardOrderASC = true;
let isSpaceBetweenSuit = true;

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

function cardClick() {
    console.log("click");
    card.style.top = "10px";
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
        card.onclick = function() {cardClick()}
        elHand.appendChild(card);
        
        cssLeft += cssLeftStepBtwCards;
        if (currentUserCards[i + 1] > currentUserCards[i] + MINSTEPTONEXTSUIT ||
            currentUserCards[i + 1] < currentUserCards[i] - MINSTEPTONEXTSUIT ) {
            cssLeft += cssLeftAdditionalBtwSuits;
        }
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

radioSuitOrderDirect.onclick = function() {
    isSuitOrderAlternate = false;
}

radioSuitOrderAlternate.onclick = function() {
    isSuitOrderAlternate = true;
}

showCards(tenRandomCards());