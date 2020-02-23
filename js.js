

const gameboard = (()=>{
    
    //There are click events on board -> moves are saved in simple array board_copy
    let board =[];
    let board_copy=[0,1,2,3,4,5,6,7,8];

    document.getElementById("reset").style.display = "none";
    let friendEnemy = false;
    let normalAiEnemy = false;
    let hardAiEnemy = false;
    let startPlay=false;
    let moveOrder= true;
    let firstGame = false;

    function createBoard(friend, normalAi, hardAi){
        friendEnemy=false;
        normalAiEnemy=false;
        hardAiEnemy=false; 
        board=Array.from(document.querySelectorAll(".grid-item"));
        if (friend) {friendEnemy=true; alert ("You've started game against the friend");}
        if (normalAi) {normalAiEnemy=true; alert ("Your enemy is AI level: normal");}
        if (hardAi) {
            hardAiEnemy=true; 
            alert ("Your enemy is AI level: impossible!");
        }

        //is this first game? than start myMove- listeners
        if (!firstGame) {
            startPlay=true;
            myMove();  
        }
        else {startPlay=true}
    }
        
    //add eventlistener for each item in the grid and set firstgame=true,
    //than check if it's allowed for move (startPlay=true) 
    function myMove(){
        firstGame=true;
        board.forEach(function(elem,i) {
            elem.addEventListener("click", ()=> {
                if (startPlay==true && board_copy[i]!=="X" && board_copy[i]!=="O"){ 

                if (friendEnemy) {
                    if (moveOrder) allowedMove(elem,i,"X");
                    else { allowedMove(elem,i,"O") }
                }

                else if(normalAiEnemy){
                    allowedMove(elem,i,"X");
                    if(startPlay) normalAiPlay();
                    
                }

                else if (hardAiEnemy){
                    allowedMove(elem,i,"X");
                    if(startPlay) hardAiPlay();
                }

                }
                
            })
        })
    }

    //minimax (unbeatable) function is in the aiPlayer function
    function hardAiPlay(){
        let i = aiPlayer();
        //console.log(i);
        board[i].innerHTML="O"
        board_copy[i]="O";
        moveOrder=!moveOrder;
        game.playCheck(board_copy,"O",true);
        return
    }
    
    //generate random moves until the move is on free spot
    function normalAiPlay() {
        let i = Math.floor((Math.random()*(9)));

        if (board_copy[i]!=="X" && board_copy[i]!=="O"){
            //console.log(i); 
            board[i].innerHTML="O";
            board_copy[i]="O";
            moveOrder=!moveOrder;
            game.playCheck(board_copy,"O",true);
            return
        }
        else {
            normalAiPlay();
        }
    }

    //continuing of myMove function- after everything's been checked
    function allowedMove(elem,i,sign){
        elem.innerHTML=sign;
        board_copy[i]=sign;
        moveOrder=!moveOrder;
        game.playCheck(board_copy,sign,true)
        return
    }


    //set startPlay to false -> events in myMove stop working
    function stopPlay(){
        startPlay=false;
    }
    
    //reset button(click event function) -> create new board and
    // reset HTML in board and items in board_copy
    function clearBoard(){
        board=Array.from(document.querySelectorAll(".grid-item"));
        for (let i=0; i<9; i++){
                board[i].innerHTML="";
                board_copy[i]=i;
            }
        buttonHide(1);
        removeResetEvent();
        startPlay=false;
        
    }

    //appear reset button and add eventlistener
    function resetAppear(){
        let resetButton = document.getElementById("reset");
        resetButton.style.display="inline-block";
        resetButton.addEventListener("click", clearBoard);
        buttonHide(0);
    }

    //hide reset button (->default state) and remove its eventlistener
    function removeResetEvent(){
        let resetButton = document.getElementById("reset");
        resetButton.style.display="none";
        resetButton.removeEventListener("click", clearBoard)
    }

    //if true= display main buttons like "friend", "AI"..
    //if false= hide these buttons
    function buttonHide(status){
        let displayStatus="inline-block";
        if (!status) displayStatus="none";
        document.getElementById("friend").style.display = displayStatus;
        document.getElementById("ai_normal").style.display = displayStatus;
        document.getElementById("ai_hard").style.display = displayStatus;
        
    }

return {board, board_copy, createBoard, resetAppear, clearBoard, myMove, stopPlay};
})();


