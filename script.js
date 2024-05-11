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

  const getBoard = () => board

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', '']
  }

  return {
    getBoard,
    markCell,
    resetBoard,
    printFormattedBoard,
    getAvailableMoves
  }
})()

const createPlayer = (name, mark) => {
  return {
    name,
    mark
  }
}
