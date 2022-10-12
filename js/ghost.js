'use strict'

const GHOST = '&#9781;'

var gGhosts = []
var gIntervalGhosts

function createGhost(board) {
    var randColor = getRandomColor()
    const ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        originColor: randColor,
        currColor: randColor
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
}

function createGhosts(board) {
    gGhosts = []
    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    const moveDiff = getMoveDiff();
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    if (nextCell === PACMAN) {
        if (!gPacman.isSuper) {
            gameOver(false)
            return
        }
        else {
            playSound('media/pacman_eatghost.wav')
            hitWhileSuperFood(ghost)
            renderCell(ghost.location, EMPTY)
            return 
        }
    }


    // model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // DOM
    renderCell(ghost.location, ghost.currCellContent)
    document.querySelector(`.cell-${ghost.location.i}-${ghost.location.j}`).style.color = 'white'

    // model
    ghost.location = nextLocation
    ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j]
    gBoard[ghost.location.i][ghost.location.j] = GHOST
    document.querySelector(`.cell-${ghost.location.i}-${ghost.location.j}`).style.color = ghost.currColor


    // DOM
    renderCell(ghost.location, getGhostHTML(ghost))

}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    return `<span>${GHOST}</span>`
}

function hitWhileSuperFood(ghost){
    for(var i = 0; i < gGhosts.length; i++){
        if(gGhosts[i] === ghost){
            gDeadGhosts.push(gGhosts.splice(i,1)[0])
            break;
        }
    }
}