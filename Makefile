
CFLAGS = -std=c99 -O3 -Ofast -flto

all: pbr pbr-gui

pbr: pbr.o

pbr-gui: pbr.o
	mkdir pbr-gui
	cp gui-main.html pbr-gui/index.html
	cp FWcyan.js gui-board.js pbr-gui
	emcc -o pbr-gui/gui.js --pre-js gui-pre.js gui.c

pbr.o: board.h board.c game.h game.c

clean:
	rm -rf *.o pbr pbr-gui

.PHONY: all clean
