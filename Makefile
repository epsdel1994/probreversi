
CFLAGS = -std=c99 -O3 -Ofast -flto

all: pbr pbr-gui

pbr: pbr.c board.h board.c game.h game.c
	cc $(CFLAGS) $(LDFLAGS) -o pbr pbr.c

pbr-gui: gui-main.html FWcyan.js gui-board.js cache.manifest gui-pre.js gui.c pbr.c board.h board.c game.h game.c
	mkdir -p pbr-gui
	cp gui-main.html pbr-gui/index.html
	cp FWcyan.js gui-board.js cache.manifest pbr-gui
	emcc -std=c99 -O0 -g gui.c -o pbr-gui/gui.js --pre-js gui-pre.js \
		-s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'

clean:
	rm -rf *.o pbr pbr-gui

.PHONY: all clean
