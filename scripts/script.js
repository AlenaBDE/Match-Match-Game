let massColor = ['Aqua', 'Blue', 'Purple', 'Fuchsia', 'Gray', 'Yellow', 'Green', 'Lime', 'Teal', 'Black', 'Olive', 'DarkGreen'];
let massCard = [];
let currentCard = {};
let previousCard = {};
let masContent = [];
let intervalID = 0;
let countSeconds = 0;
let countTime = '';

function timer() {
    let fixTimer = (value) => {
        let str = String(value);
        let result = (value < 10 && str.length === 1) ? "0" + value : value;
        return result;
    }
    let hour = document.getElementById('hour').innerHTML;
    let minute = document.getElementById('minute').innerHTML;
    let second = document.getElementById('second').innerHTML;

    if (second < 59) second++;
    else {
        second = 0;
        if (minute < 59) minute++;
        else {
            second = 0;
            if (hour < 12) hour++;
        }
    }
    document.getElementById('hour').innerHTML = fixTimer(hour);
    document.getElementById('minute').innerHTML = fixTimer(minute);
    document.getElementById('second').innerHTML = fixTimer(second);
    countTime = fixTimer(hour) + ':' + fixTimer(minute) + ':' + fixTimer(second);
    countSeconds = hour * 3600 + minute * 60 + second;
}


function clearTable() {
    let table = document.getElementById('table');
    if (table != null) {
        table.parentNode.removeChild(table);
    }
    massCard = [];
    masContent = [];
    previousCard = {};
    intervalID = 0;
    countSeconds = 0;
    document.getElementById('hour').innerHTML = '00';
    document.getElementById('minute').innerHTML = '00';
    document.getElementById('second').innerHTML = '00';

}

function randomContent(rows, colls) {
    let i = 0;
    let count = rows * colls;
    while (masContent.length < count) {
        masContent.push(i);
        masContent.push(i);
        i++;
    }
}

function getValue() {
    Math.random();
    let index = Math.floor(Math.random() * (masContent.length - 1));
    let value = masContent[index];

    masContent.splice(index, 1);
    return value;
}


function getID(side, i, j) {
    return side + i + j;
}

function setCover(img) {
    let root = document.querySelector(':root');
    root.style.setProperty('--image', 'url(./../images/' + img + ')');
}

function insertStyles(id) {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.' + id + ' {background-color: ' + massColor[getValue()] + '; transform: rotateY( 180deg ); background-image: none;}';
    document.body.appendChild(style);
}


function compareCards() {
    let previousColor = previousCard.getBackgroundColor();
    let currentColor = currentCard.getBackgroundColor();
    if (('id' in previousCard) && (currentColor != 'rgb(255, 255, 255)')) {
        if (previousColor == currentColor) {
            currentCard.removeEventListener('transitionend', endAnimation);
            previousCard.removeEventListener('transitionend', endAnimation);
            currentCard.classList.toggle('hidden-card');
            previousCard.classList.toggle('hidden-card');
            massCard.splice(massCard.indexOf(previousCard), 1);
            massCard.splice(massCard.indexOf(currentCard), 1);
            previousCard = {};
            currentCard = {};
            if (massCard.length == 0) {
                clearInterval(intervalID);
                alert(window.localStorage.getItem('firstName') + ' ' + window.localStorage.getItem('lastName') + '\n Your time: ' + countTime);
                clearTable();
            }

        } else {
            if ((previousColor != 'rgb(255, 255, 255)') && (currentColor != 'rgb(255, 255, 255)') && (previousColor != currentColor)) {
                currentCard.classList.toggle(currentCard.id);
                previousCard.classList.toggle(previousCard.id);
                previousCard = {};
                currentCard = {};
            }
        }
    }
}


function load() {
    window.localStorage.removeItem("firstName");
    window.localStorage.removeItem("lastName");
    window.localStorage.removeItem("email");
}

document.addEventListener("DOMContentLoaded", load);


function setOnClick(onoff) {
    massCard.forEach(function (item) {
        item.onclick = onoff ? clickCard : null;
    });
}

function endAnimation(event) {
    if (event.propertyName == 'background-color') {
        setOnClick(false);
        compareCards();
        setOnClick(true);
    }
}

function createTable(rows, cells) {
    clearTable();

    if (!('firstName' in window.localStorage)) {
        showPrompt("Расскажи о себе<br>...сынок! :)", function (value) {
            if (value != null) {
                window.localStorage.firstName = value.fname;
                window.localStorage.lastName = value.lname;
                window.localStorage.email = value.email;
            }
        });
    }
    randomContent(rows, cells);

    let table = document.createElement('table');
    let div_table = document.getElementById('div_table');
    div_table.appendChild(table);
    table.setAttribute('border', '1');
    table.id = 'table';
    table.class = 'container';
    div_table.style.zIndex = 0;

    for (let i = 1; i <= cells; i++) {
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for (let j = 1; j <= rows; j++) {
            let td = document.createElement('td');
            td.className = 'card';

            let cardFront = document.createElement('figure');
            cardFront.className = 'card-front';
            cardFront.id = getID('f', i, j);
            cardFront.onclick = clickCard;
            cardFront.addEventListener('transitionend', endAnimation);
            massCard.push(cardFront);
            td.appendChild(cardFront);
            tr.appendChild(td);
            insertStyles(cardFront.id);
        }
    }
}


Object.prototype.getBackgroundColor = function () {
    if ('id' in this) {
        return (window.getComputedStyle(this, null)['background-color'] || this.currentStyle['background-color']);
    }
    else {
        return null;
    }
};


function clickCard() {
    if (this != currentCard) {
        previousCard = currentCard;
        currentCard = this;
        this.classList.toggle(currentCard.id);
    }

    if (intervalID == 0) {
        intervalID = setInterval(timer, 1000);
    }

}



