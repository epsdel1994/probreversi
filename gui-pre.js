/*
	This file is part of probreversi. See
	<https://github.com/epsdel1994/probreversi> for detail.
*/

"use strict";

var pbr_gui = {};

pbr_gui.setup = function(fwcyan){

    fwcyan.setColor(0);

    pbr_gui.board = fwcyan.plugin.ProbReversi.Board.create();
    pbr_gui.button_undo = fwcyan.Button.create("<", 1);
    pbr_gui.button_undo.select = function(){
        Module.cwrap('ems_undo', 'number', [])();
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };
    pbr_gui.button_redo = fwcyan.Button.create(">", 1);
    pbr_gui.button_redo.select = function(){
        Module.cwrap('ems_redo', 'number', [])();
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };
    pbr_gui.button_branch = fwcyan.Button.create("branch", 1);
    pbr_gui.button_branch.select = function(){
        Module.cwrap('ems_branch', 'number', [])();
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };
    pbr_gui.button_trunk = fwcyan.Button.create("trunk", 1);
    pbr_gui.button_trunk.select = function(){
        Module.cwrap('ems_trunk', 'number', [])();
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };
    pbr_gui.button_new = fwcyan.Button.create("New", 1);
    pbr_gui.button_new.select = function(){
        Module.cwrap('ems_new', '', [])();
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };
    pbr_gui.button_status = fwcyan.plugin.ProbReversi.Status.create
        ();
    pbr_gui.button_style = fwcyan.Button.create("Style", 0);
    pbr_gui.button_baseprob = fwcyan.ButtonVolume.create
        ("Probability", 99, 51, 80);
    pbr_gui.button_baseprob.change = function(){
        Module.cwrap('ems_set_prob_base', '', ['number'])(this._value/100);
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    }
    pbr_gui.button_about = fwcyan.Button.create("About", 1);
    pbr_gui.button_about.select = function(){
        window.open("https://github.com/epsdel1994/probreversi");
    };

    fwcyan.setMain(fwcyan.Popup.create(fwcyan.Template1.create([
        pbr_gui.board,
        pbr_gui.button_undo,
        pbr_gui.button_redo,
        fwcyan.Button.create("", 0),
        pbr_gui.button_baseprob,
        pbr_gui.button_new,
        pbr_gui.button_style,
        pbr_gui.button_status,
        pbr_gui.button_about,
    ])));

    var setup_res = Module.cwrap('ems_setup', 'number', ['number'])(0.8);

    pbr_gui.board.pointCell = function(e){
        Module.cwrap('ems_move', 'number', ['number', 'number'])(e.x, e.y);
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };

    pbr_gui.update();
};

pbr_gui.update = function(){
    var buf = Module._malloc(256);
    Module.cwrap('ems_get_str', '', ['number'])(buf);
    var board = UTF8ToString(buf);
    Module._free(buf);
    pbr_gui.board.setBoard(board);

    var can_undo = Module.cwrap('ems_can_undo', 'number', [])();
    pbr_gui.button_undo.setScore(can_undo ? 1 : 0);
    var can_redo = Module.cwrap('ems_can_redo', 'number', [])();
    pbr_gui.button_redo.setScore(can_redo ? 1 : 0);
    var can_branch = Module.cwrap('ems_can_branch', 'number', [])();
    pbr_gui.button_branch.setScore(can_branch ? 1 : 0);
    var can_trunk = Module.cwrap('ems_can_trunk', 'number', [])();
    pbr_gui.button_trunk.setScore(can_trunk ? 1 : 0);

    var nextprob = Module.cwrap('ems_get_prob_next', 'number', [])();
    if(nextprob < 0){
        var count_black = Module.cwrap('ems_count', 'number', [])();
        pbr_gui.button_status.update(true, count_black);
    } else {
        pbr_gui.button_status.update(false, nextprob);
    }
};

kurumicl.onload = function(){
};

kurumicl.onstart = function(canvas){
    pbr_gui.fwcyan = FWcyan(canvas, [ProbReversi]);
    pbr_gui.setup(pbr_gui.fwcyan);
};

var Module = {
    onRuntimeInitialized: function(){
        kurumicl.ready();
    }
};

kurumicl.onresize = function(){
    pbr_gui.fwcyan.resize();
    pbr_gui.fwcyan.draw();
};
