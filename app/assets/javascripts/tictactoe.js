// Code your JavaScript / jQuery solution here

var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(function() {
  attachListeners()
});

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(clickedSquare) {
  var token = player();
  $(clickedSquare).text(token)
}

function setMessage(message) {
  $('#message').text(message)
}

function checkWinner() {
  var winner = false
  var board = {}

  $('td').text(function(index, square) {
    board[index] = square;
    debugger
  })


  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function doTurn(clickedSquare) {
  updateState(clickedSquare)
  turn++;
  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    saveGame();
    clearBoard();
    setMessage("Tie game.")
  }
}

function attachListeners() {
  $('td').click(function() {
    //debugger
    if ($.text(this) === "" && !checkWinner())

    doTurn(this)
  })

  $('#clear').click(function() {
    clearBoard();
  })

  $('#previous').click(function() {
    previousGames();
  })

  $('#save').click(function() {
    saveGame();
  })
}

function clearBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function previousGames() {
  $('#games').empty();
  $.get('/games', function(data) {
    if (data.data.length > 0) {
      data.data.forEach(makePreviousGameButton);
    }
  })

}

function makePreviousGameButton(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).click(function() {
    reloadGame(game.id);
  })
}

function reloadGame(gameID) {
  d
  $.get(`/games/${gameID}`, function(game) {
    let state = game.data.attributes.state;

    let id = game.data.id;
    let board = {}


    let index = 0;

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
      document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
      index++
      }
    }
    let turnCount = 0;
    for(var i = 0; i < state.length; i++) {
      if (state[i] !== "") {
        turnCount++;
      }
    }
    turn = turnCount;
    currentGame = id;
  })
}

function saveGame() {
  var state = [];

  $('td').text(function(index, square) {
    state.push(square);
  })


  var gameData = {state: state}

  if (currentGame) {
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: gameData
    })
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}
