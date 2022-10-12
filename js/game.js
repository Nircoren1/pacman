'use strict'

const SIZE = 10

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '•'
const CHERRY = '🍒'

var gGame = {
    score: 0,
    isOn: false,
    foodCount:0
}
var gBoard
var gFoodCount
var gIntervalCherrys
//change food to local?
function init() {

    playSound('media/pacman_beginning.wav')
    document.querySelector(".modal").classList.toggle('hidden')
   
    gBoard = buildBoard()
    gFoodCount = countFood(0)
    gIntervalCherrys = setInterval(createCherry,15000)
    resetGgame()
    createPacman(gBoard)
   
    renderBoard(gBoard, '.board-container')
    setTimeout(function(){
        gGame.isOn = true
      
    },4000)
    setTimeout(function(){ createGhosts(gBoard)
    },3000)
   
    

}

function buildBoard() {
    const board = []

    for (var i = 0; i < SIZE; i++) {
        board.push([])

        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL
            }
        }
    }

    board[1][1] = SUPER_FOOD
    board[SIZE - 2][1] = SUPER_FOOD
    board[1][SIZE - 2] = SUPER_FOOD
    board[SIZE - 2][SIZE - 2] = SUPER_FOOD
    return board
}

function updateScore(diff) {
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
    if (gFoodCount <= gGame.score) {
        gameOver(true)
    }
}

function gameOver(isWin) {
    gGame.isOn = false
  
    clearInterval(gIntervalGhosts)
    clearInterval(gIntervalCherrys)
    document.querySelector(".modal").classList.toggle('hidden')
    if (isWin) {
        document.querySelector(".gameOverText").innerText = 'You Won!'
        playSound('media/pacman_eatfruit.wav')

    } else {
        document.querySelector(".gameOverText").innerText = 'You Lost...'
        playSound('media/pacman_death.wav')

    }

}

//my funcs:
function countFood(count) {
 
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
            if (gBoard[i][j] === FOOD)
                count++
        }
    }
    return count - 1
}

function resetGgame() {
    gGame.score = 0
    document.querySelector('h2 span').innerText = gGame.score
}


function createCherry(){
    var emptyCells = []
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
            if (gBoard[i][j] === EMPTY){
                emptyCells.push({i:i,j:j})
            }
        }
    }
    if(!emptyCells.length) return
    var emptyCell = emptyCells[getRandomIntInclusive(0,emptyCells.length-1)]
    gBoard[emptyCell.i][emptyCell.j] = CHERRY
    renderCell(emptyCell,CHERRY)
}