const game = (()=>{
    
    //starts on page load
    function actionListener() {
        document.addEventListener("click",(event)=> {
            if (event.target.getAttribute("id")=="friend") {
                gameboard.createBoard(true, false, false);
                gameboard.resetAppear();
            }
            if (event.target.getAttribute("id")=="ai_normal") {
                gameboard.createBoard(false, true, false);
                gameboard.resetAppear();

            }
            if (event.target.getAttribute("id")=="ai_hard") {
                gameboard.createBoard(false, false, true);
                gameboard.resetAppear();

            }
         
        });
    }

    //function to check and alert the end of the game: controlled is board_copy, signs (O or X)->
    //phase (true) is for checking if the game has ended, phase (false) is for recursive minimax function
    //(unbeatable AI)
    function playCheck(board,sign,phase) {
        if (
            (board[0]==sign && board[3]==sign && board[6]==sign) || (board[0]==sign && board[1]==sign && board[2]==sign) ||
            (board[0]==sign && board[4]==sign && board[8]==sign) || (board[1]==sign && board[4]==sign && board[7]==sign) ||
            (board[2]==sign && board[5]==sign && board[8]==sign) || (board[2]==sign && board[4]==sign && board[6]==sign) ||
            (board[6]==sign && board[7]==sign && board[8]==sign) || (board[3]==sign && board[4]==sign && board[5]==sign) 
            ) {
                if (phase){ 
                alert(`Player with sign: ${sign} have won!`);
                gameboard.stopPlay();
                return;
                } else {
                    return true;
                }
                
            } //TOE
        else if ( phase==true && board[0]!==0 && board[1]!==1 && board[2]!==2 && board[3]!==3 && board[4]!==4 &&
                  board[5]!==5 && board[6]!==6 && board[7]!==7 && board[8]!==8) {
                      alert ("Its TOE!");
                      gameboard.stopPlay();
                      return;
                  }
        else if (!phase) return false;
    }

return {actionListener, playCheck};
})();

//I have copy pasted this function and slightly modified for purposes in my tic tac toe game
function aiPlayer() {

    let aiPlayer = "O";
    let huPlayer = "X";

    function emptyIndexies(board) {
        return board.filter(s => s != "O" && s != "X");
    }

    let fc = 0;
    let bestSpot = minimax(gameboard.board_copy, aiPlayer);

    function minimax(newBoard, player) {
        fc++;
        let availSpots = emptyIndexies(newBoard);

        if (game.playCheck(newBoard, huPlayer, false)) {
            return { score: -10 };
        }
        else if (game.playCheck(newBoard, aiPlayer, false)) {
            return { score: 10 };
        }
        else if (availSpots.length === 0) {
            return { score: 0 };
        }

        let moves = [];

        for (let i = 0; i < availSpots.length; i++) {
            let move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;

            //if collect the score resulted from calling minimax on the opponent of the current player
            if (player == aiPlayer) {
                let result = minimax(newBoard, huPlayer);
                move.score = result.score;
            }
            else {
                let result = minimax(newBoard, aiPlayer);
                move.score = result.score;
            }

            //reset the spot to empty
            newBoard[availSpots[i]] = move.index;

            // push the object to the array
            moves.push(move);
        }

        // if it is the computer's turn loop over the moves and choose the move with the highest score
        let bestMove;
        if (player === aiPlayer) {
            // var bestScore = -10000;
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {

            // else loop over the moves and choose the move with the lowest score
            let bestScore = Infinity;
            // var bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        // return the chosen move (object) from the array to the higher depth
        return moves[bestMove];
    }
    return bestSpot.index;
};

game.actionListener();
