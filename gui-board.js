/*
	This file is part of probreversi. See
	<https://github.com/epsdel1994/probreversi> for detail.
*/

"use strict";

var ProbReversi = function(fwcyan){

    fwcyan.plugin.ProbReversi = {};

    fwcyan.plugin.ProbReversi.Board = Object.create(Object.prototype);
    fwcyan.plugin.ProbReversi.Board.prototype
        = Object.create(fwcyan.Element.prototype);
    fwcyan.plugin.ProbReversi.Board.prototype.setStyle = function(style){
/*
        if( style === true ){
        } else {
        }
*/
    }
    fwcyan.plugin.ProbReversi.Board.prototype.setBoard = function(board){
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                var c1 = board.charAt((i*8+j) * 2);
                var c2 = board.charAt((i*8+j) * 2 + 1);
                if((c1 === "-") && (c2 === "-")){
                    this._cell_is_empty[j][i] = true;
                    this._cell_can_move[j][i] = false;
                } else if((c1 === "[") && (c2 === "]")){
                    this._cell_is_empty[j][i] = true;
                    this._cell_can_move[j][i] = true;
                } else {
                    this._cell_is_empty[j][i] = false;
                    this._cell_can_move[j][i] = false;
                    a1 = c1.charCodeAt(0) - "0".charCodeAt(0);
                    a2 = c2.charCodeAt(0) - "0".charCodeAt(0);
                    this._cell[j][i] = a1 * 10 + a2;
                }
            }
        }
    };
    fwcyan.plugin.ProbReversi.Board.prototype.pointCell = function(e){ };
    fwcyan.plugin.ProbReversi.Board.prototype.point = function(e){
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
    fwcyan.plugin.ProbReversi.Board.prototype.movepointCell = function(e){ };
    fwcyan.plugin.ProbReversi.Board.prototype.movepoint = function(e){
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
    fwcyan.plugin.ProbReversi.Board.prototype.draw = function(){
        this._drawer.ctx.strokeStyle = "rgb(0,0,0)";
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
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

                if( this._cell_can_move[i][j] === true){
                    this._drawer.ctx.strokeRect(
                        this._drawer.rect.x + (this._drawer.rect.width/8)*i
                            + this._drawer.rect.width * 0.125 * 0.1,
                        this._drawer.rect.y + (this._drawer.rect.height/8)*j
                            + this._drawer.rect.height * 0.125 * 0.1,
                        this._drawer.rect.width * 0.125 * 0.8 ,
                        this._drawer.rect.height * 0.125 * 0.8
                    );
                    continue;
                } else { 
                    var scale = Math.floor((255 / 100) * this._cell[i][j]);
                    this._drawer.ctx.fillStyle =
                        "rgb(" + scale + "," + scale + "," scale + ")";
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
    };
    fwcyan.plugin.ProbReversi.Board.create = function(proto){
        proto = proto || fwcyan.plugin.ProbReversi.Board.prototype;
        var rb = fwcyan.Element.create(proto);
        rb._cell = [
            [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0] ];
        rb._cell_can_move = [
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false] ];
        rb._cell_is_empty = [
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false] ];
        rb._enabled = true;
        return rb;
    };
};
