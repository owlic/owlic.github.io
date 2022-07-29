const O = 'o';
const X = 'x';
const start = document.getElementById("start");
const restart = document.getElementById("restart");
const board = document.getElementById('board');
const cellElements = document.querySelectorAll('[data-cell]');
const playerTurn = document.getElementById('playerTurn');
const counter1 = document.getElementById('counter1');
const counter2 = document.getElementById('counter2');
let cursor = document.getElementsByClassName('cell');
let timeleft1 = 60000;  //毫秒
let timeleft2 = 60000;
counter1.innerText = (timeleft1 / 1000).toFixed(1);
counter2.innerText = (timeleft2 / 1000).toFixed(1);

const winningState = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
let oTurn = true;
let timePrev;
let requestID;

restart.setAttribute("disabled", true);     //讓 restart 按鈕不可用
start.onclick = startGame;
restart.onclick = restartGame;

function startGame() {
    start.setAttribute("disabled", true);
    restart.removeAttribute("disabled");    //取消 restart 按鈕不可用
    playerTurn.innerText = "O";
    timePrev = Date.now();
    countdown();
    cellElements.forEach(cell => {
        cell.style.cursor = "pointer";
        cell.addEventListener('click', handleClick, {once : true})
    });
    //once : true 在被觸發後自動刪除監聽器(一旦點擊過格子，它就不會再度觸發)，讓已經完成的東西不被覆蓋
    setBoardHover();
}

function countdown() {
    timeCurr = Date.now();

    if (oTurn) {
        timeleft1 = ((timeleft1 - (timeCurr - timePrev)));
        timeleft1 = (timeleft1 <= 0) ? 0 : timeleft1;
        counter1.innerText = (timeleft1 / 1000).toFixed(1);
        if (timeleft1 == 0)
        {  
            endGame(false, X);
            return;
        }
    }
    else {
        timeleft2 = ((timeleft2 - (timeCurr - timePrev)));
        timeleft2 = (timeleft2 <= 0) ? 0 : timeleft2;
        counter2.innerText = (timeleft2 / 1000).toFixed(1);
        if (timeleft2 == 0)
        {
            endGame(false, O);
            return;
        }
    }
    timePrev = timeCurr;

    requestID = requestAnimationFrame(countdown);
}

function restartGame() {
    start.removeAttribute("disabled");
    restart.setAttribute("disabled", true);
    cellElements.forEach(cell => {
        cell.classList.remove(O);
        cell.classList.remove(X);
    });
    board.classList.remove(O);
    board.classList.remove(X);
    timeleft1 = 60000;
    timeleft2 = 60000;
    playerTurn.innerText = "";
    counter1.innerText = (timeleft1 / 1000).toFixed(1);
    counter2.innerText = (timeleft1 / 1000).toFixed(1);
}

function handleClick(e) {   //e 是一合成事件
    const cell = e.target;
    const currentPlayer = oTurn ? O : X;
    cell.classList.add(currentPlayer);  //將當前玩家加入 class
    if (checkWin(currentPlayer)) {
        endGame(false, currentPlayer);
    }
    else if (isDraw()) {
        endGame(true);
    }
    else {
        playerTurn.innerText = oTurn ? "X" : "O";
        oTurn = !oTurn;     //換人
        setBoardHover();
    }
    cell.style.cursor = "default";
}

function setBoardHover() {
    board.classList.remove(O);  //增加目前玩家的類別前先把之前玩家的類別清除
    board.classList.remove(X);
    if (oTurn)
        board.classList.add(O);
    else
        board.classList.add(X);
}

function checkWin(currentPlayer) {
    return winningState.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentPlayer);
        })
    })
}

function endGame(draw, currentPlayer) {
    if (draw)
        alert("平手");
    else
        alert(`贏家是 ${currentPlayer}`);
    board.classList.remove(O);
    board.classList.remove(X);
    cellElements.forEach(cell => {
        cell.style.cursor = "default";
        cell.removeEventListener('click', handleClick);
    });
    cancelAnimationFrame(requestID);
}

function isDraw() {                             //cellElements 沒有 every，為了解決使用解構賦值
    return [...cellElements].every(cell => {    //every: 測試陣列中的所有元素是否都通過了由給定之函式所實作的測試
        return cell.classList.contains(O) ||    //若每個單元都有一種 O 或 X 的 class
               cell.classList.contains(X);
    })
}

