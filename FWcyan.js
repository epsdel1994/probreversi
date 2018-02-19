/*
	This file is part of probreversi. See
	<https://github.com/epsdel1994/probreversi> for detail.
*/

"use strict";

var FWcyan = (function(){

    var fwcyan;
    var FWcyan = Object.create(Object.prototype);

    FWcyan.prototype = {};
    FWcyan.prototype.resize = function(){
        var rect = this._canvas.getBoundingClientRect();
        this._canvas.width = (rect.right - rect.left)
            * window.devicePixelRatio;
        this._canvas.height = (rect.bottom - rect.top)
            * window.devicePixelRatio;

        this._main.disable();
        var l = this._popups.length;
        for( var i=0; i<l; i++){ this._popups[i].disable(); }

        if( this._popup_active === null ){
            this._main.resize( { ctx: this._canvas.getContext('2d'),
                rect: {x: 0, y: 0, width: this._canvas.width,
                height: this._canvas.height, }, color: this._color, });
        } else {
            this._popup_active.resize( { ctx: this._canvas.getContext('2d'),
                rect: {x: 0, y: 0, width: this._canvas.width,
                height: this._canvas.height, }, color: this._color, });
        }
    };
    FWcyan.prototype.onload = function(){
        window.alert("Welcome to FWcyan!");
    };
    FWcyan.prototype.setCanvas = function(canvas){
        this._canvas = canvas;

        if('onmousedown' in canvas){
            canvas.onmousedown = function(e){
                var rect = canvas.getBoundingClientRect();
                e.preventDefault();
                fwcyan.pointStart({ pos: {
                    x: (e.clientX - rect.left) * window.devicePixelRatio,
                    y: (e.clientY - rect.top) * window.devicePixelRatio,
                }, rect: { x: 0, y: 0,
                    width: canvas.width, height: canvas.height,
                }, });
            };
        }
        if('ontouchstart' in canvas){
            canvas.ontouchstart = function(e){
                var rect = canvas.getBoundingClientRect();
                e.preventDefault();
                fwcyan.pointStart({ pos: {
                    x: (e.changedTouches[0].clientX - rect.left)
                        * window.devicePixelRatio,
                    y: (e.changedTouches[0].clientY - rect.top)
                        * window.devicePixelRatio,
                }, rect: { x: 0, y: 0,
                    width: canvas.width, height: canvas.height,
                }, });
            };
        }

        if('onmouseup' in canvas){
            canvas.onmouseup = function(e){
                var rect = canvas.getBoundingClientRect();
                e.preventDefault();
                fwcyan.pointEnd({ pos: {
                    x: (e.clientX - rect.left) * window.devicePixelRatio,
                    y: (e.clientY - rect.top) * window.devicePixelRatio,
                }, rect: { x: 0, y: 0,
                    width: canvas.width, height: canvas.height,
                }, });
            };
        }
        if('ontouchend' in canvas){
            canvas.ontouchend = function(e){
                var rect = canvas.getBoundingClientRect();
                e.preventDefault();
                fwcyan.pointEnd({ pos: {
                    x: (e.changedTouches[0].clientX - rect.left)
                        * window.devicePixelRatio,
                    y: (e.changedTouches[0].clientY - rect.top)
                        * window.devicePixelRatio,
                }, rect: { x: 0, y: 0,
                    width: canvas.width, height: canvas.height,
                }, });
            };
        }

        if('onmousemove' in canvas){
            canvas.onmousemove = function(e){
                var rect = canvas.getBoundingClientRect();
                e.preventDefault();
                fwcyan.pointMove({ pos: {
                    x: (e.clientX - rect.left) * window.devicePixelRatio,
                    y: (e.clientY - rect.top) * window.devicePixelRatio,
                }, rect: { x: 0, y: 0,
                    width: canvas.width, height: canvas.height,
                }, });
            };
        }
        if('ontouchmove' in canvas){
            canvas.ontouchmove = function(e){
                var rect = canvas.getBoundingClientRect();
                e.preventDefault();
                fwcyan.pointMove({ pos: {
                    x: (e.changedTouches[0].clientX - rect.left)
                        * window.devicePixelRatio,
                    y: (e.changedTouches[0].clientY - rect.top)
                        * window.devicePixelRatio,
                }, rect: { x: 0, y: 0,
                    width: canvas.width, height: canvas.height,
                }, });
            };
        }
    };
    FWcyan.prototype.setColor = function(color_hue){

        var r, g, b, nr, ng, nb, vr, vg, vb, br, bg, bb, s, l, k;

        l = 0.9; k = 0.3;

        if( (0<=color_hue) && (color_hue<60) ){
            vr = 255; vb = 0; vg = (color_hue/60)*255;
        } else if( (60<=color_hue) && (color_hue<=120) ){
            vg = 255; vb = 0; vr = ((120-color_hue)/60)*255;
        } else if( (120<=color_hue) && (color_hue<180) ){
            vg = 255; vr = 0; vb = ((color_hue-120)/60)*255;
        } else if( (180<=color_hue) && (color_hue<240) ){
            vb = 255; vr = 0; vg = ((240-color_hue)/60)*255;
        } else if( (240<=color_hue) && (color_hue<300) ){
            vb = 255; vg = 0; vr = ((color_hue-240)/60)*255;
        } else if( (300<=color_hue) && (color_hue<360) ){
            vr = 255; vg = 0; vb = ((360-color_hue)/60)*255;
        }

        br = l * vr; bg = l * vg; bb = l * vb;

        s = 1 - (br+bg+bb)/(255*3);

        r = 255-k*(255-br)/s;
        g = 255-k*(255-bg)/s;
        b = 255-k*(255-bb)/s;
        nr = 255-k*(255-br)/(s*2);
        ng = 255-k*(255-bg)/(s*2);
        nb = 255-k*(255-bb)/(s*2);

        this._color = {};
        this._color.enable = "rgb("
            + Math.floor(r) + ","
            + Math.floor(g) + ","
            + Math.floor(b) + ")";
        this._color.disable = "rgb("
            + Math.floor(nr) + ","
            + Math.floor(ng) + ","
            + Math.floor(nb) + ")";
    };
    FWcyan.prototype._movepoint = function(e){
        if( this._popup_active === null ){
            this._main.movepoint(e);
        } else {
            this._popup_active.movepoint(e);
        }
    };
    FWcyan.prototype._point = function(e){
        if( this._popup_active === null ){
            this._main.point(e);
        } else {
            this._popup_active.point(e);
        }
    };
    FWcyan.prototype.pointStart = function(e){
        this._isPoint = true;
        this._isPointMove = true;
        this._posPointStart = {};
        this._posPointStart.x = e.pos.x;
        this._posPointStart.y = e.pos.y;
    };
    FWcyan.prototype.pointEnd = function(e){
        if( this._isPoint === true ){
            this._point(e);
        }
        this._isPoint = false;
        this._isPointMove = false;
    };
    FWcyan.prototype.pointMove = function(e){ 
        if( this._isPointMove === true ){
            this._movepoint(e);
        }
        if( this._isPoint === true ){
            if(
                (this._posPointStart.x - e.pos.x)
                * (this._posPointStart.x - e.pos.x)
                + (this._posPointStart.y - e.pos.y)
                * (this._posPointStart.y - e.pos.y)
                > (Math.min(e.rect.width, e.rect.height) / 10)
                * (Math.min(e.rect.width, e.rect.height) / 10)
            ){
                this._isPoint = false;
            }
        };
    };
    FWcyan.prototype.draw = function(){
        if( this._popup_active === null ){
            this._main.draw();
        } else {
            this._popup_active.draw();
        }
    };
    FWcyan.prototype.setMain = function(popup){ this._main = popup; };
    FWcyan.prototype.setPopups = function(popups){
        this._popups = popups;

        var l = popups.length;
        for(var i=0; i<l; i++){ popups[i]._parent = this; }
    };

    FWcyan.prototype.Template1 = Object.create(Object.prototype);
    FWcyan.prototype.Template1.prototype = Object.create(Object.prototype);
    FWcyan.prototype.Template1.prototype.disable = function(){
        this._drawer = null;
        var l = this._elements.length;
        for( var i=0; i<l; i++){ this._elements[i].disable(); }
    };
    FWcyan.prototype.Template1.prototype.movepoint = function(e){
        var l = this._elements.length;
        for( var i=0; i<l; i++){
            if( (this._elements_posX[i] <= e.pos.x)
                &&(e.pos.x <= this._elements_posX[i] + this._elements_size[i])
                && (this._elements_posY[i] <= e.pos.y)
                && (e.pos.y <= this._elements_posY[i] + this._elements_size[i]) 
            ) {
                this._elements[i].movepoint({
                    pos: { x: e.pos.x-this._elements_posX[i],
                        y: e.pos.y-this._elements_posY[i], 
                    }, rect: {
                        x: 0, y: 0, 
                        width: this._elements_size[i],
                        height: this._elements_size[i],
                    },
                });
                break;
            }
        }
    };
    FWcyan.prototype.Template1.prototype.point = function(e){
        var l = this._elements.length;
        for( var i=0; i<l; i++){
            if( (this._elements_posX[i] <= e.pos.x)
                &&(e.pos.x <= this._elements_posX[i] + this._elements_size[i])
                && (this._elements_posY[i] <= e.pos.y)
                && (e.pos.y <= this._elements_posY[i] + this._elements_size[i]) 
            ) {
                this._elements[i].point({
                    pos: { x: e.pos.x-this._elements_posX[i],
                        y: e.pos.y-this._elements_posY[i], 
                    }, rect: {
                        x: 0, y: 0, 
                        width: this._elements_size[i],
                        height: this._elements_size[i],
                    },
                });
                break;
            }
        }
    };
    FWcyan.prototype.Template1.prototype.resize = function(e){
        this._drawer = e;

        if( e.rect.width < e.rect.height ){
            this._isWide = false;
            if( e.rect.width*1.5 < e.rect.height ){
              this._sizeGrid = Math.floor((e.rect.width * 0.95) / 16 ) * 2;
            } else {
              this._sizeGrid = Math.floor((e.rect.height * 0.95) / 24 ) * 2;
            }
            this._posX=Math.floor((e.rect.width-8*this._sizeGrid)/2);
            this._posY=Math.floor((e.rect.height-12*this._sizeGrid)/2);
        } else {
            this._isWide = true;
            if( e.rect.height*1.5 < e.rect.width ){
              this._sizeGrid = Math.floor((e.rect.height * 0.9) / 16 ) * 2;
            } else {
              this._sizeGrid = Math.floor((e.rect.width * 0.9) / 24 ) * 2;
            }
            this._posX=Math.floor((e.rect.width-12*this._sizeGrid)/2);
            this._posY=Math.floor((e.rect.height-8*this._sizeGrid)/2);
        }

        this._elements_posX = [
            null, null, null, null, null, null, null, null, null,
        ];
        this._elements_posY = [
            null, null, null, null, null, null, null, null, null,
        ];
        this._elements_size = [
            null, null, null, null, null, null, null, null, null,
        ];

        if( this._isWide === true ){
            this._elements_posX[0] = this._posX + this._sizeGrid * 0;
            this._elements_posY[0] = this._posY + this._sizeGrid * 0;
            this._elements_size[0] = this._sizeGrid * 8;
            for( var i=0; i<8; i++){
                this._elements_posX[i+1] = this._posX
                    + 2*this._sizeGrid*(i%2 +4);
                this._elements_posY[i+1] = this._posY
                    + 2*this._sizeGrid*(Math.floor(i/2));
                this._elements_size[i+1] = this._sizeGrid * 2;
            }
        } else {
            this._elements_posX[0] = this._posX + this._sizeGrid * 0;
            this._elements_posY[0] = this._posY + this._sizeGrid * 0;
            this._elements_size[0] = this._sizeGrid * 8;
            for( var i=0; i<8; i++){
                this._elements_posX[i+1] = this._posX
                    + 2*this._sizeGrid*(i%4);
                this._elements_posY[i+1] = this._posY
                    + 2*this._sizeGrid*(Math.floor(i/4) +4);
                this._elements_size[i+1] = this._sizeGrid * 2;
            }
        }

        var l = this._elements.length;
        for( var i=0; i<l; i++){ this._elements[i].resize({
            ctx: e.ctx, rect: {x: this._elements_posX[i],
                y: this._elements_posY[i],
                width: this._elements_size[i],
                height: this._elements_size[i],},
            color: e.color,
        }); }

        e.ctx.lineWidth = this._sizeGrid * 0.02;
    };
    FWcyan.prototype.Template1.prototype.draw = function(){
        this._drawer.ctx.fillStyle = this._drawer.color.disable;
        this._drawer.ctx.fillRect(
            this._drawer.rect.x, this._drawer.rect.y,
            this._drawer.rect.width, this._drawer.rect.height);

        var l = this._elements.length;
        for( var i=0; i<l; i++){ this._elements[i].draw(); }
    };
    FWcyan.prototype.Template1.create = function(elements, proto){
        proto = proto || this.prototype;
        var template = Object.create(proto);
        template._elements = elements;
        return template;
    };

    FWcyan.prototype.Template2 = Object.create(Object.prototype);
    FWcyan.prototype.Template2.prototype = Object.create(Object.prototype);
    FWcyan.prototype.Template2.prototype.disable = function(){
        this._drawer = null;
        var l = this._elements.length;
        for( var i=0; i<l; i++){ this._elements[i].disable(); };
    };
    FWcyan.prototype.Template2.prototype.movepoint = function(e){
        var l = this._elements.length;
        for( var i=0; i<l; i++){
            if( (this._elements_posX[i] <= e.pos.x)
                &&(e.pos.x <= this._elements_posX[i] + this._elements_size[i])
                && (this._elements_posY[i] <= e.pos.y)
                && (e.pos.y <= this._elements_posY[i] + this._elements_size[i]) 
            ) {
                this._elements[i].movepoint({
                    pos: { x: e.pos.x-this._elements_posX[i],
                        y: e.pos.y-this._elements_posY[i], 
                    }, rect: {
                        x: 0, y: 0, 
                        width: this._elements_size[i],
                        height: this._elements_size[i],
                    },
                });
                break;
            }
        }
    };
    FWcyan.prototype.Template2.prototype.point = function(e){
        var l = this._elements.length;
        for( var i=0; i<l; i++){
            if( (this._elements_posX[i] <= e.pos.x)
                &&(e.pos.x <= this._elements_posX[i] + this._elements_size[i])
                && (this._elements_posY[i] <= e.pos.y)
                && (e.pos.y <= this._elements_posY[i] + this._elements_size[i]) 
            ) {
                this._elements[i].point({
                    pos: { x: e.pos.x-this._elements_posX[i],
                        y: e.pos.y-this._elements_posY[i], 
                    }, rect: {
                        x: 0, y: 0, 
                        width: this._elements_size[i],
                        height: this._elements_size[i],
                    },
                });
                break;
            }
        }
    };
    FWcyan.prototype.Template2.prototype.resize = function(e){
        this._drawer = e;

        if( e.rect.width < e.rect.height ){
            this._isWide = false;
            if( e.rect.width*1.5 < e.rect.height ){
              this._sizeGrid = Math.floor((e.rect.width * 0.95) / 16 ) * 2;
            } else {
              this._sizeGrid = Math.floor((e.rect.height * 0.95) / 24 ) * 2;
            }
            this._posX=Math.floor((e.rect.width-8*this._sizeGrid)/2);
            this._posY=Math.floor((e.rect.height-12*this._sizeGrid)/2);
        } else {
            this._isWide = true;
            if( e.rect.height*1.5 < e.rect.width ){
              this._sizeGrid = Math.floor((e.rect.height * 0.9) / 16 ) * 2;
            } else {
              this._sizeGrid = Math.floor((e.rect.width * 0.9) / 24 ) * 2;
            }
            this._posX=Math.floor((e.rect.width-12*this._sizeGrid)/2);
            this._posY=Math.floor((e.rect.height-8*this._sizeGrid)/2);
        }

        this._elements_posX = [
            null, null, null, null, null, null, null, null, 
            null, null, null, null, null, null, null, null, 
            null, null, null, null, null, null, null, null, 
        ];
        this._elements_posY = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, 
            null, null, null, null, null, null, null, null, 
        ];
        this._elements_size = [
            null, null, null, null, null, null, null, null, 
            null, null, null, null, null, null, null, null, 
            null, null, null, null, null, null, null, null, 
        ];

        if( this._isWide === true ){
            for( var i=0; i<24; i++){
                this._elements_posX[i] = this._posX
                    + 2*this._sizeGrid*(i%6);
                this._elements_posY[i] = this._posY
                    + 2*this._sizeGrid*(Math.floor(i/6));
                this._elements_size[i] = this._sizeGrid * 2;
            }
        } else {
            for( var i=0; i<24; i++){
                this._elements_posX[i] = this._posX
                    + 2*this._sizeGrid*(i%4);
                this._elements_posY[i] = this._posY
                    + 2*this._sizeGrid*(Math.floor(i/4));
                this._elements_size[i] = this._sizeGrid * 2;
            }
        }

        var l = this._elements.length;
        for( var i=0; i<l; i++){ this._elements[i].resize({
            ctx: e.ctx, rect: {x: this._elements_posX[i],
                y: this._elements_posY[i],
                width: this._elements_size[i],
                height: this._elements_size[i],},
            color: e.color,
        }); }

        e.ctx.lineWidth = this._sizeGrid * 0.02;
    };
    FWcyan.prototype.Template2.prototype.draw = function(){
        this._drawer.ctx.fillStyle = this._drawer.color.disable;
        this._drawer.ctx.fillRect(
            this._drawer.rect.x, this._drawer.rect.y,
            this._drawer.rect.width, this._drawer.rect.height);

        var l = this._elements.length;
        for( var i=0; i<l; i++){ this._elements[i].draw(); }
    };
    FWcyan.prototype.Template2.create = function(elements, proto){
        proto = proto || this.prototype;
        var template = Object.create(proto);
        template._elements = elements;
        return template;
    };

    FWcyan.prototype.Element = Object.create(Object.prototype);
    FWcyan.prototype.Element.prototype = Object.create(Object.prototype);
    FWcyan.prototype.Element.prototype.change = function(e){ };
    FWcyan.prototype.Element.prototype.point = function(e){ };
    FWcyan.prototype.Element.prototype.movepoint = function(e){ };
    FWcyan.prototype.Element.prototype.disable = function(){
        this._drawer = null;
    };
    FWcyan.prototype.Element.prototype.resize = function(e){
        this._drawer = e;
    };
    FWcyan.prototype.Element.prototype.draw = function(){ };
    FWcyan.prototype.Element.prototype._update = function(){
        this.change();
        if(this._drawer !== null){ this.draw(); }
    };
    FWcyan.prototype.Element.create = function(proto){
        proto = proto || this.prototype;
        var element = Object.create(proto);
        element._drawer = null;
        return element;
    };

    FWcyan.prototype.Button = Object.create(Object.prototype);
    FWcyan.prototype.Button.prototype
        = Object.create(FWcyan.prototype.Element.prototype);
    FWcyan.prototype.Button.prototype.change = function(){
    };
    FWcyan.prototype.Button.prototype.select = function(){
    };
    FWcyan.prototype.Button.prototype.point = function(e){
        if(this._score !== 0){ this.select(); }
    };
    FWcyan.prototype.Button.prototype.movepoint = function(e){
    };
    FWcyan.prototype.Button.prototype._draw_frame = function(){
        this._drawer.ctx.strokeStyle = "rgb(0,0,0)";
        if( this._score < 0 ){
            this._drawer.ctx.fillStyle = "rgb(255,255,255)";
        } else if( this._score === 0 ){
            this._drawer.ctx.fillStyle = this._drawer.color.disable;
        } else {
            this._drawer.ctx.fillStyle = this._drawer.color.enable;
        }
        this._drawer.ctx.fillRect(
            this._drawer.rect.x, this._drawer.rect.y,
            this._drawer.rect.width, this._drawer.rect.height);
        this._drawer.ctx.strokeRect(
            this._drawer.rect.x, this._drawer.rect.y,
            this._drawer.rect.width, this._drawer.rect.height);
        if( (this._score === -2) || (this._score === 2) ){
            this._drawer.ctx.strokeRect(
                this._drawer.rect.x + this._drawer.rect.width * 0.1,
                this._drawer.rect.y + this._drawer.rect.height * 0.1,
                this._drawer.rect.width * 0.8,
                this._drawer.rect.height * 0.8);
        }
    };
    FWcyan.prototype.Button.prototype.draw = function(){
        this._draw_frame();

        this._drawer.ctx.fillStyle = "rgb(0,0,0)";
        this._drawer.ctx.textAlign = "center";
        this._drawer.ctx.textBaseline = "middle";
        this._drawer.ctx.font
            = ( this._drawer.rect.width * 0.3 ) + "px sans-serif";
        var width = this._drawer.rect.width;
        if( (this._score === -2) || (this._score === 2) ){
            width = this._drawer.rect.width * 0.8;
        }
        this._drawer.ctx.fillText(this._string,
            this._drawer.rect.x + this._drawer.rect.width * 0.5,
            this._drawer.rect.y + this._drawer.rect.height * 0.5,
            this._drawer.rect.width);
    };
    FWcyan.prototype.Button.prototype.setString = function(string){
        this._string = string;
        this._update();
    };
    FWcyan.prototype.Button.prototype.getScore = function(score){
        return this._score;
    };
    FWcyan.prototype.Button.prototype.setScore = function(score){
        this._score = score;
        this._update();
    };
    FWcyan.prototype.Button.create = function(string, score, proto){
        proto = proto || this.prototype;
        var button = FWcyan.prototype.Element.create(proto);
        button._string = string;
        button._score = score;
        return button;
    };

    FWcyan.prototype.ButtonVolume = Object.create(Object.prototype);
    FWcyan.prototype.ButtonVolume.prototype
        = Object.create(FWcyan.prototype.Button.prototype);
    FWcyan.prototype.ButtonVolume.prototype.setScore = function(score){
        this._score = score;
        if(this._upper === this._lower){ this._score = 0; }
        this._update();
    };
    FWcyan.prototype.ButtonVolume.prototype.point = function(e){
        if( this._score === 0 ){ return; }
        if( e.pos.x < e.rect.x + e.rect.width * 0.5 ){
            if( this._value === this._lower ){ return; }
            this._value = this._value -1;
            this._update();
        } else {
            if( this._value === this._upper ){ return; }
            this._value = this._value +1;
            this._update();
        }
    };
    FWcyan.prototype.ButtonVolume.prototype.draw = function(){
        this._draw_frame();

        this._drawer.ctx.fillStyle = "rgb(0,0,0)";
        this._drawer.ctx.font =(this._drawer.rect.width*0.2) +"px sans-serif";
        this._drawer.ctx.fillText(this._string,
            this._drawer.rect.x + this._drawer.rect.width * 0.5,
            this._drawer.rect.y + this._drawer.rect.height * 0.2,
            this._drawer.rect.width );
        this._drawer.ctx.font =(this._drawer.rect.width*0.4) +"px sans-serif";
        this._drawer.ctx.fillText(this._value,
            this._drawer.rect.x + this._drawer.rect.width * 0.5,
            this._drawer.rect.y + this._drawer.rect.height * 0.65,
            this._drawer.rect.width );
        this._drawer.ctx.font =(this._drawer.rect.width*0.3) +"px sans-serif";
        if( this._score !== 0 ){
            if( this._value !== this._lower ){
                this._drawer.ctx.fillText("-",
                    this._drawer.rect.x + this._drawer.rect.width * 0.1,
                    this._drawer.rect.y + this._drawer.rect.height * 0.65,
                    this._drawer.rect.width );
            }
            if( this._value !== this._upper ){
                this._drawer.ctx.fillText("+",
                    this._drawer.rect.x + this._drawer.rect.width * 0.9,
                    this._drawer.rect.y + this._drawer.rect.height * 0.65,
                    this._drawer.rect.width );
            }
        }
    };
    FWcyan.prototype.ButtonVolume.prototype.setValue
        = function(upper, lower, value){
        this._lower = lower; this._upper = upper; this._value = value;
        this._update();
    };
    FWcyan.prototype.ButtonVolume.create
        = function(string, upper, lower, value, proto){
        proto = proto || this.prototype;
        var score;
        if(upper !== lower){ score = 1; } else { score = 0; }
        if( value > upper ){ value = upper; }
        if( value < lower ){ value = lower; }
        var bv = FWcyan.prototype.Button.create (string, score, proto);
        bv._upper = upper; bv._lower = lower; bv._value = value;
        return bv;
    };

    FWcyan.prototype.ButtonProgress = Object.create(Object.prototype);
    FWcyan.prototype.ButtonProgress.prototype
        = Object.create(FWcyan.prototype.Button.prototype);
    FWcyan.prototype.ButtonProgress.prototype.setScore = function(score){
        this._score = score;
        this._update();
    };
    FWcyan.prototype.ButtonProgress.prototype.isProcessing = function(){
        return (this._work !== null);
    };
    FWcyan.prototype.ButtonProgress.prototype.draw = function(){
        this._draw_frame();

        if( (this._work === null) || (this._work.stop === true) ) {
            this._drawer.ctx.fillStyle = "rgb(0,0,0)";
            this._drawer.ctx.textAlign = "center";
            this._drawer.ctx.textBaseline = "middle";
            this._drawer.ctx.font
                = ( this._drawer.rect.width * 0.3 ) + "px sans-serif";
            this._drawer.ctx.fillText(this._string,
                this._drawer.rect.x + this._drawer.rect.width * 0.5,
                this._drawer.rect.y + this._drawer.rect.height * 0.5,
                this._drawer.rect.width);
        } else {
            this._drawer.ctx.fillStyle = "rgb(0,0,0)";
            this._drawer.ctx.textAlign = "center";
            this._drawer.ctx.textBaseline = "middle";
            this._drawer.ctx.font
                = ( this._drawer.rect.width * 0.3 ) + "px sans-serif";
            this._drawer.ctx.fillText(this._string,
                this._drawer.rect.x + this._drawer.rect.width * 0.5,
                this._drawer.rect.y + this._drawer.rect.height * 0.45,
                this._drawer.rect.width);

            this._drawer.ctx.fillStyle = "rgb(255,255,255)";
            this._drawer.ctx.fillRect(
                this._drawer.rect.x,
                this._drawer.rect.y + this._drawer.rect.height * 0.75,
                this._drawer.rect.width, this._drawer.rect.height * 0.1);
            if(this._work.progress !== false){
                this._drawer.ctx.fillStyle = this._drawer.color.enable;
                this._drawer.ctx.fillRect(
                    this._drawer.rect.x,
                    this._drawer.rect.y + this._drawer.rect.height * 0.75,
                    this._drawer.rect.width * this._work.progress,
                    this._drawer.rect.height * 0.1);
            } else {
                this._drawer.ctx.fillStyle = this._drawer.color.disable;
                this._drawer.ctx.fillRect(
                    this._drawer.rect.x,
                    this._drawer.rect.y + this._drawer.rect.height * 0.75,
                    this._drawer.rect.width,
                    this._drawer.rect.height * 0.1);
            }

            this._drawer.ctx.strokeRect(
                this._drawer.rect.x,
                this._drawer.rect.y + this._drawer.rect.height * 0.75,
                this._drawer.rect.width, this._drawer.rect.height * 0.1);
            }
    };
    FWcyan.prototype.ButtonProgress.prototype.start = function(){ };
    FWcyan.prototype.ButtonProgress.prototype.stop = function(){
        this.finish();
    };
    FWcyan.prototype.ButtonProgress.prototype.finish
        = function(string){
        this._work = null;
        this._string = this._stringIdoling;
        this._score = 1;
        this._update();
    };
    FWcyan.prototype.ButtonProgress.prototype.progress = function(p){
        this._work.progress = p;
        this._update();
    };
    FWcyan.prototype.ButtonProgress.prototype.select = function(){
        if( this._work === null ){
            this._work = { progress: 0,};
            this._string = this._stringProcessing;
            this._score = -1;
            this._update();
            this.start();
        } else {
            this._work.stop = true;
            this._string = this._stringStopping;
            this._score = 0;
            this._update();
            this.stop();
        }
    };
    FWcyan.prototype.ButtonProgress.create
        = function(stringIdoling, stringProcessing, score, proto){
        proto = proto || this.prototype;
        var bp = FWcyan.prototype.Button.create(
            stringIdoling, score, proto);
        bp._work = null;
        bp._stringIdoling = stringIdoling;
        bp._stringProcessing = stringProcessing;
        bp._stringStopping = "Aborting";
        return bp;
    };

    FWcyan.prototype.ButtonToggle = Object.create(Object.prototype);
    FWcyan.prototype.ButtonToggle.prototype
        = Object.create(FWcyan.prototype.Button.prototype);
    FWcyan.prototype.ButtonToggle.prototype.setScore = function(score){
        this._score = score;
        if(this._items.length === 1){ this._score = 0; }
        this._update();
    };
    FWcyan.prototype.ButtonToggle.prototype.setItem = function(item){
        this._item = item;
        this._update();
    };
    FWcyan.prototype.ButtonToggle.prototype.disable = function(){
        this._drawer = null;
        var l = this._items.length;
        for(var i=0; i<l; i++){
            this._items[i].disable();
        }
    };
    FWcyan.prototype.ButtonToggle.prototype.resize = function(e){
        this._drawer = e;

        var e_item = { ctx: e.ctx, rect: {
            x: e.rect.x + e.rect.width * 0.25,
            y: e.rect.y + e.rect.height * 0.4,
            width: e.rect.width * 0.5,
            height: e.rect.height * 0.5,
        }, color: e.color};

        var l = this._items.length;
        for(var i=0; i<l; i++){
            this._items[i].resize(e_item);
        }
    };
    FWcyan.prototype.ButtonToggle.prototype.point = function(e){
        if( this._score === 0 ){ return; }
        if( e.pos.x < e.rect.x + e.rect.width * 0.5 ){
            this._item = this._item.prev;
            this._update();
        } else {
            this._item = this._item.next;
            this._update();
        }
    };
    FWcyan.prototype.ButtonToggle.prototype.draw = function(){
        this._draw_frame();

        this._drawer.ctx.fillStyle = "rgb(0,0,0)";
        this._drawer.ctx.textAlign = "center";
        this._drawer.ctx.textBaseline = "middle";
        this._drawer.ctx.font = (this._drawer.rect.width*0.2) +"px sans-serif";
        this._drawer.ctx.fillText(this._string,
            this._drawer.rect.x + this._drawer.rect.width*0.5,
            this._drawer.rect.y + this._drawer.rect.height*0.2,
            this._drawer.rect.width
        );

        this._item.draw();

        if( this._score !== 0 ){
            this._drawer.ctx.fillStyle = "rgb(0,0,0)";
            this._drawer.ctx.font =(this._drawer.rect.width*0.3) +"px sans-serif";
            this._drawer.ctx.fillText("<",
                this._drawer.rect.x + this._drawer.rect.width * 0.1,
                this._drawer.rect.y + this._drawer.rect.height * 0.65,
                this._drawer.rect.width );
            this._drawer.ctx.font =(this._drawer.rect.width*0.3) +"px sans-serif";
            this._drawer.ctx.fillText(">",
                this._drawer.rect.x + this._drawer.rect.width * 0.9,
                this._drawer.rect.y + this._drawer.rect.height * 0.65,
                this._drawer.rect.width );
        }
    };
    FWcyan.prototype.ButtonToggle.prototype.add = function(item){
        this._items.push(item);
    };
    FWcyan.prototype.ButtonToggle.create = function(string, items, proto){
        proto = proto || this.prototype;
        var l = items.length;
        var score;
        if( l !== 1 ){ score = 1; } else { score = 0; }
        var bt = FWcyan.prototype.Button.create
            (string, score, proto);
        bt._items = items;
        bt._item = items[0];

        for(var i=1; i<l; i++){
            items[i-1].next = items[i];
            items[i].prev = items[i-1];
        }
        items[i-1].next = items[0];
        items[0].prev = items[i-1];

        return bt;
    };

    FWcyan.prototype.ToggleItem = Object.create(Object.prototype);
    FWcyan.prototype.ToggleItem.prototype
        = Object.create(FWcyan.prototype.Element.prototype);
    FWcyan.prototype.ToggleItem.create = function(value, proto){
        proto = proto || this.prototype;
        var item = FWcyan.prototype.Element.create(proto);
        item._value = value;
        return item;
    };

    FWcyan.prototype.Popup = Object.create(Object.prototype);
    FWcyan.prototype.Popup.prototype
        = Object.create(FWcyan.prototype.Element.prototype);
    FWcyan.prototype.Popup.prototype.disable = function(){
        this._template.disable();
    };
    FWcyan.prototype.Popup.prototype.open = function(e){
        this._parent._popup_active = this;
        this._parent.resize();
        this._parent.draw();
    };
    FWcyan.prototype.Popup.prototype.close = function(e){
        this._parent._popup_active = null; 
        this._parent.resize();
        this._parent.draw();
    };
    FWcyan.prototype.Popup.prototype.point = function(e){
        this._template.point(e);
    };
    FWcyan.prototype.Popup.prototype.movepoint = function(e){
        this._template.movepoint(e);
    };
    FWcyan.prototype.Popup.prototype.resize = function(e){
        this._template.resize(e);
    };
    FWcyan.prototype.Popup.prototype.draw = function(){
        this._template.draw();
    };
    FWcyan.prototype.Popup.prototype.setTemplate = function(template){
        this._template = template;
    };
    FWcyan.prototype.Popup.create = function(template, proto){
        proto = proto || this.prototype;
        var popup = FWcyan.prototype.Element.create(proto);
        popup._template = template;
        return popup;
    };

    FWcyan.create = function(canvas, plugins){
        fwcyan = Object.create(FWcyan.prototype);
        fwcyan.setCanvas(canvas);
        fwcyan._main = null;
        fwcyan._popups = [];
        fwcyan._popup_active = null;
        fwcyan.plugin = {};

        var l = plugins.length;
        for(var i=0; i<l; i++){ plugins[i](fwcyan); }
        return fwcyan;
    };

    return FWcyan.create;
})();
