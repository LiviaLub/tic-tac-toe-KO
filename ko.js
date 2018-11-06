function GridSquare(column, row) {
    this.state = ko.observable('__ ');
    this.row = row;
    this.column = column;
}


function GameBoard() {
    this.topRow     = ko.observableArray(
        [new GridSquare('leftColumn', 'topRow'),
            new GridSquare('middleColumn', 'topRow'),
            new GridSquare('rightColumn', 'topRow')]);

    this.middleRow  = ko.observableArray(
        [new GridSquare('leftColumn', 'middleRow'),
            new GridSquare('middleColumn', 'middleRow'),
            new GridSquare('rightColumn', 'middleRow')]);
    this.bottomRow  = ko.observableArray(
        [new GridSquare('leftColumn', 'bottomRow'),
            new GridSquare('middleColumn', 'bottomRow'),
            new GridSquare('rightColumn', 'bottomRow')]);

    this.moves = 0;


    this.state = ko.observable('xturn');

    this.turn = ko.computed( function() {
        var turn;
        var  state = this.state();

        switch ( state ) {
            case 'xturn':
                turn = 'x';
                break;
            case 'oturn':
                turn = 'o';
                break;
            default:
                turn = 'finished';
                break;
        }

        return turn;
    }, this);

    this.gameStatus = ko.computed( function() {
        var status;
        var state = this.state();

        switch ( state ) {

            case 'xwins':
                status = "X Wins!";
                break;
            case 'owins':
                status = "O Wins!";
                break;
            case 'tie':
                status = "It is a tie";
                break;
        }

        return status;
    }, this);
}


function Player(name) {
    this.name = name;
    this.squares = {
        topRow: [],
        middleRow: [],
        bottomRow: [],
        leftColumn: [],
        middleColumn: [],
        rightColumn: [],
        leftDiagonal: [],
        rightDiagonal: []
    };
}

var ViewModel = function() {
    var self = this;

    this.gameBoard = new GameBoard();

    this.playerX = new Player('x');
    this.playerO = new Player('o');

    this.currentPlayer = this.playerX;

    this.changeCurrentPlayer = function() {

        if (self.gameBoard.turn() == 'x'){
          self.currentPlayer = this.playerX
        }
        else{
          self.currentPlayer = this.playerO
        }
    };


    this.makeMove = function(gridSquare) {
        if ( gridSquare.state() == '__ '  && self.gameBoard.turn() !== 'finished' ) {
            self.gameBoard.moves += 1;
            gridSquare.state(self.gameBoard.turn());
            self.playGame(gridSquare);
            if( self.gameBoard.moves > 3) {
                self.checkWinner(gridSquare.row, gridSquare.column);
            }
            self.changeTurn(self.gameBoard.state());
            self.checkTie();
        }
    };


    this.playGame = function(gridSquare) {

            self.currentPlayer.squares[gridSquare.row].push(0);
            self.currentPlayer.squares[gridSquare.column].push(0);


            if ( gridSquare.row == "topRow" ) {
                if ( gridSquare.column == "leftColumn" ) {
                    self.currentPlayer.squares.leftDiagonal.push(0);
                } else if ( gridSquare.column == "rightColumn" ) {
                    self.currentPlayer.squares.rightDiagonal.push(0);
                }
            } else if ( gridSquare.row == "middleRow" &&
                    gridSquare.column == "middleColumn") {
                self.currentPlayer.squares.rightDiagonal.push(0);
                self.currentPlayer.squares.leftDiagonal.push(0);
            } else if ( gridSquare.row == "bottomRow") {
                if ( gridSquare.column == "leftColumn" ) {
                    self.currentPlayer.squares.rightDiagonal.push(0);
                } else if ( gridSquare.column == "rightColumn" ) {
                    self.currentPlayer.squares.leftDiagonal.push(0);
                }
            }
    };


    this.changeTurn  = function(currentState) {

        switch(currentState) {
            case 'xturn':
                self.gameBoard.state('oturn');
                break;
            case 'oturn':
                self.gameBoard.state('xturn');
                break;
        }
        self.changeCurrentPlayer();
    };


    this.checkWinner = function(row, column) {

        if ( row == 'topRow' &&
                ( column == 'leftColumn' || column == 'rightColumn' )) {
            self.checkDiagonal();
        } else if ( row == 'middleRow' &&
                ( column == 'middleColumn' )) {
            self.checkDiagonal();
        } else if ( row == 'bottomRow' &&
                ( column == 'leftColumn' || column == 'rightColumn' )) {
            self.checkDiagonal();
        }



        self.checkRow(row);
        self.checkColumn(column);
    };

    this.checkRow = function(row) {
        if ( self.currentPlayer.squares[row].length == 3 ) {
            self.gameBoard.state(self.currentPlayer.name + "wins");
        }
    };

    this.checkColumn = function(column) {
        if ( self.currentPlayer.squares[column].length == 3 ) {
            self.gameBoard.state(self.currentPlayer.name + "wins");
        }
    };

    this.checkDiagonal = function() {
        if ( self.currentPlayer.squares.leftDiagonal.length == 3 ) {
            self.gameBoard.state(self.currentPlayer.name + "wins");
        } else if ( self.currentPlayer.squares.rightDiagonal.length == 3 ) {
            self.gameBoard.state(self.currentPlayer.name + "wins");
        }
    };

    this.checkTie = function() {
        if ( self.gameBoard.moves == 9 &&
                !(self.gameBoard.state() =="xwins" ||
                self.gameBoard.state() == "owins")) {
            self.gameBoard.state('tie');
        }
    };
};

ko.applyBindings(new ViewModel());
