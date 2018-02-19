/*
	This file is part of probreversi. See
	<https://github.com/epsdel1994/probreversi> for detail.
*/

"use strict";

var JSprinCore = function(fwcyan){

    fwcyan.plugin.JSprinCore = {};

    fwcyan.plugin.JSprinCore.ReversiBoard = Object.create(Object.prototype);
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype
        = Object.create(fwcyan.Element.prototype);
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.getCell = function(x, y){
        return this._cell[x][y];
    }
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.setCell = function(x, y, color){
        this._cell[x][y] = color;
        this._resetCellValues();
    };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype._resetCellValues = function(){
        this._valuesCell = null;
        this._valueMaxCell = null;
    };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.getEnabled = function(){
        return this._enabled;
    }
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.setEnabled = function(flag){
        this._enabled = flag;
        this._update();
    };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.setCellValues
        = function(values){
        this._valuesCell = values;
        this._update();
    };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.setMaxCell
        = function(x, y){
        this._valueMaxCell = { x: x, y: y, };
        this._update();
    }
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.getBoard = function(){
        var board = "";
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                if( this._cell[j][i] === this.color.Black ){
                    board = board.concat("X");
                } else if( this._cell[j][i] === this.color.White ){
                    board = board.concat("O");
                } else if( this._cell[j][i] === this.color.Empty ){
                    board = board.concat("-");
                } else if( this._cell[j][i] === this.color.None ){
                    board = board.concat("=");
                } else {
                }
            }
        }
        return board;
    };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.setBoard = function(board){
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                var c = board.charAt(i*8+j);
                if( c === "X" ){
                    this._cell[j][i] = this.color.Black;
                } else if( c === "O" ){
                    this._cell[j][i] = this.color.White;
                } else if( c === "-" ){
                    this._cell[j][i] = this.color.Empty;
                } else if( c === "=" ){
                    this._cell[j][i] = this.color.None;
                } else {
                    return false;
                }
            }
        }
        this._resetCellValues();
        this._update();
        return true;
    };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.pointCell = function(e){ };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.point = function(e){
        if( this._enabled === false ){ return false; }
        var x, y;
        for(var i=0; i<8; i++){
            if( e.pos.x <= e.rect.x + e.rect.width*(i+1)/8 ){ x = i; break; };
        }
        for(var i=0; i<8; i++){
            if( e.pos.y <= e.rect.y + e.rect.height*(i+1)/8 ){ y = i; break; };
        }
        this.pointCell({x: x, y: y,});
    };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.movepointCell = function(e){ };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.movepoint = function(e){
        if( this._enabled === false ){ return false; }
        var x, y;
        for(var i=0; i<8; i++){
            if( e.pos.x <= e.rect.x + e.rect.width*(i+1)/8 ){ x = i; break; };
        }
        for(var i=0; i<8; i++){
            if( e.pos.y <= e.rect.y + e.rect.height*(i+1)/8 ){ y = i; break; };
        }
        this.movepointCell({x: x, y: y,});
    };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.draw = function(){
        this._drawer.ctx.strokeStyle = "rgb(0,0,0)";
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                if ( this._cell[i][j] === this.color.None) {
                    this._drawer.ctx.fillStyle = "rgb(255,255,255)";
                    this._drawer.ctx.fillRect(
                        this._drawer.rect.x + (this._drawer.rect.width/8)*i,
                        this._drawer.rect.y + (this._drawer.rect.height/8)*j,
                        this._drawer.rect.width/8, this._drawer.rect.height/8
                    );
                    this._drawer.ctx.strokeRect(
                        this._drawer.rect.x + (this._drawer.rect.width/8)*i,
                        this._drawer.rect.y + (this._drawer.rect.height/8)*j,
                        this._drawer.rect.width/8, this._drawer.rect.height/8
                    );
                } else {
                    if( this._enabled === false ){
                        this._drawer.ctx.fillStyle = this._drawer.color.disable;
                    } else {
                        this._drawer.ctx.fillStyle = this._drawer.color.enable;
                    }
                    this._drawer.ctx.fillRect(
                        this._drawer.rect.x + (this._drawer.rect.width/8)*i,
                        this._drawer.rect.y + (this._drawer.rect.height/8)*j,
                        this._drawer.rect.width/8, this._drawer.rect.height/8
                    );
                    this._drawer.ctx.strokeRect(
                        this._drawer.rect.x + (this._drawer.rect.width/8)*i,
                        this._drawer.rect.y + (this._drawer.rect.height/8)*j,
                        this._drawer.rect.width/8, this._drawer.rect.height/8
                    );
                    if( this._cell[i][j] === this.color.Empty) {
                        if((this._valueMaxCell !== null)
                            &&(this._valueMaxCell.x === i)
                            &&(this._valueMaxCell.y === j)
                        ) {
                            this._drawer.ctx.strokeRect(
                                this._drawer.rect.x + (this._drawer.rect.width/8)*i
                                    + this._drawer.rect.width * 0.125 * 0.1,
                                this._drawer.rect.y + (this._drawer.rect.height/8)*j
                                    + this._drawer.rect.height * 0.125 * 0.1,
                                this._drawer.rect.width * 0.125 * 0.8 ,
                                this._drawer.rect.height * 0.125 * 0.8
                            );
                        }
                        continue;
                    } else if ( this._cell[i][j] === this.color.Black) {
                        this._drawer.ctx.fillStyle = "rgb(0,0,0)";
                    } else if ( this._cell[i][j] === this.color.White) {
                        this._drawer.ctx.fillStyle = "rgb(255,255,255)";
                    }
                    this._drawer.ctx.beginPath();
                    this._drawer.ctx.arc(
                        this._drawer.rect.x + (this._drawer.rect.width/8)*(i+0.5),
                        this._drawer.rect.y + (this._drawer.rect.height/8)*(j+0.5),
                        this._drawer.rect.width*0.45*0.125, 0, Math.PI*2, false);
                    this._drawer.ctx.fill();
                    this._drawer.ctx.stroke();
                }
            }
            if( this._valuesCell !== null ){
                this._drawer.ctx.fillStyle = "rgb(0,0,0)";
                this._drawer.ctx.font
                    = (this._drawer.rect.width*0.125*0.5) +"px sans-serif";
                this._drawer.ctx.textAlign = "center";
                this._drawer.ctx.textBaseline = "middle";
                var l = this._valuesCell.length;
                for(var k=0; k<l; k++){
                    var sig = "";
                    if(this._valuesCell[k].value > 0){ sig = "+"; }
                    this._drawer.ctx.fillText(sig + this._valuesCell[k].value,
                        this._drawer.rect.x + (this._drawer.rect.width/8)
                            *(this._valuesCell[k].x+0.5),
                        this._drawer.rect.y + (this._drawer.rect.height/8)
                            *(this._valuesCell[k].y+0.5),
                        this._drawer.rect.width*0.125);
                };
            }
        }
    };
    fwcyan.plugin.JSprinCore.ReversiBoard.prototype.color = {
        Black: 0, White: 1, Empty: 2, None: 3,
    };
    fwcyan.plugin.JSprinCore.ReversiBoard.create = function(proto){
        proto = proto || fwcyan.plugin.JSprinCore.ReversiBoard.prototype;
        var ob = fwcyan.Element.create(proto);
        ob._cell = [
            [ ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty,
            ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty, ],
            [ ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty,
            ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty, ],
            [ ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty,
            ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty, ],
            [ ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty,
            ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty, ],
            [ ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty,
            ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty, ],
            [ ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty,
            ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty, ],
            [ ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty,
            ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty, ],
            [ ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty,
            ob.color.Empty, ob.color.Empty, ob.color.Empty, ob.color.Empty, ],
        ];
        ob._valuesCell = null;
        ob._valueMaxCell = null;
        ob._enabled = true;
        return ob;
    };

    fwcyan.plugin.JSprinCore.ReversiGame = Object.create(Object.prototype);
    fwcyan.plugin.JSprinCore.ReversiGame.prototype
        = Object.create(fwcyan.Element.prototype);
    fwcyan.plugin.JSprinCore.ReversiGame.create = function(board, proto){
        proto = proto || fwcyan.plugin.JSprinCore.ReversiGame.prototype;
        var og = fwcyan.Element.create(proto);
        og._board = fwcyan.plugin.JSprinCore.ReversiBoard.create();
        og._board.pointCell = function(e){ og._move(e.x, e.y); };
        og._board.movepointCell = function(e){ };
        og._reset(board);
        og._enabled = true;
        return og;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.isGameOver = function(){
        return (this._turn === this._board.color.Empty);
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.getEnabled = function(){
        return this._board.getEnabled();
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.setEnabled = function(flag){
        this._board.setEnabled(flag);
        this._enabled = flag;
        this._update();
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.setCellValues
        = function(values){
        this._board.setCellValues(values);
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.setMaxCell
        = function(x, y){
        this._board.setMaxCell(x, y);
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.getBoard = function(){
        var board = this._board.getBoard();
        board = board.concat("t");
        if( this._turn === this._board.color.Black){
            board = board.concat("X");
        } else if( this._turn === this._board.color.White){
            board = board.concat("O");
        } else if( this._turn === this._board.color.Empty){
            board = board.concat("-");
        }
        return board;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.setBoard = function(board){
        if( this._restore(board) === true ){
            this._history_update();
            this._update();
            return true;
        } else return false;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.change = function(e){ };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.point = function(e){
        this._board.point(e);
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.movepoint = function(e){
        this._board.movepoint(e);
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.disable = function(e){
        this._drawer = null;
        this._board.disable();
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.resize = function(e){
        this._drawer = e;
        this._board.resize(e);
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.draw = function(e){
        this._board.draw(e);
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.init = function(board){
        this._reset(board);
        this._update();
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._reset = function(board){
        board = board ||
            "---------------------------OX------XO---------------------------tX";
        this._history = [board];
        this._history_str = [""];
        if( this._restore(board) === false ){ this._restore(
            "---------------------------OX------XO---------------------------tX"
        ); }
        this._history_pos = 0;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.canundo = function(){
        return (this._enabled === true) && (this._history_pos > 0);
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.undoall = function(){
        this._history_pos = 0;
        this._restore(this._history[this._history_pos]);
        this._update();
        return true;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.undo = function(){
        if( this._history_pos === 0){ return false; }
        this._history_pos = this._history_pos -1;
        this._restore(this._history[this._history_pos]);
        this._update();
        return true;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.canredo = function(){
        return (this._enabled === true) && (this._history_pos < this._history.length-1);
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.redoall = function(){
        this._history_pos = this._history.length-1;
        this._restore(this._history[this._history_pos]);
        this._update();
        return true;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.redo = function(){
        if( this._history_pos === this._history.length-1 ){ return false; }
        this._history_pos = this._history_pos +1;
        this._restore(this._history[this._history_pos]);
        this._update();
        return true;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._canmove_rec
        = function(x, y, i, j, disk_p, disk_o){
        if( (x+i<0) || (7<x+i) || (y+j<0) || (7<y+j) ){
            return false;
        }
        if(this._board.getCell(x+i, y+j) === disk_p){
            return true;
        } else if(this._board.getCell(x+i, y+j) === disk_o){
            return this._canmove_rec(x+i, y+j, i, j, disk_p, disk_o);
        } else if(this._board.getCell(x+i, y+j) === this._board.color.Empty){
            return false;
        }
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._canmove = function(x, y){
        if( this._board.getCell(x, y) !== this._board.color.Empty ){
            return false;
        }
        if(
            (this._turn !== this._board.color.Black)
            && (this._turn !== this._board.color.White)
        ){
            return false;
        }

        var disk_p, disk_o;
        disk_p = this._turn;
        if( disk_p === this._board.color.Black ){
            disk_o = this._board.color.White;
        } else if( disk_p === this._board.color.White ){
            disk_o = this._board.color.Black;
        } else {
            return false;
        }

        for(var i=-1; i<=1; i++){
            for(var j=-1; j<=1; j++){
                if( (i===0)&&(j===0) ){ continue; }
                if(
                    (0<=x+i) && (x+i<=7) && (0<=y+j) && (y+j<=7)
                    && (this._board.getCell(x+i, y+j) === disk_o)
                    && (this._canmove_rec(x+i, y+j, i, j, disk_p, disk_o) === true) ){
                    return true;
                }
            }
        }

        return false;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._move_rec
        = function(x, y, i, j, disk_p, disk_o){
        if( (x+i<0) || (7<x+i) || (y+j<0) || (7<y+j) ){
            return false;
        }
        if(this._board.getCell(x+i, y+j) === disk_p){
            this._board.setCell(x, y, disk_p);
            return true;
        } else if(this._board.getCell(x+i, y+j) === disk_o){
            if(this._move_rec(x+i, y+j, i, j, disk_p, disk_o) === true){
                this._board.setCell(x, y, disk_p);
                return true;
            } else return false;
        } else if(this._board.getCell(x+i, y+j) === this._board.color.Empty){
            return false;
        }
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._isPass = function(){
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                if( this._canmove(i,j) === true ){ return false; }
            }
        }
        return true;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._move = function(x, y){
        if( this._board.getCell(x, y) !== this._board.color.Empty ){
            return false;
        }
        if(
            (this._turn !== this._board.color.Black)
            && (this._turn !== this._board.color.White)
        ){
            return false;
        }

        var disk_p, disk_o;
        disk_p = this._turn;
        if( disk_p === this._board.color.Black ){
            disk_o = this._board.color.White;
        } else if( disk_p === this._board.color.White ){
            disk_o = this._board.color.Black;
        } else {
            return false;
        }

        var res = false;
        for(var i=-1; i<=1; i++){
            for(var j=-1; j<=1; j++){
                if( (i===0)&&(j===0) ){ continue; }
                if(
                    (0<=x+i) && (x+i<=7) && (0<=y+j) && (y+j<=7)
                    && (this._board.getCell(x+i, y+j) === disk_o)
                    && (this._move_rec(x+i, y+j, i, j, disk_p, disk_o) === true)
                ){
                    this._board.setCell(x, y, disk_p);
                    res = true;
                }
            }
        }

        if( res === true ){
            this._turn = disk_o;
            this._update_turn();
            this._history_update(x, y);
            this._board._resetCellValues();
            this._update();
            return true;
        } else return false;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._update_turn = function(){
        var disk_p, disk_o;
        if( this._turn === this._board.color.Black ){
            disk_p = this._board.color.Black;
            disk_o = this._board.color.White;
        } else if( this._turn === this._board.color.White ){
            disk_p = this._board.color.White;
            disk_o = this._board.color.Black;
        }
        if( this._isPass() === true ){
            this._turn = disk_o;
            if( this._isPass() === true ){
                this._turn = this._board.color.Empty;
            }
        }
    }
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._getStringMove
        = function(board, str){
        if( str.length < 2){ return false; }
        var xchar = str.charAt(0);
        var ychar = str.charAt(1);
        var x, y;

        if( (xchar === "a") || (xchar === "A") ){ x = 0;
        } else if( (xchar === "b") || (xchar === "B") ){ x = 1;
        } else if( (xchar === "c") || (xchar === "C") ){ x = 2;
        } else if( (xchar === "d") || (xchar === "D") ){ x = 3;
        } else if( (xchar === "e") || (xchar === "E") ){ x = 4;
        } else if( (xchar === "f") || (xchar === "F") ){ x = 5;
        } else if( (xchar === "g") || (xchar === "G") ){ x = 6;
        } else if( (xchar === "h") || (xchar === "H") ){ x = 7;
        } else if( (xchar === "z") ){
            var board_after = board;
            str = str.slice(1);
            while( str.charAt(0) !== "z" ){
                if( str.charAt(0) === "t" ){
                    if( str.length < 2 ){ return false; }
                    board = board.slice(0,65)
                        .concat(str.charAt(1))
                        .concat(board.slice(66));
                    str = str.slice(2);
                    continue;
                }
                var e = this._getStringMove(board, str);
                if( (e === false) || (e.isFree === true) ){ return false; }
                else {
                    if( e.str === "" ) return false;
                    if( (e.str.charAt(0) === "X" )
                        || ( e.str.charAt(0) === "O" )
                        || ( e.str.charAt(0) === "-" )
                        || ( e.str.charAt(0) === "=" )
                    ) {
                        board = board.slice(0,e.x+e.y*8)
                            .concat(e.str.charAt(0))
                            .concat(board.slice(e.x+e.y*8+1));
                    }
                }
                str = e.str.slice(1);
            }
            return { isFree: true, board: board, str: str.slice(1) };
        } else if( (xchar === "Z") ){
            if( (str.length > 67) && (str.charAt(67) === "Z") ){
                return { isFree: true, board:str.slice(1,67), str: str.slice(68), };
            } else return false;
        } else return false;

        if(ychar === "1"){ y = 0;
        } else if(ychar === "2"){ y = 1;
        } else if(ychar === "3"){ y = 2;
        } else if(ychar === "4"){ y = 3;
        } else if(ychar === "5"){ y = 4;
        } else if(ychar === "6"){ y = 5;
        } else if(ychar === "7"){ y = 6;
        } else if(ychar === "8"){ y = 7;
        } else return false;

        return { isFree: false, x: x, y: y, str: str.slice(2), };
    };

    fwcyan.plugin.JSprinCore.ReversiGame.prototype._getCellString = function(x, y){
        var string = "";
        var xchars = "abcdefgh"
        var ychars = "12345678"
        string = string.concat(xchars.charAt(x)).concat(ychars.charAt(y));
        return string;
    }
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._getEditString
        = function(b1, b2){
        if( (b1.length !== 66 ) || (b2.length !== 66) ){ return false; }
        var cs = [];
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                if( b1.charAt(i+j*8) !== b2.charAt(i+j*8)){
                    cs.push({ turn: false, x: i, y: j, char: b2.charAt(i+j*8), });
                }
            }
        }
        if(b1.charAt(65) !== b2.charAt(65)){
            cs.push({ turn: true, char: b2.charAt(65), });
        }
        var l = cs.length;
        if(l < 23){
            var histstr = "z";
            for(var i=0; i<l; i++){
                if( cs[i].turn === false ){
                    histstr = histstr
                        + this._getCellString(cs[i].x, cs[i].y)
                        + cs[i].char;
                } else {
                    histstr = histstr + "t" + cs[i].char;
                }
            }
            histstr = histstr.concat("z");
            return histstr;
        } else {
            return "Z".concat(b2).concat("Z");
        }
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._history_update = function(x, y){
        if( this._history.length-1 !== this._history_pos ){
            this._history = this._history.slice(0, this._history_pos+1);
            this._history_str = this._history_str.slice(0, this._history_pos+1);
        } 
        this._history.push(this.getBoard());
        if( x === undefined ){
            this._history_str.push(this._getEditString(
                this._history[this._history_pos], this.getBoard()
            ) );
        } else {
            this._history_str.push(this._getCellString(x, y));
        }
        this._history_pos = this._history_pos +1;
        return true;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype._restore = function(board){
        if( this._board.setBoard(board.slice(0,64)) === false ){
            return false;
        } else {
            if( board.charAt(65) === "X" ){
                this._turn = this._board.color.Black;
            } else if( board.charAt(65) === "O" ){
                this._turn = this._board.color.White;
            } else if( board.charAt(65) === "-" ){
                this._turn = this._board.color.Empty;
            } else return false;
        }
        this._update_turn();
        return true;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.getHistoryString
        = function(){
        var history = "";
        var l = this._history.length;
        for(var i=0; i<l; i++){ history = history.concat(this._history_str[i]); }
        return history;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.setHistoryString
        = function(string){
        var bak = this.getHistory();
        var ib = 
            "---------------------------OX------XO---------------------------tX";
        this._restore(ib);
        this._history_pos = 0;
        this._history = [ib];
        this._history_str = [""];
        var e = { str: string,};
        while( true ){
            if( e.str === "" ){
                this._update();
                return true;
            }
            e = this._getStringMove(this.getBoard(), e.str);
            if( e === false ){ break; }
            if( e.isFree === true ){
                if( this.setBoard(e.board) === false ){ break; }
            } else {
                if( this._move(e.x, e.y) === false ){ break; }
            }
        }
        this.setHistory(bak);
        this._update();
        return false;
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.getHistory = function(){
        return JSON.stringify({
            board: this._history,
            str: this._history_str,
            pos: this._history_pos,
        });
    };
    fwcyan.plugin.JSprinCore.ReversiGame.prototype.setHistory = function(history){
        history = JSON.parse(history);
        this._history = history.board;
        this._history_str = history.str;
        this._history_pos = history.pos;
        this._restore(this._history[this._history_pos]);
        this._update();
    };

    fwcyan.plugin.JSprinCore.ReversiStatus = Object.create(Object.prototype);
    fwcyan.plugin.JSprinCore.ReversiStatus.prototype
        = Object.create(fwcyan.Button.prototype);
    fwcyan.plugin.JSprinCore.ReversiStatus.create = function(proto){
        proto = proto || fwcyan.plugin.JSprinCore.ReversiStatus.prototype;
        var os = fwcyan.Button.create("status", 0, proto);
        return os;
    };
    fwcyan.plugin.JSprinCore.ReversiStatus.prototype.resize = function(e){
        this._drawer = e;
    };
    fwcyan.plugin.JSprinCore.ReversiStatus.prototype.draw = function(){
        this._drawer.ctx.strokeStyle = "rgb(0,0,0)";
        this._drawer.ctx.fillStyle = this._drawer.color.disable;
        this._drawer.ctx.fillRect(
            this._drawer.rect.x, this._drawer.rect.y,
            this._drawer.rect.width, this._drawer.rect.height);
        this._drawer.ctx.strokeRect(
            this._drawer.rect.x, this._drawer.rect.y,
            this._drawer.rect.width, this._drawer.rect.height);

        if( this._turn === this._color.Empty ){
            this._drawer.ctx.fillStyle = this._drawer.color.enable;
            this._drawer.ctx.fillRect(
                this._drawer.rect.x + this._drawer.rect.width*0.07,
                this._drawer.rect.y + this._drawer.rect.height*0.17,
                this._drawer.rect.width * 0.26, this._drawer.rect.height * 0.26
            );
            this._drawer.ctx.strokeRect(
                this._drawer.rect.x + this._drawer.rect.width * 0.07,
                this._drawer.rect.y + this._drawer.rect.height * 0.17,
                this._drawer.rect.width * 0.26, this._drawer.rect.height * 0.26
            );
            this._drawer.ctx.fillStyle = this._drawer.color.enable;
            this._drawer.ctx.fillRect(
                this._drawer.rect.x + this._drawer.rect.width * 0.67,
                this._drawer.rect.y + this._drawer.rect.height * 0.17,
                this._drawer.rect.width * 0.26, this._drawer.rect.height * 0.26
            );
            this._drawer.ctx.strokeRect(
                this._drawer.rect.x + this._drawer.rect.width * 0.67,
                this._drawer.rect.y + this._drawer.rect.height * 0.17,
                this._drawer.rect.width * 0.26, this._drawer.rect.height * 0.26
            );

            this._drawer.ctx.fillStyle = "rgb(0,0,0)";
            this._drawer.ctx.beginPath();
            this._drawer.ctx.arc(
                this._drawer.rect.x + this._drawer.rect.width * 0.2,
                this._drawer.rect.y + this._drawer.rect.height * 0.3,
                this._drawer.rect.width * 0.117, Math.PI*2, false
            );
            this._drawer.ctx.fill();
            this._drawer.ctx.stroke();

            this._drawer.ctx.fillStyle = "rgb(255,255,255)";
            this._drawer.ctx.beginPath();
            this._drawer.ctx.arc(
                this._drawer.rect.x + this._drawer.rect.width * 0.8,
                this._drawer.rect.y + this._drawer.rect.height * 0.3,
                this._drawer.rect.width * 0.117, Math.PI*2, false
            );
            this._drawer.ctx.fill();
            this._drawer.ctx.stroke();

            this._drawer.ctx.fillStyle = "rgb(0,0,0)";
            this._drawer.ctx.font = (this._drawer.rect.width*0.3) +"px sans-serif";
            this._drawer.ctx.fillText(this._countBlack,
                this._drawer.rect.x + this._drawer.rect.width * 0.2,
                this._drawer.rect.y + this._drawer.rect.height * 0.65,
                this._drawer.rect.width );
            this._drawer.ctx.fillText("-",
                this._drawer.rect.x + this._drawer.rect.width * 0.5,
                this._drawer.rect.y + this._drawer.rect.height * 0.65,
                this._drawer.rect.width );
            this._drawer.ctx.fillText(this._countWhite,
                this._drawer.rect.x + this._drawer.rect.width * 0.8,
                this._drawer.rect.y + this._drawer.rect.height * 0.65,
                this._drawer.rect.width );
        } else {
            this._drawer.ctx.fillStyle = "rgb(0,0,0)";
            this._drawer.ctx.font = (this._drawer.rect.width*0.25) +"px sans-serif";
            this._drawer.ctx.fillText("Turn",
                this._drawer.rect.x + this._drawer.rect.width*0.5,
                this._drawer.rect.y + this._drawer.rect.height*0.2,
                this._drawer.rect.width
            );
        
            this._drawer.ctx.fillStyle = this._drawer.color.enable;
            this._drawer.ctx.fillRect(
                this._drawer.rect.x + this._drawer.rect.width*0.25,
                this._drawer.rect.y + this._drawer.rect.height*0.4,
                this._drawer.rect.width * 0.5, this._drawer.rect.height * 0.5
            );
            this._drawer.ctx.strokeStyle = "rgb(0,0,0)";
            this._drawer.ctx.strokeRect(
                this._drawer.rect.x + this._drawer.rect.width*0.25,
                this._drawer.rect.y + this._drawer.rect.height*0.4,
                this._drawer.rect.width * 0.5, this._drawer.rect.height * 0.5
            );

            if( this._turn === this._color.Black ){
                this._drawer.ctx.fillStyle = "rgb(0,0,0)";
            } else {
                this._drawer.ctx.fillStyle = "rgb(255,255,255)";
            }
            this._drawer.ctx.beginPath();
            this._drawer.ctx.arc(
                this._drawer.rect.x + this._drawer.rect.width * 0.5,
                this._drawer.rect.y + this._drawer.rect.height * 0.65,
                this._drawer.rect.width * 0.225, Math.PI*2, false
            );
            this._drawer.ctx.fill();
            this._drawer.ctx.stroke();
        }
    };
    fwcyan.plugin.JSprinCore.ReversiStatus.prototype._setData
        = function(turn, board){
        this._turn = turn;
        this._countBlack = 0;
        this._countWhite = 0;
        this._countEmpty = 0;
        this._color = board.color;
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                if( board.getCell(i, j) === board.color.Black ){
                    this._countBlack = this._countBlack +1;
                } else if( board.getCell(i, j) === board.color.White ){
                    this._countWhite = this._countWhite +1;
                } else if( board.getCell(i, j) === board.color.Empty ){
                    this._countEmpty = this._countEmpty +1;
                }
            }
        }
    };
    fwcyan.plugin.JSprinCore.ReversiStatus.prototype.update
        = function(turn, board){
        this._setData(turn, board);
        this._update();
    };

    fwcyan.plugin.JSprinCore.ReversiDisk = Object.create(Object.prototype);
    fwcyan.plugin.JSprinCore.ReversiDisk.prototype
        = Object.create(fwcyan.ToggleItem.prototype);
    fwcyan.plugin.JSprinCore.ReversiDisk.prototype.draw = function(){
        if( this._value ===
            fwcyan.plugin.JSprinCore.ReversiBoard.prototype.color.None ){
            this._score = -1;
        } else {
            this._score = 1;
        }
        fwcyan.Button.prototype._draw_frame.call(this);

        if( this._value ===
            fwcyan.plugin.JSprinCore.ReversiBoard.prototype.color.None ){
            return;
        }
        if( this._value ===
            fwcyan.plugin.JSprinCore.ReversiBoard.prototype.color.Empty ){
            return;
        }
        if( this._value ===
            fwcyan.plugin.JSprinCore.ReversiBoard.prototype.color.Black ){
            this._drawer.ctx.fillStyle = "rgb(0,0,0)";
        } else if( this._value ===
            fwcyan.plugin.JSprinCore.ReversiBoard.prototype.color.White ){
            this._drawer.ctx.fillStyle = "rgb(255,255,255)";
        }
        this._drawer.ctx.beginPath();
        this._drawer.ctx.arc(
            this._drawer.rect.x + this._drawer.rect.width * 0.5,
            this._drawer.rect.y + this._drawer.rect.height * 0.5,
            this._drawer.rect.width * 0.45, Math.PI*2, false
        );
        this._drawer.ctx.fill();
        this._drawer.ctx.stroke();
    };
    fwcyan.plugin.JSprinCore.ReversiDisk.create = function(color, proto){
        proto = proto || fwcyan.plugin.JSprinCore.ReversiDisk.prototype;
        var od = fwcyan.ToggleItem.create(color, proto);
        return od;
    };

};
