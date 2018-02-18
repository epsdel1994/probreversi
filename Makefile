
CFLAGS = -std=c99 -O3 -Ofast -flto

#all: pbr pbr-gui
all: pbr

#pbr: pbr.o board.o
pbr: pbr.o

#pbr-gui: board.o pbr-ems.o

pbr-ems.o: board.h

board.o: board.h

pbr.o: board.h

clean:
	rm -rf *.o pbr

.PHONY: all clean
