'use strict'

var PACMAN = `<img className="pacmanPic" src="media/pacman-right.png" alt="">`;
var gPacman;
var gDeadGhosts = []
var isSoundPlayed = false
function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {

    if (!gGame.isOn) return
    // console.log('ev', ev);
    const nextLocation = getNextLocation(ev)

    if (!nextLocation) return
    // console.log('nextLocation', nextLocation)

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('NEXT CELL', nextCell)

    if (nextCell === WALL) return
    if (nextCell === FOOD) {
        if (!isSoundPlayed) {  
            console.log('wa');     
            var audio = new Audio('media/pacman_chomp.wav');
            audio.play();
            isSoundPlayed = true
            setTimeout(function(){
                isSoundPlayed = false
            } ,575)
        }
        updateScore(1)
    }
    if (nextCell === CHERRY) {
        updateScore(10)
        playSound('media/pacman_eatfruit.wav')
    }
    if (nextCell === GHOST) {
        if (!gPacman.isSuper) {
            gameOver(false)
            renderCell(gPacman.location, EMPTY)
            return
        } else {
            playSound('media/pacman_eatghost.wav')
            eatGhost(nextLocation)
        }

    } else if (nextCell === SUPER_FOOD) {
        if (!gPacman.isSuper) onSuperFood()
        else return
    }

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

    // update the DOM
    renderCell(gPacman.location, EMPTY)

    // update the model
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN

    // update the DOM
    renderCell(gPacman.location, PACMAN)
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--;
            PACMAN = `<img className="pacmanPic" src="media/pacman-up.png" alt="">`
            break;
        case 'ArrowDown':
            nextLocation.i++;
            PACMAN = `<img className="pacmanPic" src="media/pacman-down.png" alt="">`
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            PACMAN = `<img className="pacmanPic" src="media/pacman-left.png" alt="">`
            break;
        case 'ArrowRight':
            nextLocation.j++;
            PACMAN = `<img className="pacmanPic" src="media/pacman-right.png" alt="">`
            break;
        default:
            return null;
    }
    return nextLocation;
}


function onSuperFood() {
    playSound('media/pacman_ringtone.mp3')
    gPacman.isSuper = true

    for (var i = 0; i < gGhosts.length; i++) {
        gGhosts[i].currColor = 'blue'
        //in case ghost hit wall.
        document.querySelector(`.cell-${gGhosts[i].location.i}-${gGhosts[i].location.j}`).style.color = 'blue'
    }
    setTimeout(offSuperFood, 5000)
}


function offSuperFood() {
    gPacman.isSuper = false
 
    while (gDeadGhosts.length) {
        gGhosts.push(gDeadGhosts[0])
        gDeadGhosts.shift()
    }
    for (var i = 0; i < gGhosts.length; i++) {
        gGhosts[i].currColor = gGhosts[i].originColor
        document.querySelector(`.cell-${gGhosts[i].location.i}-${gGhosts[i].location.j}`).style.color = gGhosts[i].originColor
    }
}


function eatGhost(nextLocation) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === nextLocation.i && gGhosts[i].location.j === nextLocation.j) {
            gDeadGhosts.push(gGhosts.splice(i, 1)[0])
            break;
        }
    }
}