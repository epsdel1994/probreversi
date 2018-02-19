
CFLAGS = -std=c99 -O3 -Ofast -flto

all: pbr pbr-gui

pbr: pbr.o

pbr-gui: pbr.o
	mkdir pbr-gui
	cp index.html FWcyan.js gui-board.js gui-pre.js pbr-gui

pbr.o: board.h board.c game.h game.c

clean:
	rm -rf *.o pbr pbr-gui

.PHONY: all clean
