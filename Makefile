
CFLAGS = -std=c99 -O3 -Ofast -flto

all: pbr

pbr: pbr.o

#pbr-gui: board.o pbr-ems.o

pbr-ems.o: board.h

pbr.o: board.h board.c game.h game.c

clean:
	rm -rf *.o pbr

.PHONY: all clean
