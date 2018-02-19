/*
	This file is part of probreversi. See
	<https://github.com/epsdel1994/probreversi> for detail.
*/

"use strict";

var pbr-gui = {};

pbr-gui.setup = function(fwcyan){

    fwcyan.setColor(0);

    JSprinL.history = [];

    JSprinL.reversi_game = fwcyan.plugin.JSprinCore.ReversiGame.create();
    JSprinL.reversi_game.change = function(){
        JSprinL.button_undo.setScore(this.canundo() ? 1 : 0);
        JSprinL.button_redo.setScore(this.canredo() ? 1 : 0);
        JSprinL.button_branch.setScore(this._enabled ? 1 : 0);
        JSprinL.button_trunk.setScore((this._enabled === false) ? 0 :
            (JSprinL.history.length !== 0) ? 1 : 0);
        JSprinL.button_edit.setScore(this._enabled ? 1 : 0);
        JSprinL.reversi_status.update(this._turn, this._board);
    };
    JSprinL.button_undo = fwcyan.Button.create("<", 1);
    JSprinL.button_undo.select = function(){
        JSprinL.reversi_game.undo();
    };
    JSprinL.button_redo = fwcyan.Button.create(">", 1);
    JSprinL.button_redo.select = function(){
        JSprinL.reversi_game.redo();
    };
    JSprinL.button_branch = fwcyan.Button.create("Branch(0)", 1);
    JSprinL.button_branch.select = function(){
        JSprinL.history.push(JSprinL.reversi_game.getHistory());
        JSprinL.button_branch.setString("Branch(" + 
            JSprinL.history.length + ")");
        JSprinL.button_trunk.setScore(
            (JSprinL.history.length !== 0) ? 1 : 0);
    };
    JSprinL.button_trunk = fwcyan.Button.create("Trunk", 1);
    JSprinL.button_trunk.select = function(){
        JSprinL.reversi_game.setHistory(JSprinL.history.pop());
        JSprinL.button_branch.setString("Branch(" + 
            JSprinL.history.length + ")");
        JSprinL.button_trunk.setScore(
            (JSprinL.history.length !== 0) ? 1 : 0);
    };
    JSprinL.button_edit = fwcyan.Button.create("Edit", 1);
    JSprinL.button_edit.select = function(){
        var board = JSprinL.reversi_game.getBoard();
        JSprinL.reversi_edit_board.setBoard(board.slice(0,64));
        if(board.charAt(65) === "X"){
            JSprinL.edit_turnToggle.setItem(
                JSprinL.edit_turnToggle_Black);
        } else if(board.charAt(65) === "O"){
            JSprinL.edit_turnToggle.setItem(
                JSprinL.edit_turnToggle_White);
        } else if(board.charAt(65) === "-"){
            JSprinL.edit_turnToggle.setItem(
                JSprinL.edit_turnToggle_Black);
        }
        JSprinL.edit_putToggle.setItem(JSprinL.edit_putToggle_Black);
        JSprinL.popup_edit.open();
    };
    JSprinL.reversi_status = fwcyan.plugin.JSprinCore.ReversiStatus.create();
    JSprinL.button_about = fwcyan.Button.create("About");
    JSprinL.button_about.select = function(){
        window.open("http://epsdel.com/e27ijunl/about.html");
    };
    fwcyan.setMain(fwcyan.Popup.create(fwcyan.Template1.create([
        JSprinL.reversi_game,
        JSprinL.button_undo,
        JSprinL.button_redo,
        JSprinL.button_branch,
        JSprinL.button_trunk,
        JSprinL.button_edit,
        fwcyan.Button.create("", 0),
        JSprinL.reversi_status,
        JSprinL.button_about,
    ])));

    JSprinL.reversi_edit_board
        = fwcyan.plugin.JSprinCore.ReversiBoard.create();
    JSprinL.reversi_edit_board.pointCell = function(e){
        this.setCell(e.x, e.y, JSprinL.edit_putColor);
        this._update();
    };
    JSprinL.reversi_edit_board.movepointCell = function(e){
        this.setCell(e.x, e.y, JSprinL.edit_putColor);
        this._update();
    };
    JSprinL.edit_putToggle_Black = fwcyan.plugin.JSprinCore.ReversiDisk.create(
        JSprinL.reversi_edit_board.color.Black);
    JSprinL.edit_putToggle_White = fwcyan.plugin.JSprinCore.ReversiDisk.create(
        JSprinL.reversi_edit_board.color.White);
    JSprinL.edit_putToggle_Empty = fwcyan.plugin.JSprinCore.ReversiDisk.create(
        JSprinL.reversi_edit_board.color.Empty);
    JSprinL.edit_putToggle = fwcyan.ButtonToggle.create("Put color", [
        JSprinL.edit_putToggle_Black,
        JSprinL.edit_putToggle_White,
        JSprinL.edit_putToggle_Empty,
    ]);
    JSprinL.edit_putToggle.change = function(){
        JSprinL.edit_putColor = this._item._value;
    };
    JSprinL.edit_turnToggle_Black = fwcyan.plugin.JSprinCore.ReversiDisk.create(
        JSprinL.reversi_edit_board.color.Black);
    JSprinL.edit_turnToggle_White = fwcyan.plugin.JSprinCore.ReversiDisk.create(
        JSprinL.reversi_edit_board.color.White);
    JSprinL.edit_turnToggle = fwcyan.ButtonToggle.create("Turn", [
        JSprinL.edit_turnToggle_Black,
        JSprinL.edit_turnToggle_White,
    ]);
    JSprinL.edit_turnToggle.change = function(){
        JSprinL.edit_turnColor = this._item._value;
    };
    JSprinL.edit_apply = fwcyan.Button.create("Apply", 2);
    JSprinL.edit_apply.select = function(){
        var board = JSprinL.reversi_edit_board.getBoard();
        board = board.concat("t");
        if( JSprinL.edit_turnColor
            === JSprinL.reversi_edit_board.color.Black ){
            board = board.concat("X");
        } else if( JSprinL.edit_turnColor
            === JSprinL.reversi_edit_board.color.White ){
            board = board.concat("O");
        }
        JSprinL.reversi_game.setBoard(board);
        JSprinL.popup_edit.close();
    };
    JSprinL.edit_close = fwcyan.Button.create("Back", -1);
    JSprinL.edit_close.select = function(){
        JSprinL.popup_edit.close();
    }; 
    JSprinL.edit_putColor = JSprinL.reversi_edit_board.color.Black;
    JSprinL.edit_turnColor = JSprinL.reversi_edit_board.color.Black;
    JSprinL.popup_edit = fwcyan.Popup.create(fwcyan.Template1.create([
        JSprinL.reversi_edit_board,
        fwcyan.Button.create("", 0),
        fwcyan.Button.create("", 0),
        fwcyan.Button.create("", 0),
        fwcyan.Button.create("", 0),
        JSprinL.edit_putToggle,
        JSprinL.edit_turnToggle,
        JSprinL.edit_apply,
        JSprinL.edit_close,
    ]));

    fwcyan.setPopups([ JSprinL.popup_edit, ]);

    JSprinL.query_string = location.search;
    JSprinL.params = JSprinL.query_string.slice(1).split("&");
    JSprinL.num_params = JSprinL.params.length;
    for(var i=0; i<JSprinL.num_params; i++){
        var key_value = JSprinL.params[i].split("=");
        if(key_value.length !== 2){
            continue;
        }
        if(key_value[0] === "history"){
            JSprinL.initialHistory = key_value[1];
        } else if(key_value[0] === "pos"){
            JSprinL.initialHistoryPos = key_value[1];
        } else {
            continue;
        }
    }
    if(JSprinL.initialHistory !== undefined){
        if(false === JSprinL.reversi_game.setHistoryString(
            JSprinL.initialHistory
        )){
            alert("Failed to parse history.");
        } else {
            JSprinL.reversi_game.undoall();
            for(var i=0; i<JSprinL.initialHistoryPos; i++){
                JSprinL.reversi_game.redo();
            }
        }
    }

    JSprinL.reversi_game.change();
};

kurumicl.onload = function(canvas){
    pbr-gui.fwcyan = FWcyan(canvas, [ProbReversi]);
    pbr-gui.setup(JSprinL.fwcyan);
};
kurumicl.onresize = function(){
    pbr-gui.fwcyan.resize();
    pbr-gui.fwcyan.draw();
};
