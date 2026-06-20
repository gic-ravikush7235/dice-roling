const dice1 = document.getElementById('btn1');
const dice2 = document.getElementById('btn2');
const rollBtn = document.getElementById('btn');
const diceResult = document.getElementById('diceResult');
const rollSummary = document.getElementById('rollSummary');
const diceHistory = document.getElementById('diceHistory');
const clearBtn = document.getElementById('clear');

let history = [];
let selectedDiceCount = 1;

function loadHistory() {
    const savedHistory = localStorage.getItem('history');

    if (!savedHistory) {
        return [];
    }

    try {
        const parsedHistory = JSON.parse(savedHistory);
        return Array.isArray(parsedHistory) ? parsedHistory : [];
    } catch {
        return [];
    }
}

function setActiveDiceButton(count) {
    dice1.classList.toggle('active', count === 1);
    dice2.classList.toggle('active', count === 2);
}

function setDiceCount(count) {
    selectedDiceCount = count;
    setActiveDiceButton(count);
}

function randomNumberGenerator() {
    return Math.floor(Math.random() * 6) + 1;
}

function createPips(positions) {
    return positions
        .map((position) => `<span class="dot pip pip-${position}"></span>`)
        .join('');
}

function createDiceFace(value) {
    switch (value) {
        case 1:
            return '<div class="dice face-1"><span class="dot"></span></div>';
        case 2:
            return `<div class="dice face-2">${createPips([1, 9])}</div>`;
        case 3:
            return `<div class="dice face-3">${createPips([1, 5, 9])}</div>`;
        case 4:
            return `<div class="dice face-4">${createPips([1, 3, 7, 9])}</div>`;
        case 5:
            return `<div class="dice face-5">${createPips([1, 3, 5, 7, 9])}</div>`;
        case 6:
            return `
                <div class="dice face-6">
                    <div class="column">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                    <div class="column">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                </div>
            `;
        default:
            return '<div class="dice face-1"><span class="dot"></span></div>';
    }
}

function renderDiceResult(rolls) {
    diceResult.innerHTML = rolls.map((value) => createDiceFace(value)).join('');
}

function renderIdleState() {
    renderDiceResult([1]);
    rollSummary.textContent = 'Select a dice count and roll.';
}

function renderHistory() {
    diceHistory.innerHTML = '';
    history.forEach((item) => {
        const entry = document.createElement('div');
        entry.innerText = item;
        diceHistory.appendChild(entry);
    });

    localStorage.setItem('history', JSON.stringify(history));
}

function rollDice() {
    const rolls = Array.from({ length: selectedDiceCount }, randomNumberGenerator);
    const total = rolls.reduce((sum, value) => sum + value, 0);

    renderDiceResult(rolls);
    rollSummary.textContent = selectedDiceCount === 1
        ? `You rolled ${rolls[0]}.`
        : `You rolled ${rolls.join(' + ')} = ${total}.`;

    history.unshift(`Rolled ${selectedDiceCount} dice: ${rolls.join(' + ')} = ${total}`);
    renderHistory();
}

dice1.addEventListener('click', () => setDiceCount(1));
dice2.addEventListener('click', () => setDiceCount(2));
// dice3.addEventListener('click', () => setDiceCount(3));
// dice4.addEventListener('click', () => setDiceCount(4));

rollBtn.addEventListener('click', rollDice);
clearBtn.addEventListener('click', () => {
    history = [];
    diceHistory.innerHTML = '';
    localStorage.removeItem('history');
    renderIdleState();

});

history = loadHistory();
renderHistory();
setActiveDiceButton(selectedDiceCount);
renderIdleState();


