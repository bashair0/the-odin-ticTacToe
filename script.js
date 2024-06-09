const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', '']

  const printFormattedBoard = () => {
    let formattedString = ''
    board.forEach((cell, index) => {
      formattedString += cell ? ` ${cell} |` : '   |'
      if ((index + 1) % 3 === 0) {
        formattedString = formattedString.slice(0, -1)
        if (index < 8)
          formattedString +=
            '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n'
      }
    })
    console.log('%c' + formattedString, 'color: #c11dd4;font-size:16px')
  }

  const markCell = (cellIndex, mark) => {
    if (board[cellIndex] === '') {
      board[cellIndex] = mark
      displayController.render()
      return true
    } else {
      return false
    }
  }

  const getAvailableMoves = () => {
    const moves = []
    board.forEach((cell, index) => {
      if (!cell) moves.push(index)
    })
    return moves
  }

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', '']
    displayController.render()
  }

  const getBoard = () => board

  const isFull = () => {
    return board.every(cell => cell)
  }

  const checkForWin = () => {
    //Checking Horizontal Wins
    if (board[0] === board[1] && board[0] === board[2] && board[0]) {
      return { winner: board[0], direction: 'H', row: 1 }
    }
    if (board[3] === board[4] && board[3] === board[5] && board[3]) {
      return { winner: board[3], direction: 'H', row: 2 }
    }
    if (board[6] === board[7] && board[6] === board[8] && board[6]) {
      return { winner: board[6], direction: 'H', row: 3 }
    }

    //Checking Vertical Wins
    if (board[0] === board[3] && board[0] === board[6] && board[0]) {
      return { winner: board[0], direction: 'V', column: 1 }
    }
    if (board[1] === board[4] && board[1] === board[7] && board[1]) {
      return { winner: board[1], direction: 'V', column: 2 }
    }
    if (board[2] === board[5] && board[2] === board[8] && board[2]) {
      return { winner: board[2], direction: 'V', column: 3 }
    }

    //Checking Diagonal Wins
    if (board[0] === board[4] && board[0] === board[8] && board[0]) {
      return { winner: board[0], direction: 'D', diagonal: 'main' }
    }
    if (board[2] === board[4] && board[2] === board[6] && board[2]) {
      return { winner: board[2], direction: 'D', diagonal: 'counter' }
    }

    return false
  }

  const checkForDraw = () => {
    if (isFull()) {
      return { winner: 'draw' }
    }
    return false
  }

  return {
    getBoard,
    markCell,
    resetBoard,
    printFormattedBoard,
    getAvailableMoves,
    checkForWin,
    checkForDraw
  }
})()

const createPlayer = (name, mark) => {
  return {
    name,
    mark
  }
}

const gameController = () => {
  let currentPlayer
  let players = []
  const computerName = 'Odin'

  const swapTurns = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
  }

  const getCurrentPlayer = () => currentPlayer

  const computerMove = () => {
    const availableMoves = gameBoard.getAvailableMoves()
    const randomMove = Math.floor(Math.random() * availableMoves.length)
    return availableMoves[randomMove]
  }

  const startGame = (playerName, playerMark, computerMark) => {
    gameBoard.resetBoard()
    players = [
      createPlayer(playerName, playerMark),
      createPlayer(computerName, computerMark)
    ]
    currentPlayer = players[0]
  }

  const playRound = index => {
    let cellIndex
    let move
    let endRound = false
    console.log(players)
    currentPlayer = players[0]
    while (!endRound) {
      getCurrentPlayer()
      if (gameBoard.checkForWin()) {
        console.log(gameBoard.checkForWin())
        endRound = true
        return
      } else if (gameBoard.checkForDraw()) {
        console.log(gameBoard.checkForDraw())
        endRound = true
        return
      } else {
        if (currentPlayer.name === computerName) {
          cellIndex = computerMove()
        } else {
          cellIndex = index
        }
        move = gameBoard.markCell(cellIndex, currentPlayer.mark)
        if (!move) return
        else {
          console.log(currentPlayer.name)
          swapTurns()
          gameBoard.printFormattedBoard()
        }
      }
    }
  }

  return {
    getCurrentPlayer,
    playRound,
    startGame
  }
}

const displayController = (() => {
  const cellElements = document.querySelectorAll('[data-cell]')
  const boardElement = document.querySelector('#board')
  const submitButton = document.querySelector('[data-start-btn]')
  const playerNameTextElement = document.querySelector('#player-name')
  const playerScoreTextElement = document.querySelector('#player-score')
  const computerNameTextElement = document.querySelector('#computer-name')
  const computerScoreTextElement = document.querySelector('#computer-score')
  const game = gameController()

  const render = () => {
    let board = gameBoard.getBoard()
    cellElements.forEach((cell, index) => {
      if (board[index] === 'x') {
        cell.classList.add('x')
      } else if (board[index] === 'o') {
        cell.classList.add('circle')
      } else {
        cell.textContent = board[index]
        cell.classList.remove('circle')
        cell.classList.remove('x')
      }
    })
  }

  const setBoardHoverState = className => {
    boardElement.classList.remove('x')
    boardElement.classList.remove('circle')
    boardElement.classList.add(className)
  }

  const startNewGame = e => {
    e.preventDefault()
    const playerName = document.querySelector('input[name="name"]').value
    playerNameTextElement.textContent = playerName
    const marks = document.querySelectorAll('input[name="mark"]')
    let playerMark
    let computerMark

    marks.forEach(mark => {
      if (!mark.checked) {
        computerMark = mark.value
      } else {
        playerMark = mark.value
      }
    })

    if (playerMark === 'o') {
      setBoardHoverState('circle')
    } else {
      setBoardHoverState('x')
    }

    game.startGame(playerName, playerMark, computerMark)

    const handleClick = e => {
      const cell = e.target.id
      game.playRound(cell)
    }

    cellElements.forEach(cell => {
      cell.addEventListener('click', handleClick, { once: true })
    })
  }

  submitButton.addEventListener('click', startNewGame)

  return {
    render,
    startNewGame
  }
})()
